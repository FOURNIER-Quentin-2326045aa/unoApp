import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Card from './../../components/uno/Card';

import { AllCards } from '@/constants/AllCards';

export default function GameScreen() {
  const router = useRouter();

  const handleAbandonGame = () => {
    router.replace('/');
  };

  // Constante, tableau de toutes les cartes d'un jeu de uno
  const allCards = AllCards();

  // On cree la pioche (mélange les cartes aléatoirement et fais une pile)
    const deck = allCards.sort(() => Math.random() - 0.5);

    // On distribue les cartes aux joueurs
    const playerHand = deck.slice(0, 7).map((card) => ({ ...card, visible: true }));
    const botHand = deck.slice(7, 14).map((card) => ({ ...card, visible: false }));
    // On enleve les cartes distribuées de la pioche
    const newDeck = deck.slice(14);

    // on prend la premiere carte de la pile pour la poser sur la table
    const table = newDeck[0];
    table.visible = true;
    // on enleve la carte de la pile
    newDeck.shift();

    // affichage des cartes dans la console pour vérifier
    console.log(playerHand);
    console.log(botHand);
    console.log(newDeck);

  return (
    <View style={styles.container}>

        <Text style={styles.text}>Main du bot</Text>
        <ScrollView horizontal style={styles.cardContainer}>
          {botHand.map((card, index) => (
            <Card key={index} color={card.color} value={card.value} visible={card.visible} />
          ))}
        </ScrollView>

        <View style={styles.hr} />
        <Card color={table.color} value={table.value} visible={table.visible} />
        <View style={styles.hr} />

        <Text style={styles.text}>Main du joueur</Text>
        <ScrollView horizontal style={styles.cardContainer}>
          {playerHand.map((card, index) => (
            <Card key={index} color={card.color} value={card.value} visible={card.visible} />
          ))}
        </ScrollView>

    <View style={styles.endGame}>

      <View style={styles.hr} />

      <Button color="red" title="Abandonner" onPress={handleAbandonGame} />
    </View>

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20, // Espacement entre le texte et les cartes
  },
  hr: {
    width: '100%', // Largeur de la ligne
    height: 1,    // Épaisseur de la ligne
    backgroundColor: 'white', // Couleur de la ligne
    marginVertical: 20, // Espace autour de la ligne
  },
  cardContainer: {
    flexDirection: 'row',
    maxHeight: 120, // Hauteur maximale de la ScrollView
    bottom: 0, // Aligner les cartes en bas
  },
  endGame: {
    position: 'absolute', // Position absolue pour le footer
    bottom: 0, // En bas de l'écran
    width: '100%', // Prend toute la largeur    
  },
});
