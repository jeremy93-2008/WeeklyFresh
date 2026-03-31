import { auth } from "@clerk/nextjs/server";
import { startOfWeek, format } from "date-fns";
import { getPlan } from "@/queries/plans";
import { getRecipes } from "@/queries/recipes";
import { WeekSelector } from "@/components/plan/week-selector";
import { PlanBuilder } from "@/components/plan/plan-builder";
import { PlanConfirmed } from "@/components/plan/plan-confirmed";

interface Props {
  searchParams: Promise<{ week?: string }>;
}

export default async function PlanPage({ searchParams }: Props) {
  const params = await searchParams;
  const { userId } = await auth();
  if (!userId) return null;

  const currentMonday = format(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );
  const weekStart = params.week ?? currentMonday;

  const plan = await getPlan(userId, weekStart);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">Plan Semanal</h1>

      <WeekSelector basePath="/plan" selectedWeek={weekStart} />

      {plan ? (
        <PlanConfirmed planId={plan.id} recipes={plan.recipes} />
      ) : (
        <PlanBuilderWrapper weekStart={weekStart} userId={userId} />
      )}
    </div>
  );
}

async function PlanBuilderWrapper({
  weekStart,
  userId,
}: {
  weekStart: string;
  userId: string;
}) {
  const data = await getRecipes({ limit: 200, userId });
  return (
    <PlanBuilder
      weekStart={weekStart}
      availableRecipes={data.recipes.map((r) => ({
        id: r.id,
        title: r.title,
        image: r.image,
        isHellofresh: r.isHellofresh,
      }))}
    />
  );
}
