"use client";

import { useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, Plus, X, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createRecipe } from "@/actions/recipes";
import { toast } from "sonner";

interface IngredientRow {
  quantity: string;
  unit: string;
  name: string;
  shipped: boolean;
}

interface InstructionRow {
  text: string;
  image: string | null;
}

export function RecipeForm() {
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ingredientRows, setIngredientRows] = useState<IngredientRow[]>([
    { quantity: "", unit: "", name: "", shipped: true },
  ]);
  const [instructionRows, setInstructionRows] = useState<InstructionRow[]>([
    { text: "", image: null },
  ]);
  const [utensilRows, setUtensilRows] = useState<string[]>([""]);
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  const steps = [
    "Información básica",
    "Ingredientes",
    "Instrucciones",
    "Utensilios",
    "Imagen",
    "Revisar",
  ];

  // Ingredient helpers
  function updateIngredient(idx: number, field: keyof IngredientRow, value: string | boolean) {
    setIngredientRows((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  }
  function addIngredient() {
    setIngredientRows((prev) => [
      ...prev,
      { quantity: "", unit: "", name: "", shipped: true },
    ]);
  }
  function removeIngredient(idx: number) {
    setIngredientRows((prev) => prev.filter((_, i) => i !== idx));
  }

  // Instruction helpers
  function updateInstruction(idx: number, text: string) {
    setInstructionRows((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, text } : row))
    );
  }
  function addInstruction() {
    setInstructionRows((prev) => [...prev, { text: "", image: null }]);
  }
  function removeInstruction(idx: number) {
    setInstructionRows((prev) => prev.filter((_, i) => i !== idx));
  }
  function moveInstruction(idx: number, dir: -1 | 1) {
    setInstructionRows((prev) => {
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  }

  // Utensil helpers
  function updateUtensil(idx: number, value: string) {
    setUtensilRows((prev) => prev.map((v, i) => (i === idx ? value : v)));
  }
  function addUtensil() {
    setUtensilRows((prev) => [...prev, ""]);
  }
  function removeUtensil(idx: number) {
    setUtensilRows((prev) => prev.filter((_, i) => i !== idx));
  }

  // Image upload
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
    } catch {
      toast.error("Error al subir imagen");
    } finally {
      setIsUploading(false);
    }
  }

  function handleSubmit() {
    const validIngredients = ingredientRows.filter((r) => r.name.trim());
    const validInstructions = instructionRows.filter((r) => r.text.trim());
    const validUtensils = utensilRows.filter((u) => u.trim());

    if (!title.trim()) {
      toast.error("El título es requerido");
      return;
    }
    if (validIngredients.length === 0) {
      toast.error("Agrega al menos un ingrediente");
      return;
    }

    startTransition(async () => {
      try {
        await createRecipe({
          title,
          image: imageUrl,
          isPublic,
          ingredients: validIngredients,
          instructions: validInstructions,
          utensils: validUtensils,
        });
        toast.success("Receta creada");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Error al crear receta");
      }
    });
  }

  // Mobile wizard step content
  function renderStepContent(s: number) {
    switch (s) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Nombre de la receta"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              <Label>{isPublic ? "Pública" : "Privada"}</Label>
            </div>
          </div>
        );
      case 1:
        return renderIngredients();
      case 2:
        return renderInstructions();
      case 3:
        return renderUtensils();
      case 4:
        return renderImageUpload();
      case 5:
        return renderReview();
      default:
        return null;
    }
  }

  function renderIngredients() {
    return (
      <div className="space-y-3">
        {ingredientRows.map((row, idx) => (
          <div key={idx} className="flex gap-1.5 items-start">
            <Input
              placeholder="Cant."
              value={row.quantity}
              onChange={(e) => updateIngredient(idx, "quantity", e.target.value)}
              className="w-16"
            />
            <Input
              placeholder="Unidad"
              value={row.unit}
              onChange={(e) => updateIngredient(idx, "unit", e.target.value)}
              className="w-24"
            />
            <Input
              placeholder="Ingrediente"
              value={row.name}
              onChange={(e) => updateIngredient(idx, "name", e.target.value)}
              className="flex-1"
            />
            <div className="flex items-center gap-1 pt-2">
              <Checkbox
                checked={row.shipped}
                onCheckedChange={(v) => updateIngredient(idx, "shipped", !!v)}
              />
              <span className="text-xs text-muted-foreground">Env.</span>
            </div>
            {ingredientRows.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => removeIngredient(idx)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addIngredient}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Agregar ingrediente
        </Button>
      </div>
    );
  }

  function renderInstructions() {
    return (
      <div className="space-y-3">
        {instructionRows.map((row, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground mt-1">
              {idx + 1}
            </span>
            <Textarea
              placeholder={`Paso ${idx + 1}`}
              value={row.text}
              onChange={(e) => updateInstruction(idx, e.target.value)}
              className="flex-1"
              rows={2}
            />
            <div className="flex flex-col gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => moveInstruction(idx, -1)}
                disabled={idx === 0}
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => moveInstruction(idx, 1)}
                disabled={idx === instructionRows.length - 1}
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
              {instructionRows.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => removeInstruction(idx)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addInstruction}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Agregar paso
        </Button>
      </div>
    );
  }

  function renderUtensils() {
    return (
      <div className="space-y-3">
        {utensilRows.map((row, idx) => (
          <div key={idx} className="flex gap-2">
            <Input
              placeholder="Utensilio"
              value={row}
              onChange={(e) => updateUtensil(idx, e.target.value)}
              className="flex-1"
            />
            {utensilRows.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => removeUtensil(idx)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addUtensil}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Agregar utensilio
        </Button>
      </div>
    );
  }

  function renderImageUpload() {
    return (
      <div className="space-y-3">
        <Label>Imagen de la receta</Label>
        {imageUrl && (
          <div className="relative aspect-video overflow-hidden rounded-lg border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={() => setImageUrl(null)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isUploading}
        />
        {isUploading && (
          <p className="text-xs text-muted-foreground">Subiendo...</p>
        )}
      </div>
    );
  }

  function renderReview() {
    const validIngredients = ingredientRows.filter((r) => r.name.trim());
    const validInstructions = instructionRows.filter((r) => r.text.trim());
    const validUtensils = utensilRows.filter((u) => u.trim());

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Título</h3>
          <p className="text-sm">{title || "—"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium">Visibilidad</h3>
          <p className="text-sm">{isPublic ? "Pública" : "Privada"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium">
            Ingredientes ({validIngredients.length})
          </h3>
          <ul className="text-sm space-y-0.5">
            {validIngredients.map((ing, i) => (
              <li key={i}>
                {[ing.quantity, ing.unit].filter(Boolean).join(" ")}{" "}
                {(ing.quantity || ing.unit) && "— "}
                {ing.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-medium">
            Instrucciones ({validInstructions.length})
          </h3>
          <ol className="text-sm list-decimal ml-4 space-y-0.5">
            {validInstructions.map((inst, i) => (
              <li key={i}>{inst.text}</li>
            ))}
          </ol>
        </div>
        {validUtensils.length > 0 && (
          <div>
            <h3 className="text-sm font-medium">Utensilios</h3>
            <p className="text-sm">{validUtensils.join(", ")}</p>
          </div>
        )}
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Creando..." : "Crear Receta"}
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile wizard */}
      <div className="md:hidden space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Paso {step + 1} de {steps.length}
          </span>
          <span className="text-sm font-medium">{steps[step]}</span>
        </div>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {renderStepContent(step)}

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex-1"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
          </Button>
          {step < steps.length - 1 && (
            <Button
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
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
          <AccordionItem value="info">
            <AccordionTrigger>Información básica</AccordionTrigger>
            <AccordionContent>{renderStepContent(0)}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="ingredients">
            <AccordionTrigger>Ingredientes</AccordionTrigger>
            <AccordionContent>{renderIngredients()}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="instructions">
            <AccordionTrigger>Instrucciones</AccordionTrigger>
            <AccordionContent>{renderInstructions()}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="utensils">
            <AccordionTrigger>Utensilios</AccordionTrigger>
            <AccordionContent>{renderUtensils()}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="image">
            <AccordionTrigger>Imagen</AccordionTrigger>
            <AccordionContent>{renderImageUpload()}</AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full"
          size="lg"
        >
          {isPending ? "Creando..." : "Crear Receta"}
        </Button>
      </div>
    </>
  );
}
