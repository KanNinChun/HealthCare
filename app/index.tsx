import { Text, View, Button } from "react-native";
import { useColorScheme } from './hooks/useColorScheme';
import { ThemedText } from './componemts/ThemedText';
import { ThemedView } from './componemts/ThemedView';
import { useRouter, Link, Redirect  } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function LandingPage() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText>Welcome To Health Care</ThemedText>
      <ThemedText>Make your life better</ThemedText>
      <Link href="../(tabs)">Go To Home Page!</Link>
    </ThemedView>
  );
}
