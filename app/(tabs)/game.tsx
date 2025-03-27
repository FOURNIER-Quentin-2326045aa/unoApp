import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function GameScreen() {
  const router = useRouter();

  const handleAbandonGame = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Page de jeu - à modifier</Text>
      <Button color="red" title="Abandonner" onPress={handleAbandonGame} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
