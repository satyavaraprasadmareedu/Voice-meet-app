import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VoiceMeetApp</Text>
      <Button title="Create Meet" onPress={() => router.push('/meeting?host=true')} />
      <Button title="Join Meet" onPress={() => router.push('/meeting?host=false')} />
      <Button title="Audio History" onPress={() => router.push('/history')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center' },
});
