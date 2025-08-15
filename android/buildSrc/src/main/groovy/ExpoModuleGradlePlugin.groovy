import org.gradle.api.Plugin
import org.gradle.api.Project

/**
 * A minimal implementation of the expo-module-gradle-plugin
 * to fix the missing plugin issue in Expo SDK 52
 */
class ExpoModuleGradlePlugin implements Plugin<Project> {
    void apply(Project project) {
        // Apply the Android library plugin if not already applied
        if (!project.plugins.hasPlugin('com.android.library')) {
            project.apply plugin: 'com.android.library'
        }
        
        // Apply the Kotlin Android plugin if not already applied
        if (!project.plugins.hasPlugin('kotlin-android')) {
            try {
                project.apply plugin: 'kotlin-android'
            } catch (Exception e) {
                // Ignore if Kotlin plugin is not available
            }
        }
        
        // Add expoModule extension for compatibility
        project.ext.expoModule = project.extensions.create('expoModule', ExpoModuleExtension, project)
        
        // Apply the fixed expo modules core plugin
        def fixedExpoModulesCorePlugin = new File(
            project.rootProject.projectDir,
            "expo-core-plugin-fixed.gradle"
        )
        
        if (fixedExpoModulesCorePlugin.exists()) {
            project.apply from: fixedExpoModulesCorePlugin
            
            // Apply the core plugin functions
            try {
                project.applyKotlinExpoModulesCorePlugin()
                project.useDefaultAndroidSdkVersions()
                project.useCoreDependencies()
                project.useExpoPublishing()
            } catch (Exception e) {
                project.logger.warn("Warning: Could not apply some expo core plugin functions: ${e.message}")
            }
        }
    }
}
