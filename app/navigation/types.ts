// app/navigation/types.ts
import { User } from 'firebase/auth';

export type RootStackParamList = {
  Login: undefined;
  WaitingRoom: { user: User }; // 👈 must match the `navigate('WaitingRoom', { user })`
  MeetingLobby: undefined;
  EndMeeting: undefined;
  HostDashboard: undefined; // Add this line for the HostDashboard screen
};
