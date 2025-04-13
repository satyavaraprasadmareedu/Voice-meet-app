// app/components/PushToTalkButton.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

interface PushToTalkButtonProps {
  onPressIn: () => void;
  onPressOut: () => void;
}

const PushToTalkButton: React.FC<PushToTalkButtonProps> = ({ onPressIn, onPressOut }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.9);
          onPressIn();
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
          onPressOut();
        }}
        style={styles.button}
      >
        <Ionicons name="mic" size={32} color="white" />
        <Text style={styles.label}>Hold to Talk</Text>
      </Pressable>
    </Animated.View>
  );
};

export default PushToTalkButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#00E676',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  label: {
    color: '#fff',
    marginTop: 8,
    fontWeight: '600',
  },
});
