declare module 'hooks/useThemeColor' {
  export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: string
  ): string;
}