import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Onglets */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Écran du jeu Uno, sans la tab bar */}
      <Stack.Screen
        name="game"
        options={{
          presentation: 'modal', // Ouvre le jeu comme une modale
          headerShown: false, // Cache aussi le header
        }}
      />
    </Stack>
  );
}
