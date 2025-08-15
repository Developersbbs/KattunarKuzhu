import org.gradle.api.Project

/**
 * Extension class for expo module configuration
 */
class ExpoModuleExtension {
    private final Project project
    
    ExpoModuleExtension(Project project) {
        this.project = project
    }
    
    /**
     * Safe extension getter that falls back to a default value
     */
    def safeExtGet(String prop, def fallback) {
        if (project.rootProject.ext.has(prop)) {
            return project.rootProject.ext.get(prop)
        }
        return fallback
    }
}
