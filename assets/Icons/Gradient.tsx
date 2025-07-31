import React from "react";
import { Svg, G, Ellipse, Defs, RadialGradient, Stop } from "react-native-svg";
import { useColorScheme } from "@/components/useColorScheme";

const SvgComponent = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // New color palette
  // Primary: #2D1248 (dark purple)
  // Secondary: #E1E4DD (light gray with slight green tint)

  // Color variations for light/dark mode
  const primaryColor = isDark ? "#2D1248" : "#2D1248";  // Same in both modes
  const primaryColorLight = isDark ? "#573D72" : "#573D72"; // Lighter variant of primary
  const secondaryColor = isDark ? "#E1E4DD" : "#E1E4DD"; // Same in both modes
  const secondaryColorTransparent = isDark ? "#2D1248" : "#E1E4DD"; // Used for gradients with opacity 0

  return (
    <Svg width="965" height="1078" viewBox="0 0 965 1078" fill="none">
      <G opacity="0.8">
        <G>
          <Ellipse
            cx="222.599"
            cy="277.706"
            rx="641.842"
            ry="699.982"
            fill="url(#paint0_radial_2913_5676)"
          />
        </G>
        <G>
          <Ellipse
            cx="-82.2838"
            cy="30.7211"
            rx="463.716"
            ry="505.721"
            fill="url(#paint1_radial_2913_5676)"
          />
        </G>
      </G>
      <Defs>
        <RadialGradient
          id="paint0_radial_2913_5676"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(222.599 277.706) rotate(90) scale(780.255 715.448)"
        >
          <Stop offset="0%" stopColor={primaryColorLight} />
          <Stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient
          id="paint1_radial_2913_5676"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(-82.2838 30.7211) rotate(90) scale(563.717 516.895)"
        >
          <Stop offset="0%" stopColor={secondaryColor} />
          <Stop offset="100%" stopColor={secondaryColorTransparent} stopOpacity="0" />
        </RadialGradient>
      </Defs>
    </Svg>
  );
};

export default SvgComponent;
