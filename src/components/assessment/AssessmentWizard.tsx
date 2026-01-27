"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { LivePlanPreview } from "./LivePlanPreview";
import { StickyBottomBar } from "./StickyBottomBar";
import { ProgressBar } from "./ui/ProgressBar";

// Step components
import { BasicsStep } from "./steps/BasicsStep";
import { TrainingBackgroundStep } from "./steps/TrainingBackgroundStep";
import { AvailabilityStep } from "./steps/AvailabilityStep";
import { LocationStep } from "./steps/LocationStep";
import { EquipmentStep } from "./steps/EquipmentStep";
import { GoalsStep } from "./steps/GoalsStep";
import { InjuryStep } from "./steps/InjuryStep";
import { BaselineStep } from "./steps/BaselineStep";
import { ReviewStep } from "./steps/ReviewStep";
import { LoadingStep } from "./steps/LoadingStep";
import { RevealStep } from "./steps/RevealStep";

import type { GuestAssessmentState, GeneratedPlan, FitnessComputation } from "@/types/assessment";

// ==================== STEP CONFIGURATION ====================

export const ASSESSMENT_STEPS = [
  { id: "basics", title: "Basic Info", icon: "👤", description: "Let's get to know you" },
  { id: "training", title: "Experience", icon: "📊", description: "Your training background" },
  { id: "availability", title: "Schedule", icon: "📅", description: "When can you train?" },
  { id: "location", title: "Location", icon: "📍", description: "Where do you train?" },
  { id: "equipment", title: "Equipment", icon: "🏋️", description: "What do you have access to?" },
  { id: "goals", title: "Goals", icon: "🎯", description: "What do you want to achieve?" },
  { id: "injury", title: "Pain Screen", icon: "🩺", description: "Any current limitations?" },
  { id: "baseline", title: "Baseline", icon: "💪", description: "Test your current level" },
  { id: "review", title: "Review", icon: "✅", description: "Confirm your profile" },
  { id: "loading", title: "Building", icon: "⚡", description: "Creating your plan..." },
  { id: "reveal", title: "Your Plan", icon: "🎉", description: "Here's your workout plan" },
] as const;

// ==================== PROPS ====================

interface AssessmentWizardProps {
  formData: GuestAssessmentState;
  currentStep: number;
  onUpdateFormData: (updates: Partial<GuestAssessmentState>) => void;
  onChangeStep: (step: number) => void;
  onClearProgress: () => void;
}

// ==================== COMPONENT ====================

