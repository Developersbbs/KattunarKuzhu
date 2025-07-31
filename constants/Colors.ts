/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2D1248';
const tintColorDark = '#A076F9';

export const Colors = {
  light: {
    text: '#1C1C1E',
    background: '#E1E4DD',
    tint: tintColorLight,
    icon: '#8A8A8E',
    tabIconDefault: '#8A8A8E',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',
    background: '#121212',
    tint: tintColorDark,
    icon: '#CCCCCC',
    tabIconDefault: '#CCCCCC',
    tabIconSelected: tintColorDark,
  },
};
