import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  BloodSugarRecord: undefined;
  AddRecord: undefined;
  // Add other screens here
};

export type RootTabParamList = {
  Home: undefined;
  Settings: undefined;
  // Add other tabs here
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}