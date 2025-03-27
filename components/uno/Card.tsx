// Card.tsx
import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';

// Définir l'interface des props pour le composant Carte
interface CardProps {
  color: string;
  // 0 a 9, draw, reverse, skip
  value: string;
  visible: boolean;
}

// Créer un objet pour mapper chaque carte à son image
const cardImages: { [key: string]: any } = {
  // Cartes rouges
  'Red-0': require('@/assets/images/unoPack/Red_0.png'),
  'Red-1': require('@/assets/images/unoPack/Red_1.png'),
  'Red-2': require('@/assets/images/unoPack/Red_2.png'),
  'Red-3': require('@/assets/images/unoPack/Red_3.png'),
  'Red-4': require('@/assets/images/unoPack/Red_4.png'),
  'Red-5': require('@/assets/images/unoPack/Red_5.png'),
  'Red-6': require('@/assets/images/unoPack/Red_6.png'),
  'Red-7': require('@/assets/images/unoPack/Red_7.png'),
  'Red-8': require('@/assets/images/unoPack/Red_8.png'),
  'Red-9': require('@/assets/images/unoPack/Red_9.png'),

  'Red-skip': require('@/assets/images/unoPack/Red_Skip.png'),
  'Red-reverse': require('@/assets/images/unoPack/Red_Reverse.png'),
  'Red-draw': require('@/assets/images/unoPack/Red_Draw.png'),
  
  // Cartes vertes
  'Green-0': require('@/assets/images/unoPack/Green_0.png'),
  'Green-1': require('@/assets/images/unoPack/Green_1.png'),
  'Green-2': require('@/assets/images/unoPack/Green_2.png'),
  'Green-3': require('@/assets/images/unoPack/Green_3.png'),
  'Green-4': require('@/assets/images/unoPack/Green_4.png'),
  'Green-5': require('@/assets/images/unoPack/Green_5.png'),
  'Green-6': require('@/assets/images/unoPack/Green_6.png'),
  'Green-7': require('@/assets/images/unoPack/Green_7.png'),
  'Green-8': require('@/assets/images/unoPack/Green_8.png'),
  'Green-9': require('@/assets/images/unoPack/Green_9.png'),

  'Green-skip': require('@/assets/images/unoPack/Green_Skip.png'),
  'Green-reverse': require('@/assets/images/unoPack/Green_Reverse.png'),
  'Green-draw': require('@/assets/images/unoPack/Green_Draw.png'),

  // Cartes bleues
  'Blue-0': require('@/assets/images/unoPack/Blue_0.png'),
  'Blue-1': require('@/assets/images/unoPack/Blue_1.png'),
  'Blue-2': require('@/assets/images/unoPack/Blue_2.png'),
  'Blue-3': require('@/assets/images/unoPack/Blue_3.png'),
  'Blue-4': require('@/assets/images/unoPack/Blue_4.png'),
  'Blue-5': require('@/assets/images/unoPack/Blue_5.png'),
  'Blue-6': require('@/assets/images/unoPack/Blue_6.png'),
  'Blue-7': require('@/assets/images/unoPack/Blue_7.png'),
  'Blue-8': require('@/assets/images/unoPack/Blue_8.png'),
  'Blue-9': require('@/assets/images/unoPack/Blue_9.png'),

  'Blue-skip': require('@/assets/images/unoPack/Blue_Skip.png'),
  'Blue-reverse': require('@/assets/images/unoPack/Blue_Reverse.png'),
  'Blue-draw': require('@/assets/images/unoPack/Blue_Draw.png'),

  // Cartes jaunes
  'Yellow-0': require('@/assets/images/unoPack/Yellow_0.png'),
  'Yellow-1': require('@/assets/images/unoPack/Yellow_1.png'),
  'Yellow-2': require('@/assets/images/unoPack/Yellow_2.png'),
  'Yellow-3': require('@/assets/images/unoPack/Yellow_3.png'),
  'Yellow-4': require('@/assets/images/unoPack/Yellow_4.png'),
  'Yellow-5': require('@/assets/images/unoPack/Yellow_5.png'),
  'Yellow-6': require('@/assets/images/unoPack/Yellow_6.png'),
  'Yellow-7': require('@/assets/images/unoPack/Yellow_7.png'),
  'Yellow-8': require('@/assets/images/unoPack/Yellow_8.png'),
  'Yellow-9': require('@/assets/images/unoPack/Yellow_9.png'),

  'Yellow-skip': require('@/assets/images/unoPack/Yellow_Skip.png'),
  'Yellow-reverse': require('@/assets/images/unoPack/Yellow_Reverse.png'),
  'Yellow-draw': require('@/assets/images/unoPack/Yellow_Draw.png'),

  // Cartes spéciales
  'Wild-': require('@/assets/images/unoPack/Wild.png'),
  'Wild-draw': require('@/assets/images/unoPack/Wild_Draw.png'),

  'back': require('@/assets/images/unoPack/Deck.png'),
};

const Card: React.FC<CardProps> = ({ color, value, visible }) => {
  // Créer une clé unique pour chaque carte
  const cardKey = `${color.charAt(0).toUpperCase() + color.slice(1)}-${value}`; // La première lettre de color devient une majuscule

  let image = null;
  if (visible) {
    image = cardImages[cardKey];
  } else {
    image = cardImages['back'];
  }

  if (!image) {
    return null; // Si l'image n'existe pas, on ne rend rien
  }

  const handleCardPress = () => {
    alert(`Carte cliquée: ${cardKey}`);
  }

  return (
    <View>
      <TouchableOpacity onPress={handleCardPress}>
        <Image source={image} style={styles.cardImage} />
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  cardImage: {
    width: 80,
    height: 120,
    margin: 5,
  },
});

export default Card;
