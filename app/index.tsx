import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { useColorScheme } from './hooks/useColorScheme';
import { ThemedText } from './componemts/ThemedText';
import { ThemedView } from './componemts/ThemedView';
import { useRouter, Link, Redirect } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import "../global.css"

export default function LandingPage() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const navigation = useNavigation();
  
  return (
    <ThemedView className="flex-1 justify-center items-center">
      <ThemedText>Welcome To Health Care</ThemedText>
      <ThemedText>Make your life better</ThemedText>
      <Link className="text-xl font-bold text-red-600" href="../(tabs)">Go To Home Page!</Link>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(auth)/login')}
      >
        <ThemedText style={styles.buttonText}>Login</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(auth)/register')}
      >
        <ThemedText style={styles.buttonText}>Register</ThemedText>
      </TouchableOpacity>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});