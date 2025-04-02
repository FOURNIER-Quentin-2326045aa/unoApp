import React, { createContext, useContext, useState, useEffect } from 'react';
import { AllCards } from '@/constants/AllCards';
import ColorPickerModal from '../modals/ColorPickerModal';


interface Card {
    color: string;
    value: string;
    visible: boolean;
}

interface GameContextType {
    player1Deck: Card[];
    player2Deck: Card[];
    playedCardsPile: Card[];
    drawCardPile: Card[];
    currentColor: string;
    colorPlayed: string;
    currentNumber: string;
    turn: 'player1' | 'player2';
    isUnoButtonPressed: boolean;
    initializeGame: () => void;
    onPlayCard: (card: Card) => void;
    onDrawCard: () => void;
    onUno: () => void;
    handleAbandonGame: () => void;
}

const GameContext = createContext<GameContextType>({} as GameContextType);

export const GameProvider: React.FC = ({ children }) => {
    const [player1Deck, setPlayer1Deck] = useState<Card[]>([]);
    const [player2Deck, setPlayer2Deck] = useState<Card[]>([]);
    const [playedCardsPile, setPlayedCardsPile] = useState<Card[]>([]);
    const [drawCardPile, setDrawCardPile] = useState<Card[]>([]);
    const [currentColor, setCurrentColor] = useState('');
    const [colorPlayed, setColorPlayed] = useState('');
    const [currentNumber, setCurrentNumber] = useState('');
    const [turn, setTurn] = useState<'player1' | 'player2'>('player1');
    const [isUnoButtonPressed, setUnoButtonPressed] = useState(false);
    const [isColorPickerVisible, setColorPickerVisible] = useState(false);
    const [pendingWildCard, setPendingWildCard] = useState<Card | null>(null);


    useEffect(() => {
        initializeGame();
    }, []);
  
    const initializeGame = () => {
        const allCards = AllCards(); // Récupération de toutes les cartes
        console.log('AllCards:', allCards); // Vérifie si allCards est bien un tableau

        let deck = allCards.sort(() => Math.random() - 0.5); // Mélange des cartes

        // Distribution des cartes aux joueurs
        const player1Hand = deck.slice(0, 7).map((card) => ({ ...card, visible: true }));
        const player2Hand = deck.slice(7, 14).map((card) => ({ ...card, visible: false }));
        deck = deck.slice(14);

        // On pose la première carte sur la table
        const tableCard = deck[0];

        tableCard.visible = true;
        deck.shift();

        // Mise à jour des états avec les mains des joueurs et la pile de cartes
        setPlayer1Deck(player1Hand);
        setPlayer2Deck(player2Hand);
        setPlayedCardsPile([tableCard]);
        setDrawCardPile(deck);
        setCurrentColor(tableCard.color);
        setCurrentNumber(tableCard.value);
    };

    const onPlayCard = (card: Card) => {
        // Vérifier si la carte peut être jouée (même couleur ou même nombre)
        if (card.color === colorPlayed || card.value === currentNumber || card.color === 'wild') {
            if(  card.value === 'reverse') {
                reverseTurn();
            }
            if (card.color === 'wild') {
                console.log('Carte Wild jouée, affichage du modal');
                
                setPendingWildCard(card); // Stocke la carte en attente
                setColorPickerVisible(true); // Affiche le modal
                 return;
            }

            // Ajouter la carte à la pile de cartes jouées
            setPlayedCardsPile((prev) => [...prev, card]);

            // Mettre à jour la carte actuelle
            setCurrentColor(card.color);
            setColorPlayed(card.color);
            setCurrentNumber(card.value);

            // Enlever la carte du deck du joueur
            if (turn === 'player1') {
                setPlayer1Deck((prev) => prev.filter((item) => item.color !== card.color || item.value !== card.value));
            } else {
                setPlayer2Deck((prev) => prev.filter((item) => item.color !== card.color || item.value !== card.value));
            }

            // Passer au joueur suivant
            setTurn(turn === 'player1' ? 'player2' : 'player1');
        }
    };
    const reverseTurn = () => {
        setTurn(turn === 'player1' ? 'player2' : 'player1');
    }
    const applyColorChoice = (color: string) => {
        console.log('🎨 Couleur choisie :', color);
        if (pendingWildCard) {
            setCurrentColor(color);
           
            setPlayedCardsPile((prev) => [...prev, pendingWildCard]);

                // Mettre à jour la carte actuelle
                setColorPlayed(color);
                setCurrentColor(pendingWildCard.color);
                setCurrentNumber(pendingWildCard.value);
    
                // Enlever la carte du deck du joueur
                if (turn === 'player1') {
                    setPlayer1Deck((prev) => prev.filter((item) => item.color !==pendingWildCard.color || item.value !== pendingWildCard.value));
                } else {
                    setPlayer2Deck((prev) => prev.filter((item) => item.color !== pendingWildCard.color || item.value !== pendingWildCard.value));
                }
            setPendingWildCard(null);
            setColorPickerVisible(false);
            setTurn(turn === 'player1' ? 'player2' : 'player1');
        }
    };


    const onDrawCard = () => {
        if (drawCardPile.length === 0) return;

        const drawnCard = drawCardPile[0];
        drawnCard.visible = true;

        if (turn === 'player1') {
            setPlayer1Deck((prev) => [...prev, drawnCard]);
        } else {
            setPlayer2Deck((prev) => [...prev, drawnCard]);
        }

        // Mettre à jour la pioche
        setDrawCardPile((prev) => prev.slice(1));
    };

    const onUno = () => {
        setUnoButtonPressed(true);
    };

    const handleAbandonGame = () => {
        // Logique pour abandonner le jeu (peut-être rediriger vers un autre écran)
        console.log('Game Abandoned');
    };
    const handlePlayCard = (card) => {
        console.log('Carte jouée:', card);
        if (card.value === 'draw' && card.color === 'wild') {
          console.log('Affichage du modal');
          setModalVisible(true);
        }
      };
      

    return (
        <GameContext.Provider
            value={{
                player1Deck,
                player2Deck,
                playedCardsPile,
                drawCardPile,
                currentColor,
                currentNumber,
                turn,
                isUnoButtonPressed,
                initializeGame,
                onPlayCard,
                onDrawCard,
                onUno,
                handleAbandonGame,applyColorChoice,
                handlePlayCard
                
            }}
        >
            <ColorPickerModal visible={isColorPickerVisible} onSelectColor={applyColorChoice} />
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
};