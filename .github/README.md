# GitHub CI/CD for Kattunar Kuzhu App

This directory contains GitHub Actions workflows for continuous integration and deployment of the Kattunar Kuzhu App.

## Workflows

### Android Build

The `android-build.yml` workflow builds Android APK and AAB files for the app.

#### Triggers

- **Push to main branch**: Automatically triggered when code is pushed to the main branch
- **Pull requests to main branch**: Runs on pull requests to validate the build
- **Manual trigger**: Can be triggered manually from the GitHub Actions tab

#### What it does

1. Sets up the build environment (JDK 17, Node.js, Android SDK)
2. Installs project dependencies
3. Creates necessary environment files
4. Sets up a debug keystore for signing
5. Builds debug APK, release APK, and AAB files
6. Uploads build artifacts to GitHub
7. Creates a GitHub release with the build artifacts (only on push to main)

#### Build Artifacts

The following artifacts are produced:
- Debug APK: `app-debug.apk`
- Release APK (signed with debug key): `app-arm64-v8a-release.apk`
- Android App Bundle: `app-release.aab`

## Setting up Secrets

For optimal workflow functionality, set up the following GitHub repository secrets:

1. **DEBUG_KEYSTORE** (optional): Base64-encoded debug keystore file
   - If not provided, a new debug keystore will be generated during the build

2. **API_URL** (optional): API URL for the app
   - Default: `https://api.example.com`

## How to Use

### Running the Workflow Manually

1. Go to the "Actions" tab in your GitHub repository
2. Select the "Android Build" workflow
3. Click "Run workflow"
4. Select the branch to run the workflow on
5. Click "Run workflow" button

### Accessing Build Artifacts

After a workflow run completes:

1. Go to the completed workflow run
2. Scroll down to the "Artifacts" section
3. Download the desired artifact (app-debug or app-release)

### Accessing Releases

When the workflow runs on the main branch:

1. Go to the "Releases" section of your repository
2. Find the latest release (tagged with v{run_number})
3. Download the desired APK or AAB file

## Customizing the Workflow

To customize the workflow:

1. Edit the `.github/workflows/android-build.yml` file
2. Modify the environment variables, steps, or triggers as needed
3. Commit and push your changes

## Troubleshooting

If the workflow fails:

1. Check the workflow run logs for error messages
2. Verify that all required secrets are properly set
3. Ensure the Android build configuration is correct
4. Try running the build locally to identify issues 