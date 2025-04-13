// app/screens/MeetingLobbyScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import { mediaDevices, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';

interface RouteParams {
  userId: string;
}

type MeetingLobbyScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MeetingLobby'>;

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export default function MeetingLobbyScreen() {
  const [isHost, setIsHost] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const navigation = useNavigation<MeetingLobbyScreenNavigationProp>();
  const route = useRoute();
  const { userId } = route.params as RouteParams;
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();
      setIsHost(userData?.role === 'host');
    };
    checkRole();

    const unsubscribe = onSnapshot(doc(db, 'meetingStatus', 'global'), (docSnap) => {
      if (docSnap.data()?.status === 'ended') {
        navigation.navigate('EndMeeting');
      }
    });

    return unsubscribe;
  }, []);

  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Microphone permission is required to use voice features.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Failed to request microphone permission:', error);
      alert('Something went wrong while requesting microphone permission.');
      return false;
    }
  };

  const startTalking = async () => {
    const granted = await requestMicrophonePermission();
    if (!granted) return;

    try {
      const stream = await mediaDevices.getUserMedia({ audio: true });
      const pc = new RTCPeerConnection(configuration);
      pcRef.current = pc;

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      if (!isHost) {
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: false,
        });
        
        await pc.setLocalDescription(offer);

        const offerRef = doc(db, 'offers', userId);
        await setDoc(offerRef, { sdp: offer.sdp, type: offer.type });

        onSnapshot(doc(db, 'answers', userId), async (snapshot) => {
          const data = snapshot.data();
          if (data?.type === 'answer') {
            if (data?.sdp && data?.type) {
              const remoteDesc = new RTCSessionDescription({
                sdp: data.sdp,
                type: data.type,
              });
              await pc.setRemoteDescription(remoteDesc);
            } else {
              console.error('Invalid SDP data received:', data);
            }
            
          }
        });
        

        onSnapshot(doc(db, 'iceCandidates', userId), async (snapshot) => {
          const data = snapshot.data();
          if (data?.candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });

        (pc as any).onicecandidate = (event : RTCPeerConnectionIceEvent) => {
          if (event.candidate) {
            setDoc(doc(db, 'userCandidates', userId), event.candidate.toJSON());
          }
        };

        setIsTalking(true);
      } else {
        // Host can listen to incoming connections
        console.log('Host is ready to receive audio');
      }
    } catch (err) {
      console.error('Error setting up WebRTC stream:', err);
    }
  };

  const stopTalking = () => {
    if (pcRef.current) {
      pcRef.current.getSenders().forEach((sender) => sender.track?.stop());
      pcRef.current.close();
      pcRef.current = null;
      setIsTalking(false);
    }
  };

  const handleEndMeeting = async () => {
    if (!isHost) return;
    await setDoc(doc(db, 'meetingStatus', 'global'), { status: 'ended' });
    navigation.navigate('EndMeeting');
  };

  return (
    <LinearGradient colors={['#141e30', '#243b55']} style={styles.container}>
      <Text style={styles.header}>Meeting Lobby ({isHost ? 'Host' : 'User'})</Text>

      <TouchableOpacity
        onPress={isTalking ? stopTalking : startTalking}
        style={[styles.micButton, isTalking && { backgroundColor: '#ff4d4d' }]}
      >
        <Text style={styles.buttonText}>
          {isTalking ? 'Release to Mute' : 'Hold to Talk'}
        </Text>
      </TouchableOpacity>

      {isHost && (
        <TouchableOpacity onPress={handleEndMeeting} style={styles.endButton}>
          <Text style={styles.endText}>End Meeting</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
  },
  micButton: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: '#2ecc71',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  endButton: {
    marginTop: 40,
    paddingVertical: 14,
    paddingHorizontal: 30,
    backgroundColor: '#e74c3c',
    borderRadius: 40,
  },
  endText: {
    color: 'white',
    fontSize: 16,
  },
});