// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react-native';
// import LoginScreen from './login';
// import * as SQLite from 'expo-sqlite';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as LocalAuthentication from 'expo-local-authentication';
// import { useRouter } from 'expo-router';
// import { compare } from 'bcrypt-ts';

// // Mock dependencies
// jest.mock('expo-sqlite');
// jest.mock('@react-native-async-storage/async-storage', () => ({
//   getItem: jest.fn(),
//   setItem: jest.fn(),
// }));
// jest.mock('expo-local-authentication');
// jest.mock('expo-router');
// jest.mock('bcrypt-ts');
// jest.mock('@expo/vector-icons');

// describe('LoginScreen', () => {
//   const mockRouter = { replace: jest.fn() };
//   const mockDatabase = {
//     getFirstAsync: jest.fn(),
//   };

//   beforeEach(() => {
//     (useRouter as jest.Mock).mockReturnValue(mockRouter);
//     (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(mockDatabase);
//     (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
//     (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
//     (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({ success: true });
//     (compare as jest.Mock).mockResolvedValue(true);
//     (AsyncStorage.getItem as jest.Mock).mockResolvedValue('testuser');
//     jest.clearAllMocks();
//   });

//   it('renders correctly', () => {
//     const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);
    
//     expect(getByPlaceholderText('Username')).toBeTruthy();
//     expect(getByPlaceholderText('Password')).toBeTruthy();
//     expect(getByTestId('login-button')).toBeTruthy();
//   });

//   it('validates empty fields', async () => {
//     const { getByTestId, queryByText } = render(<LoginScreen />);
    
//     fireEvent.press(getByTestId('login-button'));
//     await waitFor(() => {
//       expect(queryByText('Please enter both username and password.')).toBeTruthy();
//     });
//   });

//   it('handles successful login', async () => {
//     mockDatabase.getFirstAsync.mockResolvedValue({
//       id: 1,
//       username: 'testuser',
//       passwordHash: 'hashedpassword'
//     });
    
//     const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);
    
//     fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
//     fireEvent.changeText(getByPlaceholderText('Password'), 'password');
//     fireEvent.press(getByTestId('login-button'));
    
//     await waitFor(() => {
//       expect(mockRouter.replace).toHaveBeenCalledWith('../(tabs)');
//       expect(AsyncStorage.setItem).toHaveBeenCalledWith('userToken', '1');
//     });
//   });

//   it('handles failed login - user not found', async () => {
//     mockDatabase.getFirstAsync.mockResolvedValue(null);
    
//     const { getByPlaceholderText, getByTestId, getByText } = render(<LoginScreen />);
    
//     fireEvent.changeText(getByPlaceholderText('Username'), 'testuser123');
//     fireEvent.changeText(getByPlaceholderText('Password'), 'password');
//     fireEvent.press(getByTestId('login-button'));
    
//     await waitFor(() => {
//       expect(getByText('User not found.')).toBeTruthy();
//     });
//   });

//   it('toggles password visibility', async () => {
//     const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);
    
//     const passwordInput = getByPlaceholderText('Password');
//     const toggleButton = getByTestId('password-toggle');
    
//     // Initial state should be hidden
//     expect(passwordInput.props.secureTextEntry).toBe(true);
    
//     // Toggle visibility
//     fireEvent.press(toggleButton);
//     expect(passwordInput.props.secureTextEntry).toBe(false);
    
//     // Toggle back to hidden
//     fireEvent.press(toggleButton);
//     expect(passwordInput.props.secureTextEntry).toBe(true);
//   });

//   it('checks fingerprint availability', async () => {
//     render(<LoginScreen />);
    
//     await waitFor(() => {
//       expect(LocalAuthentication.hasHardwareAsync).toHaveBeenCalled();
//       expect(LocalAuthentication.isEnrolledAsync).toHaveBeenCalled();
//     });
//   });

//   it('handles successful fingerprint login', async () => {
//     (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({ success: true });
//     (AsyncStorage.getItem as jest.Mock).mockResolvedValue('testuser');
//     mockDatabase.getFirstAsync.mockResolvedValue({
//       id: 1,
//       username: 'testuser',
//       passwordHash: 'hashedpassword'
//     });
    
//     const { getByTestId } = render(<LoginScreen />);
    
//     fireEvent.press(getByTestId('fingerprint-button'));
    
//     await waitFor(() => {
//       expect(mockRouter.replace).toHaveBeenCalledWith('../(tabs)');
//       expect(AsyncStorage.setItem).toHaveBeenCalledWith('userToken', '1');
//     });
//   });
// });