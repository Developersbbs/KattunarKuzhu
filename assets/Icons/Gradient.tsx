import React from "react";
import { Svg, G, Ellipse, Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const Gradient = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[colorScheme ?? "light"];
  
  // Color definitions for light and dark modes
  // Light mode: Purple gradient with light gray accents
  // Dark mode: Deep purple with purple accent gradients
  
  // Primary colors (based on the app's color scheme)
  const primaryColor = isDark ? "#2D1248" : "#2D1248";  // Base purple
  const primaryColorLight = isDark ? "#573D72" : "#573D72"; // Lighter purple
  const primaryAccent = isDark ? "#A076F9" : "#7E57C2"; // Accent purple
  
  // Secondary colors
  const secondaryColor = isDark ? "#1E1E1E" : "#E1E4DD"; // Background
  const secondaryColorLight = isDark ? "#2A2A2A" : "#F5F5F5"; // Lighter background
  
  // Background color for the entire gradient
  const backgroundColor = isDark ? "#121212" : "#FFFFFF";

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      {/* Background fill */}
      <Rect x="0" y="0" width={width} height={height} fill={backgroundColor} />
      
      {/* Dark mode has more subtle, deeper gradients */}
      {isDark ? (
        <G opacity="0.9">
          {/* Main gradient blob - top right */}
          <Ellipse
            cx={width * 0.8}
            cy={height * 0.2}
            rx={width * 0.7}
            ry={height * 0.5}
            fill="url(#paint0_radial_dark)"
          />
          
          {/* Secondary gradient blob - bottom left */}
          <Ellipse
            cx={width * 0.2}
            cy={height * 0.7}
            rx={width * 0.6}
            ry={height * 0.4}
            fill="url(#paint1_radial_dark)"
          />
          
          {/* Accent gradient - center */}
          <Ellipse
            cx={width * 0.5}
            cy={height * 0.4}
            rx={width * 0.3}
            ry={height * 0.2}
            fill="url(#paint2_radial_dark)"
            opacity="0.4"
          />
          
          {/* NEW: Bottom gradient blob - covers bottom area */}
          <Ellipse
            cx={width * 0.5}
            cy={height * 1.1}
            rx={width * 0.9}
            ry={height * 0.6}
            fill="url(#paint3_radial_dark)"
            opacity="0.5"
          />
          
          {/* NEW: Bottom accent gradient - small accent near bottom */}
          <Ellipse
            cx={width * 0.7}
            cy={height * 0.85}
            rx={width * 0.25}
            ry={height * 0.15}
            fill="url(#paint4_radial_dark)"
            opacity="0.4"
          />
          
          <Defs>
            {/* Main gradient - deep purple to transparent */}
            <RadialGradient
              id="paint0_radial_dark"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform={`translate(${width * 0.8} ${height * 0.2}) rotate(90) scale(${width * 0.7} ${height * 0.5})`}
            >
              <Stop offset="0%" stopColor={primaryColorLight} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
            </RadialGradient>
            
            {/* Secondary gradient - dark background to transparent */}
            <RadialGradient
              id="paint1_radial_dark"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform={`translate(${width * 0.2} ${height * 0.7}) rotate(90) scale(${width * 0.6} ${height * 0.4})`}
            >
              <Stop offset="0%" stopColor={secondaryColorLight} />
              <Stop offset="100%" stopColor={secondaryColor} stopOpacity="0" />
            </RadialGradient>
            
            {/* Accent gradient - purple accent to transparent */}
            <RadialGradient
              id="paint2_radial_dark"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform={`translate(${width * 0.5} ${height * 0.4}) rotate(90) scale(${width * 0.3} ${height * 0.2})`}
            >
              <Stop offset="0%" stopColor={primaryAccent} />
              <Stop offset="100%" stopColor={primaryAccent} stopOpacity="0" />
            </RadialGradient>
            
            {/* NEW: Bottom gradient - deep purple to transparent */}
            <RadialGradient
              id="paint3_radial_dark"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform={`translate(${width * 0.5} ${height * 1.1}) rotate(90) scale(${width * 0.9} ${height * 0.6})`}
            >
              <Stop offset="0%" stopColor={primaryColorLight} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
            </RadialGradient>
            
            {/* NEW: Bottom accent gradient - purple accent to transparent */}
            <RadialGradient
              id="paint4_radial_dark"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform={`translate(${width * 0.7} ${height * 0.85}) rotate(90) scale(${width * 0.25} ${height * 0.15})`}
            >
              <Stop offset="0%" stopColor={primaryAccent} />
              <Stop offset="100%" stopColor={primaryAccent} stopOpacity="0" />
            </RadialGradient>
          </Defs>
        </G>
      ) : (
        // Light mode has brighter, more vibrant gradients
        <G opacity="0.8">
          {/* Main gradient blob - top right */}
          <Ellipse
            cx={width * 0.7}
            cy={height * 0.3}
            rx={width * 0.8}
            ry={height * 0.6}
            fill="url(#paint0_radial_light)"
          />
          
          {/* Secondary gradient blob - bottom left */}
          <Ellipse
            cx={width * 0.3}
            cy={height * 0.8}
            rx={width * 0.7}
            ry={height * 0.5}
            fill="url(#paint1_radial_light)"
          />
          
          {/* Accent gradient - center */}
          <Ellipse
            cx={width * 0.5}
            cy={height * 0.5}
            rx={width * 0.4}
            ry={height * 0.3}
            fill="url(#paint2_radial_light)"
            opacity="0.5"
          />
          
          {/* NEW: Bottom gradient blob - covers bottom area */}
          <Ellipse
            cx={width * 0.5}
            cy={height * 1.1}
            rx={width * 0.9}
            ry={height * 0.7}
            fill="url(#paint3_radial_light)"
            opacity="0.4"
          />
          
          {/* NEW: Bottom accent gradient - small accent near bottom */}
          <Ellipse
            cx={width * 0.8}
            cy={height * 0.9}
            rx={width * 0.3}
            ry={height * 0.2}
            fill="url(#paint4_radial_light)"
            opacity="0.4"
          />
          
          <Defs>
            {/* Main gradient - purple to transparent */}
            <RadialGradient
              id="paint0_radial_light"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform={`translate(${width * 0.7} ${height * 0.3}) rotate(90) scale(${width * 0.8} ${height * 0.6})`}
            >
              <Stop offset="0%" stopColor={primaryColorLight} />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
            </RadialGradient>
            
            {/* Secondary gradient - light gray to transparent */}
            <RadialGradient
              id="paint1_radial_light"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform={`translate(${width * 0.3} ${height * 0.8}) rotate(90) scale(${width * 0.7} ${height * 0.5})`}
            >
              <Stop offset="0%" stopColor={secondaryColor} />
              <Stop offset="100%" stopColor={secondaryColorLight} stopOpacity="0" />
            </RadialGradient>
            
            {/* Accent gradient - purple accent to transparent */}
            <RadialGradient
              id="paint2_radial_light"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform={`translate(${width * 0.5} ${height * 0.5}) rotate(90) scale(${width * 0.4} ${height * 0.3})`}
            >
              <Stop offset="0%" stopColor={primaryAccent} stopOpacity="0.7" />
              <Stop offset="100%" stopColor={primaryAccent} stopOpacity="0" />
            </RadialGradient>
            
            {/* NEW: Bottom gradient - purple to transparent */}
            <RadialGradient
              id="paint3_radial_light"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform={`translate(${width * 0.5} ${height * 1.1}) rotate(90) scale(${width * 0.9} ${height * 0.7})`}
            >
              <Stop offset="0%" stopColor={primaryColorLight} stopOpacity="0.6" />
              <Stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
            </RadialGradient>
            
            {/* NEW: Bottom accent gradient - purple accent to transparent */}
            <RadialGradient
              id="paint4_radial_light"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform={`translate(${width * 0.8} ${height * 0.9}) rotate(90) scale(${width * 0.3} ${height * 0.2})`}
            >
              <Stop offset="0%" stopColor={primaryAccent} stopOpacity="0.5" />
              <Stop offset="100%" stopColor={primaryAccent} stopOpacity="0" />
            </RadialGradient>
          </Defs>
        </G>
      )}
    </Svg>
  );
};

export default Gradient;
