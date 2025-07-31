import React from 'react';
import { Box } from '@/components/ui/box';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Animated, useWindowDimensions } from 'react-native';

type PaginatorProps = {
  data: any[];
  scrollX: Animated.Value;
};

const Paginator = ({ data, scrollX }: PaginatorProps) => {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Box className="flex-row h-16">
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
        })

        return <Animated.View key={i.toString()} className="h-2.5 rounded-full mx-2" style={[{ width: dotWidth, opacity, backgroundColor: theme.tint }]} />;
      })}
    </Box>
  );
};

export default Paginator;