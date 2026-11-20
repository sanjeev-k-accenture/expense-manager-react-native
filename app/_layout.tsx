import { Stack } from 'expo-router';
import { useEffect } from 'react';

import { initializeDatabase } from '../src/lib/transactions';

export default function RootLayout() {
  useEffect(() => {
    initializeDatabase().catch((error) => {
      console.error('Database initialization failed:', error);
    });
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0f172a',
        },
        headerTintColor: '#ffffff',
        contentStyle: {
          backgroundColor: '#f8fafc',
        },
      }}
    />
  );
}
