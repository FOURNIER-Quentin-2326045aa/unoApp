import { Stack } from 'expo-router';
import { GameProvider } from '@/context/GameContext';

export default function RootLayout() {
    return (
        <GameProvider>
            <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="game"
                    options={{
                        presentation: 'modal',
                        headerShown: false,
                    }}
                />
            </Stack>
        </GameProvider>
    );
}
