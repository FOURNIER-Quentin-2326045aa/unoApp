import React, { createContext, useContext, useState, useEffect } from 'react';
import { AllCards } from '@/constants/AllCards';
import {router, useRouter} from "expo-router";

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
        setCurrentNumber(tableCard.value);
    };

    const onPlayCard = (card: Card) => {
        // Vérifier si la carte peut être jouée
        if (card.color === currentColor || card.value === currentNumber || card.color === "WILD") {

            // Mettre à jour la pile de cartes jouées
            setPlayedCardsPile((prev) => [...prev, card]);

            // Mettre à jour la couleur et le nombre actuels
            setCurrentColor(card.color);
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

        // Vérifier si la carte piochée est jouable
        if (drawnCard.color === currentColor || drawnCard.value === currentNumber || drawnCard.color === "WILD") {
            setTimeout(() => {
                onPlayCard(drawnCard); // Joue la carte immédiatement
                setTurn(turn === 'player1' ? 'player2' : 'player1'); // Change de tour après avoir joué
            }, 500); // Petit délai pour simuler le temps de réaction
        } else {
            // Si elle n'est pas jouable, on change de tour immédiatement
            setTurn(turn === 'player1' ? 'player2' : 'player1');
        }
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

    const router = useRouter();

    const handleAbandonGame = () => {
        router.replace('/'); // Redirige vers la page d'accueil
    };
    useEffect(() => {
        if (turn === 'player2') {
            setTimeout(() => {
                const playableCards = player2Deck.filter(card =>
                    card.color === currentColor || card.value === currentNumber || card.color === "WILD"
                );

                if (playableCards.length > 0) {
                    const randomCard = playableCards[Math.floor(Math.random() * playableCards.length)];
                    onPlayCard(randomCard);
                } else {
                    onDrawCard();
                }
            }, 1000); // Attendre 1 seconde pour simuler un temps de réflexion
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