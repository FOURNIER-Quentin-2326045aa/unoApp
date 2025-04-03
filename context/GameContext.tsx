import React, { createContext, useContext, useState, useEffect } from 'react';
import { AllCards } from '@/constants/AllCards';
import {router, useRouter} from "expo-router";


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
    isUnoForgotten: boolean;  // Ajout de cet état
    initializeGame: () => void;
    onPlayCard: (card: Card) => void;
    onDrawCard: () => void;
    onUno: () => void;
    handleAbandonGame: () => void;
    handleIsUnoForgotten: (value: boolean) => void;  // Méthode pour changer l'état de isUnoForgotten
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
    const [isUnoForgotten, setIsUnoForgotten] = useState(false);  // Ajout de l'état isUnoForgotten


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
        console.log(turn)
    };

    const onPlayCard = (card: Card) => {

        // Vérifier si la carte peut être jouée
        console.log('cest le tour de', turn,'qui joue la carte', card);
        console.log('deck1 joué',player1Deck);
        console.log('deck2',player2Deck)
        //Vérification UNO : si le joueur a une seule carte et n'a pas appuyé sur le bouton "UNO", il prend +2


        if (card.color ===  colorPlayed || card.value === currentNumber || card.color === "wild") {

            if (card.color === 'wild') {
                if(card.value === 'draw') {
                    console.log('Carte Wild +4 jouée par' ,turn);
                    onDraw(turn === 'player1' ? 'player2' : 'player1',4);
                    console.log('deck modifié',player1Deck);
                    console.log('deck modifié',player2Deck);

                }
                if(turn === "player2"){
                    setPendingWildCard(card); // Stocke la carte en attente
                    return;
                }

                console.log('Carte Wild jouée par',turn,' affichage du modal');

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


            if (card.value === "draw" && card.color !== "wild") {
                // +2 : L'autre joueur pioche et le tour ne change pas
                const nextPlayer = turn == 'player1' ? 'player2' : 'player1';
                console.log('Carte +2 jouéepar',turn,' ', nextPlayer, 'pioche 2 cartes');
                onDraw(nextPlayer,2);
                setTurn(nextPlayer);
            }  else if (card.value == "skip") {
                // Skip : Le joueur garde son tour
                setTurn(turn);
                console.log('Carte Skip jouée,', turn, 'garde son tour');
                // Si c'est le bot, planifier une autre action

            } else if (card.value == "reverse") {
                // Reverse agit comme un Skip en 2 joueurs
                setTurn(turn);
                console.log('Carte Reverse jouée,', turn, 'garde son tour');
                // Si c'est le bot, planifier une autre action

            } else {
                // Sinon, passer au joueur suivant

                setTurn(turn == 'player1' ? 'player2' : 'player1');
                console.log('Carte jouée, passage au joueur suivant',turn);
            }
        }
    };

    const applyColorChoice = (color: string) => {
        console.log('🎨 Couleur choisie :', color);
        if (pendingWildCard) {
            console.log('Carte en attente:', pendingWildCard);
            setCurrentColor(color);
           console.log('couleur mis a jour',color);
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
        return;
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
        if (drawnCard.color === colorPlayed || drawnCard.value === currentNumber || drawnCard.color === "wild") {
            setTimeout(() => {
                onPlayCard(drawnCard);
            }
            , 500); // Délai de 1 seconde avant de jouer la carte piochée
        }else {
            // Passer au joueur suivant
            setTurn(turn === 'player1' ? 'player2' : 'player1');
        }

    };

    const onDraw = (other: 'player1' | 'player2',count: number) => {
        console.log('Pioche de', count, 'cartes pour', other);
        if (drawCardPile.length < count) return; // Vérifier qu'il y a au moins 2 cartes à piocher

        // On prend les 2 premières cartes et on les rend visibles
        const drawnCards = drawCardPile.slice(0, count).map(card => ({ ...card, visible: true }));

        // Ajouter les cartes piochées au deck du joueur concerné
        if (other === 'player1') {
            setPlayer1Deck((prev) => [...prev, ...drawnCards]);
        } else {
            setPlayer2Deck((prev) => [...prev, ...drawnCards]);
        }

        // Mettre à jour la pioche en enlevant les cartes piochées
        setDrawCardPile((prev) => prev.slice(count));
    };



    const handlePlayCard = (card) => {
        console.log('Carte jouée:', card);
        if (card.value === 'draw' && card.color === 'wild') {
          console.log('Affichage du modal');
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



    const handleIsUnoForgotten = (value: boolean) => {
        setIsUnoForgotten(value);
    };


    const checkWin = () => {
        if (player1Deck.length === 0 && handleIsUnoForgotten(true)) {
            console.log(turn, "n'a pas dit UNO ! Il pioche +2 cartes.");
            onDraw(turn, 2);
        }
        if (player1Deck.length === 0) return 'Player';
        if (player2Deck.length === 0) return 'Bot';

        return null;
    };




    const router = useRouter();

    const handleAbandonGame = () => {
        router.replace('/'); // Redirige vers la page d'accueil
    };

    useEffect(() => {
        // Surveille les changements de pendingWildCard
        if (pendingWildCard) {
            // Logique qui attend que la carte soit choisie avant de passer au bot (si nécessaire)
            console.log('Carte wild en attente:', pendingWildCard);
            // Si le tour est celui du bot, choisir la couleur automatiquement après un délai pour imiter l'attente
            console.log('Tour actuel:', turn);
            if (turn === 'player2') {
                console.log("Sélection de la couleur en cours...");
                const wildColors = ["red", "blue", "yellow", "green"];
                const chosenColor = wildColors[Math.floor(Math.random() * wildColors.length)];
                console.log("Le bot a choisi la couleur", chosenColor);

                // Applique la couleur choisie automatiquement
                applyColorChoice(chosenColor);
            }
        }
    }, [pendingWildCard]);

    useEffect(() => {
        if (turn === "player2") {
            botPlay(); // Appelle la fonction pour jouer le tour du bot

        }
    }, [turn]);

    const botPlay = () => {
        const playTurn = () => {
            let playableCards = player2Deck.filter(
                (card) =>
                    card.color === colorPlayed ||
                    card.value === currentNumber ||
                    card.color === "wild"
            );

            if (playableCards.length > 0) {
                const chosenCard = playableCards[Math.floor(Math.random() * playableCards.length)];

                console.log('Carte jouée par le bot:', chosenCard);

                // Jouer la carte
                onPlayCard(chosenCard);

                // Vérification spéciale pour skip/reverse
                if (chosenCard.value === "reverse" || chosenCard.value === "skip") {
                    console.log('Carte spéciale jouée, le bot rejoue');

                    // Mise à jour immédiate du deck
                    setPlayer2Deck((prev) => prev.filter((item) => item.color !== chosenCard.color || item.value !== chosenCard.value));

                    // Attendre un peu et vérifier si le bot peut encore jouer
                    setTimeout(() => {
                        playableCards = player2Deck.filter(
                            (card) =>
                                card.color === colorPlayed ||
                                card.value === currentNumber ||
                                card.color === "wild"
                        );

                        if (playableCards.length > 1 ) {
                            console.log("Le bot peut rejouer une autre carte.");
                            botPlay(); // Le bot continue son tour
                        } else {
                            console.log("Le bot n'a plus de carte jouable après skip/reverse, il pioche.");
                            onDrawCard(); // Forcer la pioche
                        }
                    }, 500); // Petit délai pour attendre la mise à jour
                }
            } else {
                console.log('Aucune carte jouable, le bot pioche une carte');
                onDrawCard();

                setTimeout(() => {
                    playableCards = player2Deck.filter(
                        (card) =>
                            card.color === colorPlayed ||
                            card.value === currentNumber ||
                            card.color === "wild"
                    );

                    if (playableCards.length > 0) {
                        console.log('Carte jouable après pioche:', playableCards);
                        const chosenCard = playableCards[Math.floor(Math.random() * playableCards.length)];
                        onPlayCard(chosenCard);

                        // Vérifier si la carte jouée est une carte spéciale
                        if (chosenCard.value === "reverse" || chosenCard.value === "skip") {
                            console.log('Carte spéciale jouée après pioche, le bot rejoue');
                            botPlay();
                        } else if (chosenCard.color === "wild") {
                            const wildColors = ["red", "blue", "yellow", "green"];
                            const chosenColor = wildColors[Math.floor(Math.random() * wildColors.length)];
                            console.log("Le bot a choisi la couleur", chosenColor);
                            applyColorChoice(chosenColor);
                            setTurn("player1");
                        }
                    } else {
                        console.log('Aucune carte jouable après pioche, le tour est passé au joueur 1');
                        setTimeout(() => setTurn("player1"), 2000);
                    }
                }, 1000);
            }
        };

        setTimeout(playTurn, 2000);
    };




    return (
        <GameContext.Provider
            value={{
                colorPlayed,
                player1Deck,
                player2Deck,
                playedCardsPile,
                drawCardPile,
                currentColor,
                currentNumber,
                turn,
                isUnoButtonPressed,
                showUnoLogo,
                isUnoForgotten,  // Fournir l'état isUnoForgotten
                initializeGame,
                onPlayCard,
                onDrawCard,
                onUno,
                handleAbandonGame,
                handleIsUnoForgotten,  // Fournir la méthode
                checkWin
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