import { Text, View, Button } from "react-native";
import { useColorScheme } from './hooks/useColorScheme';
import { ThemedText } from './componemts/ThemedText';
import { ThemedView } from './componemts/ThemedView';
import { useRouter, Link, Redirect  } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import "../global.css"

export default function LandingPage() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  return (
    <ThemedView className="flex-1 justify-center items-center">
      <ThemedText>Welcome To Health Care</ThemedText>
      <ThemedText>Make your life better</ThemedText>
      <Link className="text-xl font-bold text-red-600" href="../(tabs)">Go To Home Page!</Link>
    </ThemedView>
  );
}