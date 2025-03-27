import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Card from './../../components/uno/Card';

export default function GameScreen() {
  const router = useRouter();

  const handleAbandonGame = () => {
    router.replace('/');
  };

  // Constante, tableau de toutes les cartes d'un jeu de uno
  const allCards = [
    { color: 'red', value: '0', visible: false },
    { color: 'red', value: '1', visible: false },
    { color: 'red', value: '2', visible: false },
    { color: 'red', value: '3', visible: false },
    { color: 'red', value: '4', visible: false },
    { color: 'red', value: '5', visible: false },
    { color: 'red', value: '6', visible: false },
    { color: 'red', value: '7', visible: false },
    { color: 'red', value: '8', visible: false },
    { color: 'red', value: '9', visible: false },
    { color: 'red', value: 'skip', visible: false },
    { color: 'red', value: 'reverse', visible: false },
    { color: 'red', value: 'draw', visible: false },
    { color: 'green', value: '0', visible: false },
    { color: 'green', value: '1', visible: false },
    { color: 'green', value: '2', visible: false },
    { color: 'green', value: '3', visible: false },
    { color: 'green', value: '4', visible: false },
    { color: 'green', value: '5', visible: false },
    { color: 'green', value: '6', visible: false },
    { color: 'green', value: '7', visible: false },
    { color: 'green', value: '8', visible: false },
    { color: 'green', value: '9', visible: false },
    { color: 'green', value: 'skip', visible: false },
    { color: 'green', value: 'reverse', visible: false },
    { color: 'green', value: 'draw', visible: false },
    { color: 'blue', value: '0', visible: false },
    { color: 'blue', value: '1', visible: false },
    { color: 'blue', value: '2', visible: false },
    { color: 'blue', value: '3', visible: false },
    { color: 'blue', value: '4', visible: false },
    { color: 'blue', value: '5', visible: false },
    { color: 'blue', value: '6', visible: false },
    { color: 'blue', value: '7', visible: false },
    { color: 'blue', value: '8', visible: false },
    { color: 'blue', value: '9', visible: false },
    { color: 'blue', value: 'skip', visible: false },
    { color: 'blue', value: 'reverse', visible: false },
    { color: 'blue', value: 'draw', visible: false },
    { color: 'yellow', value: '0', visible: false },
    { color: 'yellow', value: '1', visible: false },
    { color: 'yellow', value: '2', visible: false },
    { color: 'yellow', value: '3', visible: false },
    { color: 'yellow', value: '4', visible: false },
    { color: 'yellow', value: '5', visible: false },
    { color: 'yellow', value: '6', visible: false },
    { color: 'yellow', value: '7', visible: false },
    { color: 'yellow', value: '8', visible: false },
    { color: 'yellow', value: '9', visible: false },
    { color: 'yellow', value: 'skip', visible: false },
    { color: 'yellow', value: 'reverse', visible: false },
    { color: 'yellow', value: 'draw', visible: false },
    { color: 'wild', value: '', visible: false },
    { color: 'wild', value: '', visible: false },
    { color: 'wild', value: '', visible: false },
    { color: 'wild', value: '', visible: false },
    { color: 'wild', value: 'draw', visible: false },
    { color: 'wild', value: 'draw', visible: false },
    { color: 'wild', value: 'draw', visible: false },
    { color: 'wild', value: 'draw', visible: false },
  ];

  // On cree la pioche (mélange les cartes aléatoirement et fais une pile)
    let deck = allCards.sort(() => Math.random() - 0.5);

    // On distribue les cartes aux joueurs
    const playerHand = deck.slice(0, 7).map((card) => ({ ...card, visible: true }));
    const botHand = deck.slice(7, 14).map((card) => ({ ...card, visible: false }));
    // On enleve les cartes distribuées de la pioche
    deck = deck.slice(14);

    // on prend la premiere carte de la pile pour la poser sur la table
    const table = deck[0];
    table.visible = true;
    // on enleve la carte de la pile
    deck.shift();

    // affichage des cartes dans la console pour vérifier
    console.log(playerHand);
    console.log(botHand);
    console.log(deck);
    console.log(table);

  return (
    <View style={styles.container}>

        <Text style={styles.text}>Main du bot</Text>
        <ScrollView horizontal style={styles.cardContainer}>
          {botHand.map((card, index) => (
            <Card key={index} color={card.color} value={card.value} visible={card.visible} />
          ))}
        </ScrollView>

        <View style={styles.hr} />
        <View style={styles.piocheEtTable}>
        <Card color={deck[0].color} value={deck[0].value} visible={false} />
        <Card color={table.color} value={table.value} visible={table.visible} />
        </View>
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
  piocheEtTable: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
