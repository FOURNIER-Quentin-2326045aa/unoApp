import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useRef } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 1.1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start(() => router.push('/App'));
  };

  return (
      <View style={styles.container}>
        <Image source={require('@/assets/images/background.jpg')} style={styles.background} />
        <Text style={styles.title}>Bienvenue dans UNO</Text>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={styles.playButton}
          >
            <Text style={styles.buttonText}>Jouer !</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 30,
  },
  playButton: {
    backgroundColor: '#05251d',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
});
