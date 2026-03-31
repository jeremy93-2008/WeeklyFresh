import { RecipeForm } from "@/components/custom-recipe/recipe-form";

export default function NuevaRecetaPage() {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-bold mb-6">Nueva Receta</h1>
      <RecipeForm />
    </div>
  );
}
