import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function JoinMeetScreen() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const handleJoin = () => {
    if (roomId.trim().length < 4) {
      Alert.alert('Invalid Room ID');
      return;
    }
    router.replace({ pathname: '/meeting', params: { roomId, host: 'false' } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Room ID to Join</Text>
      <TextInput
        placeholder="Room ID"
        value={roomId}
        onChangeText={setRoomId}
        style={styles.input}
      />
      <Button title="Join Meeting" onPress={handleJoin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10 },
});
