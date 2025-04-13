import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase'; // Firestore instance
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type WaitingRoomRouteProp = RouteProp<RootStackParamList, 'WaitingRoom'>;
const route = useRoute<WaitingRoomRouteProp>();
const { user } = route.params;
export default function WaitingRoomScreen() {
    type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'WaitingRoom'>;
    const navigation = useNavigation<NavigationProp>();    
  const route = useRoute<WaitingRoomRouteProp>();
  const { user } = route.params;
  const [hostStarted, setHostStarted] = useState(false);

  useEffect(() => {
    // Replace 'meetings' and 'roomId' with your Firestore path
    const meetingDocRef = doc(db, 'meetingStatus', 'statusDoc');

    const unsubscribe = onSnapshot(meetingDocRef, (docSnap) => {
      const data = docSnap.data();
      if (data?.status === 'started') {
        setHostStarted(true);
        navigation.replace('MeetingLobby');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <BlurView
        intensity={70}
        tint="dark"
        style={{ padding: 24, borderRadius: 20, width: '80%', alignItems: 'center' }}
      >
        <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 16 }}>
          Waiting for host to start the meeting...
        </Text>
        <ActivityIndicator size="large" color="#00BFFF" />
      </BlurView>
    </LinearGradient>
  );
}
