import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="verify-token" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="login-email-password" />
        <Stack.Screen name="login-email-only" />
        <Stack.Screen name="create-account" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="sunday-school" />
        <Stack.Screen name="sunday-school-years" />
        <Stack.Screen name="sunday-school-lesson" />
        <Stack.Screen name="manuals" />
        <Stack.Screen name="manual-years" />
        <Stack.Screen name="manual-language" />
        <Stack.Screen name="manual-lessons" />
        <Stack.Screen name="manual-lesson" />
        <Stack.Screen name="hymns" />
        <Stack.Screen name="hymn-detail" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="quiz-years" />
        <Stack.Screen name="quiz-lessons" />
        <Stack.Screen name="quiz-questions" />
        <Stack.Screen name="quiz-results" />
        <Stack.Screen name="quiz-history" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="payment-history" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="help-support" />
        <Stack.Screen name="about" />
        <Stack.Screen name="menu-page" />
        <Stack.Screen name="not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
