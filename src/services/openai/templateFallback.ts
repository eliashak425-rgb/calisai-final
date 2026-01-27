import { prisma } from "@/lib/prisma";
import type { GeneratedPlanResponse } from "@/types/plan";

export async function getTemplatePlan(
  fitnessLevel: string,
  goalPrimary: string,
  daysPerWeek: number
): Promise<{ id: string; structure: GeneratedPlanResponse } | null> {
  // Try to find an exact match
  let template = await prisma.templatePlan.findFirst({
    where: {
      fitnessLevel,
      goalFocus: goalPrimary,
      daysPerWeek,
      isActive: true,
    },
  });

  // If no exact match, try just level + days
  if (!template) {
    template = await prisma.templatePlan.findFirst({
      where: {
        fitnessLevel,
        daysPerWeek,
        isActive: true,
      },
    });
  }

  // If still no match, get any template for that level
  if (!template) {
    template = await prisma.templatePlan.findFirst({
      where: {
        fitnessLevel,
        isActive: true,
      },
    });
  }

  // Last resort: get the most general beginner template
  if (!template) {
    template = await prisma.templatePlan.findFirst({
      where: {
        fitnessLevel: "beginner",
        isActive: true,
      },
    });
  }

  if (!template) {
    return null;
  }

  const structure = typeof template.structure === "string"
    ? JSON.parse(template.structure)
    : template.structure;

  return {
    id: template.id,
    structure: structure as GeneratedPlanResponse,
  };
}

