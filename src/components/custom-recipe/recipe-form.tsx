"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRecipeForm, type RecipeFormData } from "@/hooks/use-recipe-form";
import { BasicInfoSection } from "./basic-info-section";
import { IngredientsSection } from "./ingredients-section";
import { InstructionsSection } from "./instructions-section";
import { UtensilsSection } from "./utensils-section";
import { ImageUploadSection } from "./image-upload-section";
import { ReviewSection } from "./review-section";

export type { RecipeFormData };

interface RecipeFormProps {
  initialData?: RecipeFormData;
}

const STEPS = [
  "Información básica",
  "Ingredientes",
  "Instrucciones",
  "Utensilios",
  "Imagen",
  "Revisar",
];

export function RecipeForm(props: RecipeFormProps) {
  const { initialData } = props;
  const form = useRecipeForm(initialData);
  const [step, setStep] = useState(0);

  const sections = [
    <BasicInfoSection
      key="info"
      title={form.title}
      onTitleChange={form.setTitle}
      isPublic={form.isPublic}
      onPublicChange={form.setIsPublic}
    />,
    <IngredientsSection
      key="ingredients"
      rows={form.ingredients}
      onUpdate={form.updateIngredient}
      onAdd={form.addIngredient}
      onRemove={form.removeIngredient}
    />,
    <InstructionsSection
      key="instructions"
      rows={form.instructions}
      onUpdate={form.updateInstruction}
      onAdd={form.addInstruction}
      onRemove={form.removeInstruction}
      onMove={form.moveInstruction}
    />,
    <UtensilsSection
      key="utensils"
      rows={form.utensils}
      onUpdate={form.updateUtensil}
      onAdd={form.addUtensil}
      onRemove={form.removeUtensil}
    />,
    <ImageUploadSection
      key="image"
      imageUrl={form.imageUrl}
      isUploading={form.isUploading}
      onUpload={form.handleImageUpload}
      onRemove={form.removeImage}
    />,
    <ReviewSection
      key="review"
      title={form.title}
      isPublic={form.isPublic}
      ingredients={form.validIngredients}
      instructions={form.validInstructions}
      utensils={form.validUtensils}
      isEditing={form.isEditing}
      isPending={form.isPending}
      onSubmit={form.handleSubmit}
    />,
  ];

  return (
    <>
      {/* Mobile wizard */}
      <div className="md:hidden space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Paso {step + 1} de {STEPS.length}
          </span>
          <span className="text-sm font-medium">{STEPS[step]}</span>
        </div>
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {sections[step]}

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex-1"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
          </Button>
          {step < STEPS.length - 1 && (
            <Button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="flex-1"
            >
              Siguiente <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Desktop accordion */}
      <div className="hidden md:block space-y-6">
        <Accordion
          multiple
          defaultValue={["info", "ingredients", "instructions", "utensils", "image"]}
        >
          {["info", "ingredients", "instructions", "utensils", "image"].map(
            (value, i) => (
              <AccordionItem key={value} value={value}>
                <AccordionTrigger>{STEPS[i]}</AccordionTrigger>
                <AccordionContent>{sections[i]}</AccordionContent>
              </AccordionItem>
            )
          )}
        </Accordion>

        <Button
          onClick={form.handleSubmit}
          disabled={form.isPending}
          className="w-full"
          size="lg"
        >
          {form.isPending
            ? "Guardando..."
            : form.isEditing
              ? "Guardar Cambios"
              : "Crear Receta"}
        </Button>
      </div>
    </>
  );
}
