import React, { useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Image, Animated,TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Card from './../../components/uno/Card';
import { useGameContext } from '@/context/GameContext';
import { Modal } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';





export default function GameScreen() {
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


  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const canDraw = turn === 'player1' && drawCardPile.length > 0;

  // Gestion de l'abandon avec confirmation
  const quitGame = () => {
    setIsModalVisible(true);
  };



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
        <View style={styles.header}>
          <FontAwesome5 name="robot" size={30} color="white" />
          <Text style={styles.text}>Main du bot</Text>
        </View>
        <ScrollView horizontal style={styles.cardContainer}>
          {player2Deck.map((card, index) => (
              <Card key={index} color={card.color} value={card.value} visible={false} disabled />
          ))}
        </ScrollView>

        <View style={styles.hr} />

        <View style={styles.piocheEtTable}>
          <TouchableOpacity
              onPress={onDrawCard}
              style={[styles.pioche, canDraw && styles.piocheGlow]}
              disabled={!canDraw}
          >
            <Card color="black" value="Pioche" visible={false} />
          </TouchableOpacity>

          <Card color={currentColor} value={currentNumber} visible />
        </View>

        <View style={styles.hr} />

        <View style={styles.header}>
          <FontAwesome5 name="user" size={30} color="white" />
          <Text style={styles.text}>Votre main</Text>
        </View>
        <ScrollView horizontal style={styles.cardContainer}>
          {player1Deck.map((card, index) => (
              <Card key={index} color={card.color} value={card.value} visible disabled={turn === 'player2'} />
          ))}
        </ScrollView>

        <View style={styles.endGame}>
          <View style={styles.hr} />
          <TouchableOpacity onPress={quitGame} style={styles.abandonButton}>
            <Text style={styles.buttonText}>Abandonner</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onUno} style={styles.unoButton}>
            <Text style={styles.buttonText}>UNO</Text>
          </TouchableOpacity>
        </View>
          {/* Affichage de l'image du logo UNO si le bouton est pressé */}
          {showUnoLogo && (
              <View style={styles.unoLogoContainer}>
                  <Animated.Image
                      source={require('@/assets/images/unoLogo.png')}
                      style={[styles.unoLogo, { transform: [{ scale }] }]}
                      resizeMode="contain"
                  />
              </View> )}
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Voulez-vous vraiment abandonner la partie ?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAbandonGame} style={styles.confirmButton}>
                  <Text style={styles.buttonText}>Oui</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10383f',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  hr: {
    width: '100%',
    height: 30,
    marginVertical: 15,
  },
  cardContainer: {
    flexDirection: 'row',
    maxHeight: 120,
  },
  piocheEtTable: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  pioche: {
    padding: 10,
  },
  piocheGlow: {
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 12,
  },
  endGame: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  abandonButton: {
    backgroundColor: '#3878de',
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    width: 150,
    alignItems: 'center',
  },
  unoButton: {
    backgroundColor: '#941b1e',
    padding: 12,
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: '#16332BFF',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
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