import { Link, Stack } from "expo-router";

import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { Info } from "lucide-react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Center className="flex-1 gap-3">
        <Info size={60} color={theme.tint} />
        <Text className="text-secondary font-bold">This screen doesn't exist.</Text>

        <Link href="/" style={{ marginTop: 10 }}>
          <Text className="text-primary-500">Go to home</Text>
        </Link>
      </Center>
    </>
  );
}
