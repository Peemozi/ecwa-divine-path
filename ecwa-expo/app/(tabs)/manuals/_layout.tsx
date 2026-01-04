import { Stack } from 'expo-router';

export default function ManualsStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="years" />
      <Stack.Screen name="language" />
      <Stack.Screen name="lessons" />
      <Stack.Screen name="lesson" />
    </Stack>
  );
}