export function AssessmentWizard({
  formData,
  currentStep,
  onUpdateFormData,
  onChangeStep,
  onClearProgress,
}: AssessmentWizardProps) {
  const router = useRouter();
  const [stepValidation, setStepValidation] = useState<Record<string, boolean>>({});
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [fitnessResult, setFitnessResult] = useState<FitnessComputation | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const isDataCollectionStep = currentStep < 9; // Steps 0-8 are data collection
  const isLoadingStep = currentStep === 9;
  const isRevealStep = currentStep === 10;

  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    const stepId = ASSESSMENT_STEPS[currentStep].id;
    
    switch (stepId) {
      case "basics":
        return !!(
          formData.basicInfo.age &&
          formData.basicInfo.biologicalSex &&
          formData.basicInfo.heightCm &&
          formData.basicInfo.weightKg
        );
      case "training":
        return !!formData.trainingBackground.trainingAge;
      case "availability":
        return !!(
          formData.availability.daysPerWeek &&
          formData.availability.sessionDurationMin &&
          formData.availability.preferredTime
        );
      case "location":
        return !!formData.location.trainingLocation;
      case "equipment":
        return Object.values(formData.equipment).some(v => v === true);
      case "goals":
        return !!(
          formData.goals.rankedGoals?.length &&
          formData.goals.intensityPreference
        );
      case "injury":
        return formData.injuryScreen.hasCurrentPain !== undefined;
      case "baseline":
        return !!(
          formData.baseline.maxPushups !== undefined &&
          formData.baseline.plankHoldSec !== undefined
        );
      case "review":
        return !!(
          formData.safetyConfirmations?.educational &&
          formData.safetyConfirmations?.consultProfessional &&
          formData.safetyConfirmations?.stopOnPain &&
          (formData.basicInfo.age! >= 18 || formData.safetyConfirmations?.parentalGuidance)
        );
      default:
        return true;
    }
  }, [currentStep, formData]);

  // Handle next step
  const handleNext = useCallback(() => {
    if (!validateCurrentStep()) {
      return;
    }
    
    if (currentStep < ASSESSMENT_STEPS.length - 1) {
      onChangeStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, onChangeStep, validateCurrentStep]);

  // Handle back
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      onChangeStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, onChangeStep]);

  // Handle plan generation complete
  const handlePlanGenerated = useCallback((plan: GeneratedPlan, fitness: FitnessComputation) => {
    setGeneratedPlan(plan);
    setFitnessResult(fitness);
    setGenerationError(null);
    onChangeStep(10); // Move to reveal step
  }, [onChangeStep]);

  // Handle generation error
  const handleGenerationError = useCallback((error: string) => {
    setGenerationError(error);
  }, []);

  // Render step content
  const renderStepContent = () => {
    const stepId = ASSESSMENT_STEPS[currentStep].id;

    switch (stepId) {
      case "basics":
        return (
          <BasicsStep
            data={formData.basicInfo}
            onUpdate={(data) => onUpdateFormData({ basicInfo: data })}
          />
        );
      case "training":
        return (
          <TrainingBackgroundStep
            data={formData.trainingBackground}
            onUpdate={(data) => onUpdateFormData({ trainingBackground: data })}
          />
        );
      case "availability":
        return (
          <AvailabilityStep
            data={formData.availability}
            onUpdate={(data) => onUpdateFormData({ availability: data })}
          />
        );
      case "location":
        return (
          <LocationStep
            data={formData.location}
            onUpdate={(data) => onUpdateFormData({ location: data })}
          />
        );
      case "equipment":
        return (
          <EquipmentStep
            data={formData.equipment}
            onUpdate={(data) => onUpdateFormData({ equipment: data })}
          />
        );
      case "goals":
        return (
          <GoalsStep
            data={formData.goals}
            onUpdate={(data) => onUpdateFormData({ goals: data })}
          />
        );
      case "injury":
        return (
          <InjuryStep
            data={formData.injuryScreen}
            onUpdate={(data) => onUpdateFormData({ injuryScreen: data })}
          />
        );
      case "baseline":
        return (
          <BaselineStep
            data={formData.baseline}
            onUpdate={(data) => onUpdateFormData({ baseline: data })}
          />
        );
      case "review":
        return (
          <ReviewStep
            formData={formData}
            safetyConfirmations={formData.safetyConfirmations || {}}
            onUpdateSafety={(data) => onUpdateFormData({ safetyConfirmations: data })}
            onEditStep={(step) => onChangeStep(step)}
          />
        );
      case "loading":
        return (
          <LoadingStep
            formData={formData}
            onPlanGenerated={handlePlanGenerated}
            onError={handleGenerationError}
          />
        );
      case "reveal":
        return (
          <RevealStep
            plan={generatedPlan}
            fitness={fitnessResult}
            error={generationError}
            onRetry={() => onChangeStep(9)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Logo size="sm" showText={true} />
            </button>

            {isDataCollectionStep && (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-sm text-slate-500">
                  Step {currentStep + 1} of 9
                </span>
                <button
                  onClick={onClearProgress}
                  className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
                >
                  Start over
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Progress bar */}
      {isDataCollectionStep && (
        <div className="sticky top-16 z-30 bg-black/50 backdrop-blur-sm border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <ProgressBar
              steps={ASSESSMENT_STEPS.slice(0, 9)}
              currentStep={currentStep}
              onStepClick={(step) => {
                if (step < currentStep) {
                  onChangeStep(step);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Main content - Two column on desktop */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {isDataCollectionStep ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            {/* Left column: Step content */}
            <div className="min-w-0">
              <div className="bg-gradient-to-b from-[#0D0E12] to-[#0A0B0E] border border-white/10 rounded-3xl p-6 md:p-8">
                {/* Step header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{ASSESSMENT_STEPS[currentStep].icon}</span>
                    <h1 className="text-2xl font-display font-medium text-white">
                      {ASSESSMENT_STEPS[currentStep].title}
                    </h1>
                  </div>
                  <p className="text-slate-400">
                    {ASSESSMENT_STEPS[currentStep].description}
                  </p>
                </div>

                {/* Step content */}
                <div className="animate-fade-slide-in">
                  {renderStepContent()}
                </div>
              </div>
            </div>

            {/* Right column: Live preview (desktop only) */}
            <aside className="hidden lg:block">
              <div className="sticky top-36">
                <LivePlanPreview
                  formData={formData}
                  isCollapsed={!showPreview}
                  onToggle={() => setShowPreview(!showPreview)}
                />
              </div>
            </aside>
          </div>
        ) : (
          // Loading and Reveal steps - full width
          <div className="max-w-4xl mx-auto">
            {renderStepContent()}
          </div>
        )}
      </main>

      {/* Mobile preview toggle */}
      {isDataCollectionStep && (
        <div className="lg:hidden fixed bottom-24 right-4 z-30">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="w-12 h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/25 flex items-center justify-center transition-colors"
            aria-label="Toggle plan preview"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      )}

      {/* Mobile preview drawer */}
      {isDataCollectionStep && showPreview && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setShowPreview(false)}>
          <div 
            className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-[#0A0B0E] border-t border-white/10 rounded-t-3xl overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-[#0A0B0E] p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white font-medium">Plan Preview</h3>
              <button 
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <LivePlanPreview formData={formData} isCollapsed={false} onToggle={() => {}} />
            </div>
          </div>
        </div>
      )}

      {/* Sticky bottom bar */}
      {isDataCollectionStep && (
        <StickyBottomBar
          currentStep={currentStep}
          totalSteps={9}
          canGoBack={currentStep > 0}
          canGoNext={validateCurrentStep()}
          isLastStep={currentStep === 8}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}
    </div>
  );
}

