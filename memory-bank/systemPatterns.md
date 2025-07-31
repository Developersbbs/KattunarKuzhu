# System Architecture & Patterns

## Project Structure

### File-based Routing
The project uses Expo Router's file-based routing structure:
- `app/_layout.tsx` - Root layout with theme provider and font loading
- `app/index.tsx` - Home screen
- `app/modal.tsx` - Modal screen
- `app/tabs/_layout.tsx` - Tab navigation layout
- `app/tabs/(tabs)/_layout.tsx` - Tab screens layout

### Component Organization
- `components/ui/` - UI components using GlueStack UI
- `components/` - Common components and hooks
- `assets/` - Static assets including images, fonts, and SVG icons
- `constants/` - Application constants like colors

## Design Patterns

### UI Component Structure
- Components follow a consistent pattern with separate files for web and native platforms when needed:
  - `index.tsx` - Core component implementation
  - `index.web.tsx` - Web-specific implementation (when needed)
  - `styles.tsx` - Component styles (when complex)

### Component Composition
- UI components are built using composition, with smaller components combined to create more complex interfaces
- GlueStack UI provides the base component library with over 30 customizable components

### Theme Management
- Centralized theme using GlueStack UI provider
- Dark/light mode support through the `useColorScheme` hook
- TailwindCSS for consistent styling across platforms

### Navigation Pattern
- Tab-based navigation using React Navigation
- File-based routing with Expo Router
- Modal screens accessible from any tab
- Type-checked routes for safety

## Technical Decisions

### Styling Approach
- Utility-first approach with TailwindCSS/NativeWind
- Component-specific styles where needed
- CSS variables for theme customization

### Cross-platform Strategy
- Shared codebase with platform-specific files (.web.tsx) when needed
- Responsive design using TailwindCSS breakpoints
- Platform-specific UI adjustments through conditional rendering

### Performance Considerations
- Code splitting for web
- Native optimizations for mobile
- Lazy loading for non-critical components 