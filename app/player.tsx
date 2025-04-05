import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

export default function Player() {
  const { path } = useLocalSearchParams<{ path: string }>();

  const playAudio = async () => {
    await audioRecorderPlayer.startPlayer(path);
  };

  const stopAudio = async () => {
    await audioRecorderPlayer.stopPlayer();
  };

  useEffect(() => {
    return () => {
      audioRecorderPlayer.stopPlayer();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Playback</Text>
      <Text>{path}</Text>
      <Button title="Play" onPress={playAudio} />
      <Button title="Stop" onPress={stopAudio} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
});
