import React from 'react';
import { GameProvider } from '@/context/GameContext';
import GameScreen from '@/app/(tabs)/game';

export default function App() {
    return (
        <GameProvider>
            <GameScreen />
        </GameProvider>
    );
}
