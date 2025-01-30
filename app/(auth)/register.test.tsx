// import React from 'react';
// import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
// import RegisterScreen from './register';
// import * as SQLite from 'expo-sqlite';
// import { useRouter } from 'expo-router';
// import { genSaltSync, hashSync } from 'bcrypt-ts';

// // Mock dependencies
// jest.mock('expo-sqlite');
// jest.mock('expo-router');
// jest.mock('bcrypt-ts');
// jest.mock('@expo/vector-icons');

// describe('RegisterScreen', () => {
//   const mockRouter = { push: jest.fn() };
  
//   beforeEach(() => {
//     (useRouter as jest.Mock).mockReturnValue(mockRouter);
//     (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue({
//       withTransactionAsync: jest.fn(),
//       runAsync: jest.fn()
//     });
//     (genSaltSync as jest.Mock).mockReturnValue('mockSalt');
//     (hashSync as jest.Mock).mockReturnValue('mockHash');
//   });

//   it('renders correctly', () => {
//     const { getByPlaceholderText, getByText, getByTestId } = render(<RegisterScreen />);
    
//     expect(getByPlaceholderText('Username')).toBeTruthy();
//     expect(getByPlaceholderText('Password')).toBeTruthy();
//     expect(getByTestId('register-button')).toBeTruthy();
//   });

//   it('validates username length', async () => {
//     const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    
//     fireEvent.changeText(getByPlaceholderText('Username'), 'test');
//     expect(getByText('Username must be at least 6 characters long')).toBeTruthy();
//   });

//   it('validates password length', async () => {
//     const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    
//     fireEvent.changeText(getByPlaceholderText('Password'), '12345');
//     expect(getByText('Password must be at least 6 characters long')).toBeTruthy();
//   });

//   it('toggles password visibility', async () => {
//     const { getByPlaceholderText, getByTestId } = render(<RegisterScreen />);
    
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
// });