import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Card from './../../components/uno/Card';
import { useGameContext } from '@/context/GameContext';

export default function GameScreen() {
  const router = useRouter();
  const {
    player1Deck,
    player2Deck,
    playedCardsPile,
    drawCardPile,
    currentColor,
    currentNumber,
    turn,
    isUnoButtonPressed,
    onPlayCard,
    onDrawCard,
    onUno,
    handleAbandonGame,
  } = useGameContext();

  return (
      <View style={styles.container}>
        <Text style={styles.text}>Main du bot</Text>
        <ScrollView horizontal style={styles.cardContainer}>
          {player2Deck.map((card, index) => (
              <Card
                  key={index}
                  color={card.color}
                  value={card.value}
                  visible={card.visible}
                  disabled={turn === 'player1'} // Désactiver les cartes du bot si c'est le tour du joueur
              />
          ))}
        </ScrollView>

        <View style={styles.hr} />
        <View style={styles.piocheEtTable}>
          <Card
              color={drawCardPile[0]?.color || 'defaultColor'}
              value={drawCardPile[0]?.value || 'defaultValue'}
              visible={false}
              disabled={true} // La pioche n'est jamais cliquable
          />

          <Card
              color={currentColor}
              value={currentNumber}
              visible={true}
              disabled={true} // La carte sur la table n'est jamais cliquable
          />
        </View>
        <View style={styles.hr} />

        <Text style={styles.text}>Votre main</Text>
        <ScrollView horizontal style={styles.cardContainer}>
          {player1Deck.map((card, index) => (
              <Card
                  key={index}
                  color={card.color}
                  value={card.value}
                  visible={card.visible}
                  disabled={turn === 'player2'} // Désactiver les cartes du joueur si c'est le tour du bot
              />
          ))}
        </ScrollView>

        <View style={styles.endGame}>
          <View style={styles.hr} />
          <Button color="red" title="Abandonner" onPress={handleAbandonGame} />
          <Button color="blue" title="Tirer une carte" onPress={onDrawCard} />
          <Button color="green" title="UNO" onPress={onUno} />
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
    marginBottom: 20,
  },
  hr: {
    width: '100%',
    height: 1,
    backgroundColor: 'white',
    marginVertical: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    maxHeight: 120,
  },
  endGame: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  piocheEtTable: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});