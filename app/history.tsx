import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

export default function PlayerScreen() {
  const { path } = useLocalSearchParams<{ path: string }>();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      // Stop playback when screen unmounts
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, []);

  const handlePlayPause = async () => {
    if (!path) return;

    if (isPlaying) {
      await audioRecorderPlayer.pausePlayer();
      setIsPlaying(false);
    } else {
      await audioRecorderPlayer.startPlayer(path);
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.currentPosition >= e.duration) {
          setIsPlaying(false);
          audioRecorderPlayer.stopPlayer();
        }
        return;
      });
      setIsPlaying(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recording Playback</Text>
      <Text style={styles.subtitle}>{path}</Text>
      <Button title={isPlaying ? 'Pause' : 'Play'} onPress={handlePlayPause} />
      <View style={{ marginTop: 20 }}>
        <Button title="Back to History" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 14, marginBottom: 20 },
});
