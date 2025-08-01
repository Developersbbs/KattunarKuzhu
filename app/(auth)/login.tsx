import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button";
import { ImageBackground } from "@/components/ui/image-background";
import Gradient from "@/assets/Icons/Gradient";


const Login = () => {
  return (
    <Box className="flex-1 w-full h-full items-center justify-center bg-background">
      <Box className="absolute top-0 left-0 right-0 bottom-0">
        <Gradient />
      </Box>
      <Text>Login</Text>
      <Button>
        <ButtonText>Login</ButtonText>
      </Button>
    </Box>
  );
};

export default Login;