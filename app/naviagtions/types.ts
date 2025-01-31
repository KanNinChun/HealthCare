import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  BloodSugarRecord: undefined;
  AddRecord: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}