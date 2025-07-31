# Kattunar Kuzhu App

A cross-platform mobile application built with Expo, React Native, and GlueStack UI.

## Features

- Cross-platform compatibility (iOS, Android, Web)
- Modern UI with GlueStack UI components
- Custom theme with adaptive dark/light mode
- Tab-based navigation with Expo Router
- CI/CD with GitHub Actions

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npm run start
   ```

In the output, you'll find options to open the app in a:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Web browser](https://docs.expo.dev/workflow/web/)

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Build

### Local Build

To build the app locally:

#### Android

```bash
# Debug build
cd android && ./gradlew assembleDebug

# Release build
cd android && ./gradlew assembleRelease
```

#### iOS

```bash
cd ios && pod install
npx react-native run-ios --configuration Release
```

#### Web

```bash
npm run web:build
```

### CI/CD with GitHub Actions

This project includes a GitHub Actions workflow for automated builds:

- **Triggers**: Push to main branch, pull requests, or manual trigger
- **Builds**: Debug APK, Release APK, and AAB files
- **Artifacts**: Available for download from workflow runs
- **Releases**: Automatically created on push to main branch

For more information, see the [CI/CD documentation](.github/README.md).

## Technology Stack

- **Core**: Expo SDK 52, React Native 0.76.6, React 18.3.1
- **UI**: GlueStack UI, TailwindCSS/NativeWind
- **Navigation**: Expo Router, React Navigation
- **Theme**: Custom theme with adaptive dark/light mode

## Learn more

To learn more about the technologies used in this project:

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/docs/getting-started)
- [GlueStack UI](https://gluestack.io/)
- [NativeWind](https://www.nativewind.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request
