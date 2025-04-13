import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';



export default function HostDashboard() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [meetingStarted, setMeetingStarted] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'meetingStatus', 'global'), (docSnap) => {
      const data = docSnap.data();
      setMeetingStarted(data?.status === 'started');
    });

    return unsubscribe;
  }, []);

  const handleStartMeeting = async () => {
    try {
      await setDoc(doc(db, 'meetingStatus', 'global'), {
        status: 'started',
      });
      navigation.navigate('MeetingLobby');
    } catch (error) {
      Alert.alert('Error', 'Failed to start the meeting');
      console.error(error);
    }
  };

  return (
    <ImageBackground
      //source={require('../assets/background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.4)']} style={styles.overlay}>
        <Animated.View entering={FadeInUp.duration(600)} style={styles.glass}>
          <Text style={styles.title}>Welcome, Host</Text>
          <Text style={styles.subtitle}>
            {meetingStarted ? 'Meeting is already live' : 'Ready to start your meeting?'}
          </Text>

          <TouchableOpacity
            style={[styles.button, meetingStarted && { backgroundColor: '#aaa' }]}
            onPress={handleStartMeeting}
            disabled={meetingStarted}
          >
            <Text style={styles.buttonText}>
              {meetingStarted ? 'Meeting Started' : 'Start Meeting'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glass: {
    width: '85%',
    padding: 30,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#eee',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
