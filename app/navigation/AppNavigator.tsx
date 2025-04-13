import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import WaitingRoomScreen from '../screens/WaitingRoomScreen';
import MeetingLobbyScreen from '../screens/MeetingLobbyScreen';
import EndScreen from '../screens/EndMeetingScreen';
import HostDashboardScreen from '../screens/HostDashboard';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WaitingRoom" component={WaitingRoomScreen} />
        <Stack.Screen name="MeetingLobby" component={MeetingLobbyScreen} />
        <Stack.Screen name="EndMeeting" component={EndScreen} />
        <Stack.Screen name="HostDashboard" component={HostDashboardScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
