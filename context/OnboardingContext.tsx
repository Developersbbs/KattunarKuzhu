import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { getItem, setItem } from "expo-secure-store";

interface OnboardingContextType {
  isFirstTime: boolean | null;
  completeOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstTime = async () => {
      const firstTime = await getItem("isFirstTime");
      setIsFirstTime(firstTime !== "false");
    };
    checkFirstTime();
  }, []);

  const completeOnboarding = async () => {
    await setItem("isFirstTime", "false");
    setIsFirstTime(false);
  };

  return (
    <OnboardingContext.Provider value={{ isFirstTime, completeOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
