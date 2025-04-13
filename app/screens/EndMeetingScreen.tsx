// app/screens/EndMeetingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, { BounceIn, FadeInDown } from 'react-native-reanimated';

const EndMeetingScreen = () => {
  const router = useRouter();

  return (
    <LinearGradient colors={['#141E30', '#243B55']} style={styles.container}>
      <BlurView intensity={100} tint="dark" style={styles.card}>
        <Animated.View entering={BounceIn}>
          <Ionicons name="checkmark-circle" size={80} color="#00E676" />
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(100)} style={styles.title}>
          Meeting Ended
        </Animated.Text>

        <Animated.Text entering={FadeInDown.delay(300)} style={styles.subtitle}>
          Thanks for joining the conversation.
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(500)} style={{ width: '100%' }}>
          <Pressable style={styles.button} onPress={() => router.replace('/')}>
            <Ionicons name="home-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Back to Home</Text>
          </Pressable>
        </Animated.View>
      </BlurView>
    </LinearGradient>
  );
};

export default EndMeetingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    width: '85%',
    padding: 30,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 8,
    marginBottom: 30,
    textAlign: 'center'
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#00E676',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600'
  }
});
