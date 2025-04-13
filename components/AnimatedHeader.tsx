// app/components/AnimatedHeader.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface AnimatedHeaderProps {
  title: string;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ title }) => {
  return (
    <Animated.Text entering={FadeInDown.duration(600)} style={styles.header}>
      {title}
    </Animated.Text>
  );
};

export default AnimatedHeader;

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
});
