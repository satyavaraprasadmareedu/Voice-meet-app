import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function CreateMeetScreen() {
  const { user } = useLocalSearchParams<{ user: string }>();
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  useEffect(() => {
    setRoomId(generateRoomId());
  }, []);

  const handleStartMeeting = () => {
    router.replace({ pathname: '/meeting', params: { user, roomId, host: 'true' } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Room ID</Text>
      <Text style={styles.roomId}>{roomId}</Text>
      <Button title="Start Meeting" onPress={handleStartMeeting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 10 },
  roomId: { fontSize: 30, fontWeight: 'bold', marginBottom: 20 },
});