import React, { createContext, useContext, useState, useEffect } from 'react';
import { AllCards } from '@/constants/AllCards';

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
    const [currentNumber, setCurrentNumber] = useState('');
    const [turn, setTurn] = useState<'player1' | 'player2'>('player1');
    const [isUnoButtonPressed, setUnoButtonPressed] = useState(false);

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
        if (card.color === currentColor || card.value === currentNumber) {
            //Si un +2 valide
            if(card.color === currentColor && card.value === "draw" ){

                // Enlever la carte du deck du joueur
                if (turn === 'player1') {
                    setPlayer1Deck((prev) => prev.filter((item) => item.color !== card.color || item.value !== card.value));
                    onDraw2('player2')
                } else {
                    setPlayer2Deck((prev) => prev.filter((item) => item.color !== card.color || item.value !== card.value));
                    onDraw2('player1')
                }
                setTurn(turn === 'player1' ? 'player1' : 'player2');

            }

            //Si c'est Skip ou Reverse
            else if(card.color === currentColor && (card.value === "skip" || card.value ==="reverse")){
                // Enlever la carte du deck du joueur
                if (turn === 'player1') {
                    setPlayer1Deck((prev) => prev.filter((item) => item.color !== card.color || item.value !== card.value));
                } else {
                    setPlayer2Deck((prev) => prev.filter((item) => item.color !== card.color || item.value !== card.value));
                }
                setTurn(turn === 'player1' ? 'player1' : 'player2');
            }

            else {
                // Enlever la carte du deck du joueur
                if (turn === 'player1') {
                    setPlayer1Deck((prev) => prev.filter((item) => item.color !== card.color || item.value !== card.value));
                } else {
                    setPlayer2Deck((prev) => prev.filter((item) => item.color !== card.color || item.value !== card.value));
                }

                // Passer au joueur suivant
                setTurn(turn === 'player1' ? 'player2' : 'player1');
            }

            // Ajouter la carte à la pile de cartes jouées
            setPlayedCardsPile((prev) => [...prev, card]);

            // Mettre à jour la carte actuelle
            setCurrentColor(card.color);
            setCurrentNumber(card.value);

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
        onPlayCard(drawnCard);
    };
    const onDraw2 = (other) => {
        if (drawCardPile.length < 2) return; // Vérifier qu'il y a au moins 2 cartes à piocher

        const drawnCards = drawCardPile.slice(0, 2).map(card => ({ ...card, visible: true }));

        if (other === 'player1') {
            setPlayer1Deck((prev) => [...prev, ...drawnCards]);
        } else {
            setPlayer2Deck((prev) => [...prev, ...drawnCards]);
        }

        // Mettre à jour la pioche
        setDrawCardPile((prev) => prev.slice(2));
    };

    const onUno = () => {
        setUnoButtonPressed(true);
    };

    const handleAbandonGame = () => {
        // Logique pour abandonner le jeu (peut-être rediriger vers un autre écran)
        console.log('Game Abandoned');
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
                handleAbandonGame,
            }}
        >
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