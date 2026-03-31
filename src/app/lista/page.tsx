import { auth, currentUser } from "@clerk/nextjs/server";
import { startOfWeek, format } from "date-fns";
import { resolveInvites } from "@/lib/resolve-invites";
import Image from "next/image";
import Link from "next/link";
import { getShoppingList } from "@/queries/plans";
import { getImageUrl } from "@/lib/image-utils";
import { WeekSelector } from "@/components/plan/week-selector";
import { IngredientCheck } from "@/components/shopping/ingredient-check";
import { CustomItemSection } from "@/components/shopping/custom-item-section";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { InviteToast } from "@/components/layout/invite-toast";

interface Props {
  searchParams: Promise<{ week?: string }>;
}

export default async function ListaPage({ searchParams }: Props) {
  const params = await searchParams;
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const resolvedCount = email ? await resolveInvites(userId, email) : 0;

  const currentMonday = format(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );
  const weekStart = params.week ?? currentMonday;

  const data = await getShoppingList(userId, weekStart);

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <InviteToast count={resolvedCount} />
      <h1 className="text-2xl font-bold">Lista de Compra</h1>

      <WeekSelector basePath="/lista" selectedWeek={weekStart} />

      {!data ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No hay plan confirmado para esta semana.</p>
          <Link href="/plan" className="text-primary hover:underline text-sm">
            Ir a Plan Semanal
          </Link>
        </div>
      ) : data.restricted ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No tienes acceso a la lista de compra de este plan.</p>
          <p className="text-sm mt-1">
            Pide al propietario que te dé permisos de edición.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.recipeGroups.map((group) => (
            <div key={group.recipeId} className="space-y-2">
              <Link
                href={`/recetas/${group.recipeId}`}
                className="flex items-center gap-2 hover:opacity-80"
              >
                <div className="relative h-8 w-8 overflow-hidden rounded">
                  <Image
                    src={getImageUrl(group.recipeImage)}
                    alt={group.recipeTitle}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <h2 className="text-sm font-semibold">{group.recipeTitle}</h2>
              </Link>
              <div className="ml-10 space-y-0.5">
                {group.ingredients.map((ing) => (
                  <IngredientCheck
                    key={ing.ingredientId}
                    planId={data.planId}
                    ingredientId={ing.ingredientId}
                    checked={ing.checked}
                    quantity={ing.quantity}
                    unit={ing.unit}
                    name={ing.name}
                  />
                ))}
              </div>
            </div>
          ))}

          <Separator />

          <CustomItemSection
            planId={data.planId}
            items={data.customItems}
          />
        </div>
      )}
    </div>
  );
}
