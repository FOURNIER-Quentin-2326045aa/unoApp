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
    showUnoLogo: boolean;
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
    const [showUnoLogo, setShowUnoLogo] = useState(false);
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

        // si la premiere carte de la pioche est une carte spéciale, on la remet dans le deck
        // Sinon, on la met sur la table
        let tableCard = deck[0];
        // Tant que la carte n'est pas un numéro, on la remet dans le deck
        while (!/^[0-9]$/.test(tableCard.value)) {
            // On enlève la carte du deck et on la remet a la fin du deck
            deck.shift();
            // On remet la carte dans le deck
            deck.push(tableCard);
            tableCard = deck[0];
        }

        tableCard.visible = true;
        deck.shift();

        // Mise à jour des états avec les mains des joueurs et la pile de cartes
        setPlayer1Deck(player1Hand);
        setPlayer2Deck(player2Hand);
        setPlayedCardsPile([tableCard]);
        setDrawCardPile(deck);
        setCurrentColor(tableCard.color);
        setColorPlayed(tableCard.color);
        setCurrentNumber(tableCard.value);
    };

    const onPlayCard = (card: Card) => {
        // Vérifier si la carte peut être jouée
        if (card.color ===  colorPlayed || card.value === currentNumber || card.color === "wild") {
            console.log('Carte jouée:', card);
            if (card.color === 'wild') {
                console.log('Carte Wild jouée, affichage du modal');
                
                setPendingWildCard(card); // Stocke la carte en attente
                setColorPickerVisible(true); // Affiche le modal
                 return;
            }
            // Mettre à jour la pile de cartes jouées
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


            // Gestion des cartes spéciales
            

            if (card.value === "draw") {
                // +2 : L'autre joueur pioche et le tour ne change pas
                const nextPlayer = turn === 'player1' ? 'player2' : 'player1';
                onDraw2(nextPlayer);
            } else if (card.value === "skip") {
                // Skip : Le joueur garde son tour pour enchaîner un autre coup
                setTurn(turn);
            } else if (card.value === "reverse") {
                // Reverse dans un jeu à 2 joueurs agit comme un Skip
                setTurn(turn);
            } else {
                // Sinon, passer au joueur suivant
                setTurn(turn === 'player1' ? 'player2' : 'player1');
            }
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
        
        // Si on peut jouer la carte piochée, on la joue automatiquement après 1 seconde
        if (drawnCard.color === colorPlayed || drawnCard.value === currentNumber || drawnCard.color === "WILD") {
            setTimeout(() => {
                onPlayCard(drawnCard);
            }
            , 500); // Délai de 1 seconde avant de jouer la carte piochée
        }
        // Passer au joueur suivant
        setTurn(turn === 'player1' ? 'player2' : 'player1');

    };

    const onDraw2 = (other: 'player1' | 'player2') => {
        if (drawCardPile.length < 2) return; // Vérifier qu'il y a au moins 2 cartes à piocher

        // On prend les 2 premières cartes et on les rend visibles
        const drawnCards = drawCardPile.slice(0, 2).map(card => ({ ...card, visible: true }));

        // Ajouter les cartes piochées au deck du joueur concerné
        if (other === 'player1') {
            setPlayer1Deck((prev) => [...prev, ...drawnCards]);
        } else {
            setPlayer2Deck((prev) => [...prev, ...drawnCards]);
        }

        // Mettre à jour la pioche en enlevant les cartes piochées
        setDrawCardPile((prev) => prev.slice(2));
    };

    const applyColorChoice = (color: string) => {
        console.log('🎨 Couleur choisie :', color);
        if (pendingWildCard) {
          
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
    const handlePlayCard = (card) => {
        console.log('Carte jouée:', card);
        if (card.value === 'draw' && card.color === 'wild') {
          console.log('Affichage du modal');
          setModalVisible(true);
        }
      };


    const onUno = () => {
        setUnoButtonPressed(true);
        setShowUnoLogo(true);
    
        setTimeout(() => {
            setShowUnoLogo(false);
            setUnoButtonPressed(false);
        }, 3000);
    };

    const handleAbandonGame = () => {
        // Logique pour abandonner le jeu (peut-être rediriger vers un autre écran)
        console.log('Game Abandoned');
    };

    useEffect(() => {
        if (turn === "player2") {
            const botPlay = () => {
                let keepPlaying = true; // Permet au bot de rejouer s'il le doit
    
                const playTurn = () => {
                    let playableCards = player2Deck.filter(
                        (card) =>
                            card.color === colorPlayed ||
                            card.value === currentNumber ||
                            card.color === "WILD"
                    );
    
                    if (playableCards.length > 0) {
                        const chosenCard = playableCards[Math.floor(Math.random() * playableCards.length)];
                        onPlayCard(chosenCard);
    
                        // Gestion des cartes spéciales
                        if (chosenCard.value === "skip" || chosenCard.value === "reverse") {
                            keepPlaying = true; // Le bot rejoue
                            setTimeout(playTurn, 1000); // Relance le tour après une pause
                        } else if (chosenCard.value === "draw") {
                            onDraw2("player1"); // Le joueur adverse pioche
                            keepPlaying = true; // Le bot rejoue
                            setTimeout(playTurn, 1000); // Relance le tour après une pause
                        } else {
                            keepPlaying = false; // Tour terminé, passage au joueur
                            setTimeout(() => setTurn("player1"), 500);
                        }
                    } else {
                        // Le bot pioche une carte et essaie de jouer
                        onDrawCard();
                        setTimeout(() => {
                            playableCards = player2Deck.filter(
                                (card) =>
                                    card.color === colorPlayed ||
                                    card.value === currentNumber ||
                                    card.color === "WILD"
                            );
    
                            if (playableCards.length > 0) {
                                const chosenCard = playableCards[Math.floor(Math.random() * playableCards.length)];
                                onPlayCard(chosenCard);
                                keepPlaying = false; // Une seule carte après pioche
                                setTimeout(() => setTurn("player1"), 500); // Passe le tour après avoir joué
                            } else {
                                setTimeout(() => setTurn("player1"), 500);
                            }
                        }, 1000);
                        keepPlaying = false; // Après la pioche, on arrête de rejouer
                    }
                };
    
                setTimeout(playTurn, 1000); // Commence le jeu avec un délai initial
            };
    
            botPlay(); // Appelle la fonction pour jouer le tour du bot
        }
    }, [turn]);
      

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
                showUnoLogo,
                initializeGame,
                onPlayCard,
                onDrawCard,
                onUno,
                handleAbandonGame,
                handlePlayCard,
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