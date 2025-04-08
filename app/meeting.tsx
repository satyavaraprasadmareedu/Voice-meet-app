import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RtcEngine, {
    ChannelProfileType,
    ClientRoleType,
    RtcSurfaceView,
  } from 'react-native-agora';
  

const audioRecorderPlayer = new AudioRecorderPlayer();
const AGORA_APP_ID = '20c7974e4d6f41078c9fcc2e3aaf450e';
function MeetingScreen() {
  const { user, host, roomId } = useLocalSearchParams();
  const isHost = host === 'true';
  const [isMuted, setIsMuted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [engine, setEngine] = useState<any>(null);

  useEffect(() => {
    const initAgora = async () => {
        const rtcEngine = await RtcEngine();
      await rtcEngine.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
      await rtcEngine.setClientRole(isHost ? ClientRoleType.ClientRoleBroadcaster : ClientRoleType.ClientRoleAudience);
      await rtcEngine.enableAudio();
      await rtcEngine.joinChannel("", roomId as string, 0, {
        clientRoleType: isHost
          ? ClientRoleType.ClientRoleBroadcaster
          : ClientRoleType.ClientRoleAudience,
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
      });     
      setEngine(rtcEngine);
    };

    initAgora();

    return () => {
      if (engine) {
        engine.leaveChannel();
        engine.destroy();
      }
    };
  }, []);

  const toggleMute = () => {
    if (engine) engine.muteLocalAudioStream(!isMuted);
    setIsMuted(!isMuted);
  };

  const startRecording = async () => {
    const path = Platform.select({ ios: 'meet.m4a', android: '/sdcard/meet.mp4' });
    await audioRecorderPlayer.startRecorder(path!);
    setRecording(true);
  };

  const stopRecording = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    const existing = await AsyncStorage.getItem('records');
    const records = existing ? JSON.parse(existing) : [];
    records.push({ path: result, date: new Date().toISOString() });
    await AsyncStorage.setItem('records', JSON.stringify(records));
    setRecording(false);
    Alert.alert('Recording saved.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room: {roomId}</Text>
      <Text>User: {user}</Text>
      <Button title={isMuted ? 'Unmute' : 'Mute'} onPress={toggleMute} />
      {isHost && (
        <Button
          title={recording ? 'Stop Recording' : 'Start Recording'}
          onPress={recording ? stopRecording : startRecording}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
});
export default MeetingScreen;