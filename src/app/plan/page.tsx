import { auth } from "@clerk/nextjs/server";
import { startOfWeek, format } from "date-fns";
import { getPlan } from "@/queries/plans";
import { getRecipes } from "@/queries/recipes";
import { WeekSelector } from "@/components/plan/week-selector";
import { PlanBuilder } from "@/components/plan/plan-builder";
import { PlanConfirmed } from "@/components/plan/plan-confirmed";
import { PlanMembers } from "@/components/plan/plan-members";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold flex-1">Plan Semanal</h1>
        {plan && plan.role !== "owner" && (
          <Badge variant="secondary">
            Plan compartido
          </Badge>
        )}
        {plan && (
          <PlanMembers
            planId={plan.id}
            members={plan.members}
            isOwner={plan.role === "owner"}
          />
        )}
      </div>

      <WeekSelector basePath="/plan" selectedWeek={weekStart} />

      {plan ? (
        <PlanConfirmed
          planId={plan.id}
          recipes={plan.recipes}
          role={plan.role}
        />
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
