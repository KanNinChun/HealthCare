import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '../hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'description';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const lightColorValue = lightColor ?? '#000000'; // 如果 lightColor 未定义，则使用纯黑色
  const darkColorValue = darkColor ?? '#ffffff'; // 如果 darkColor 未定义，则使用纯白色（假设）
  const color = useThemeColor({ light: lightColorValue, dark: darkColorValue }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'description' ? styles.description : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 36,
    letterSpacing: 1.5,
    top: -220,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#d47924',  // #0a7ea4
  },
  description: {
    top: -220,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
});
