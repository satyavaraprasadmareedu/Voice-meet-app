import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function HomeScreen() {
  const { user } = useLocalSearchParams<{ user: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user}</Text>
      <Button title="Create Meet" onPress={() => router.push({ pathname: '/create', params: { user } })} />
      <Button title="Join Meet" onPress={() => router.push('/join')} />
      <Button title="Audio History" onPress={() => router.push('/history')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
});


