import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <Box className="w-full mb-6">
      <Box className="flex-row justify-between items-center px-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;
          
          return (
            <React.Fragment key={index}>
              <Box className="items-center">
                <Box 
                  className={`h-8 w-8 rounded-full items-center justify-center ${
                    isActive 
                      ? "bg-black" 
                      : isCompleted 
                        ? "bg-gray-800" 
                        : "bg-gray-300"
                  }`}
                >
                  <Text className="text-white font-bold">
                    {index + 1}
                  </Text>
                </Box>
                <Text 
                  className={`text-xs mt-1 ${
                    isActive || isCompleted ? "text-black font-medium" : "text-gray-500"
                  }`}
                >
                  {step}
                </Text>
              </Box>
              
              {!isLast && (
                <Box 
                  className={`flex-1 h-1 mx-2 ${
                    isCompleted ? "bg-gray-800" : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
}
