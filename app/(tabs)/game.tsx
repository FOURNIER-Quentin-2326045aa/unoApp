import React, { useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Image, Animated } from 'react-native';
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
    showUnoLogo,
    onPlayCard,
    onDrawCard,
    onUno,
    handleAbandonGame,
  } = useGameContext();

  // Animation pour le logo UNO
  const scale = useRef(new Animated.Value(1)).current;

  // Animation pour le logo UNO (oui je sais c'est moche)
  useEffect(() => {
    if (showUnoLogo) {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 2, // Agrandir
          duration: 1000, // Durée de l'agrandissement
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0, // Rétrécir jusqu'à disparaître
          duration: 1000, // Durée du rétrécissement
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(1);
    }
  }, [showUnoLogo, scale]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Main du bot</Text>
      <ScrollView horizontal style={styles.cardContainer}>
        {player2Deck.map((card, index) => (
          <Card
            key={index}
            color={card.color}
            value={card.value}
            visible={false} // Les cartes du bot ne sont pas visibles
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

      {/* Affichage de l'image du logo UNO si le bouton est pressé */}
      {showUnoLogo && (
        <View style={styles.unoLogoContainer}>
          <Animated.Image
            source={require('@/assets/images/unoLogo.png')} 
            style={[styles.unoLogo, { transform: [{ scale }] }]}
            resizeMode="contain"
          />
        </View>
      )}
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
  unoLogoContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  unoLogo: {
    width: 500,
    height: 500,
  },
});
