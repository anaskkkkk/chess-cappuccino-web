
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    hasBoard: false,
    skillLevel: 3,
    playFrequency: "weekly",
    goals: {
      improve: false,
      compete: false,
      fun: false,
      learn: false,
      teach: false,
    }
  });

  const totalSteps = 4;

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // TODO: Save onboarding data to API
      console.log("Onboarding data:", formData);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Profile setup complete!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Failed to save your preferences. Please try again.");
    }
  };

  const handleSkip = () => {
    toast.info("You can always update your preferences later");
    navigate("/dashboard");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-chess-text-light">Do you own a SmartChess board?</h2>
            <div className="flex flex-col space-y-4">
              <Button
                variant={formData.hasBoard ? "default" : "outline"}
                className={`w-full py-6 ${formData.hasBoard ? "bg-chess-accent" : "border-[rgba(255,255,255,0.12)]"}`}
                onClick={() => setFormData(prev => ({ ...prev, hasBoard: true }))}
              >
                Yes, I have a SmartChess board
              </Button>
              <Button
                variant={!formData.hasBoard ? "default" : "outline"}
                className={`w-full py-6 ${!formData.hasBoard ? "bg-chess-accent" : "border-[rgba(255,255,255,0.12)]"}`}
                onClick={() => setFormData(prev => ({ ...prev, hasBoard: false }))}
              >
                No, I'm playing online only
              </Button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-chess-text-light">What's your chess skill level?</h2>
            <div className="space-y-10">
              <Slider
                defaultValue={[formData.skillLevel]}
                min={1}
                max={5}
                step={1}
                onValueChange={(value) => setFormData(prev => ({ ...prev, skillLevel: value[0] }))}
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Advanced</span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chess-accent">{formData.skillLevel}/5</div>
                <div className="text-gray-400">
                  {formData.skillLevel === 1 && "Just learning the basics"}
                  {formData.skillLevel === 2 && "Familiar with the rules"}
                  {formData.skillLevel === 3 && "Regular player"}
                  {formData.skillLevel === 4 && "Advanced tactics"}
                  {formData.skillLevel === 5 && "Tournament level"}
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-chess-text-light">How often do you play chess?</h2>
            <div className="flex flex-col space-y-4">
              {["daily", "weekly", "monthly", "rarely"].map((frequency) => (
                <Button
                  key={frequency}
                  variant={formData.playFrequency === frequency ? "default" : "outline"}
                  className={`w-full py-4 capitalize ${formData.playFrequency === frequency ? "bg-chess-accent" : "border-[rgba(255,255,255,0.12)]"}`}
                  onClick={() => setFormData(prev => ({ ...prev, playFrequency: frequency }))}
                >
                  {frequency}
                </Button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-chess-text-light">What are your chess goals?</h2>
            <p className="text-gray-400">Select all that apply</p>
            <div className="space-y-4">
              {[
                { id: "improve", label: "Improve my game" },
                { id: "compete", label: "Compete in tournaments" },
                { id: "fun", label: "Have fun and relax" },
                { id: "learn", label: "Learn new strategies" },
                { id: "teach", label: "Teach others" },
              ].map((goal) => (
                <div key={goal.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal.id}
                    checked={formData.goals[goal.id as keyof typeof formData.goals]}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        goals: {
                          ...prev.goals,
                          [goal.id]: Boolean(checked)
                        }
                      }))
                    }
                  />
                  <label
                    htmlFor={goal.id}
                    className="text-sm font-medium leading-none text-chess-text-light cursor-pointer"
                  >
                    {goal.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-chess-text-light text-center">Set Up Your Profile</h1>
            <p className="text-gray-400 text-center mt-2">Help us personalize your experience</p>
          </div>
          
          <div className="w-full bg-gray-700 h-1 rounded-full mb-8">
            <div 
              className="bg-chess-accent h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            ></div>
          </div>
          
          <div className="bg-chess-dark border border-[rgba(255,255,255,0.12)] rounded-lg p-8 mb-6">
            {renderStepContent()}
            
            <div className="flex justify-between mt-8">
              <Button
                variant="ghost"
                onClick={currentStep === 0 ? handleSkip : handlePrevStep}
                className="text-gray-400"
              >
                {currentStep === 0 ? "Skip" : "Back"}
              </Button>
              <Button
                onClick={handleNextStep}
                className="bg-chess-accent hover:bg-opacity-90 text-chess-text-light"
              >
                {currentStep === totalSteps - 1 ? "Complete" : "Continue"}
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Step {currentStep + 1} of {totalSteps}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Onboarding;
