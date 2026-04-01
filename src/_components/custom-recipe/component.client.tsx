'use client'

import { useState, type ComponentType } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/_components/ui/button'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/_components/ui/accordion'
import { useRecipeForm, type IRecipeFormData } from '@/_hooks/use-recipe-form'
import { BasicInfoSection } from './_components/basic-info-section.client'
import { IngredientsSection } from './_components/ingredients-section.client'
import { InstructionsSection } from './_components/instructions-section.client'
import { UtensilsSection } from './_components/utensils-section.client'
import { ImageUploadSection } from './_components/image-upload-section.client'
import { ReviewSection } from './_components/review-section.client'

export type { IRecipeFormData }

interface IRecipeFormProps {
    initialData?: IRecipeFormData
}

interface IFormSection {
    key: string
    label: string
    render: (form: ReturnType<typeof useRecipeForm>) => React.ReactNode
    inAccordion: boolean
}

const FORM_SECTIONS: IFormSection[] = [
    {
        key: 'info',
        label: 'Información básica',
        inAccordion: true,
        render: (form) => (
            <BasicInfoSection
                title={form.title}
                onTitleChange={form.setTitle}
                isPublic={form.isPublic}
                onPublicChange={form.setIsPublic}
            />
        ),
    },
    {
        key: 'ingredients',
        label: 'Ingredientes',
        inAccordion: true,
        render: (form) => (
            <IngredientsSection
                rows={form.ingredients}
                onUpdate={form.updateIngredient}
                onAdd={form.addIngredient}
                onRemove={form.removeIngredient}
            />
        ),
    },
    {
        key: 'instructions',
        label: 'Instrucciones',
        inAccordion: true,
        render: (form) => (
            <InstructionsSection
                rows={form.instructions}
                onUpdate={form.updateInstruction}
                onAdd={form.addInstruction}
                onRemove={form.removeInstruction}
                onMove={form.moveInstruction}
            />
        ),
    },
    {
        key: 'utensils',
        label: 'Utensilios',
        inAccordion: true,
        render: (form) => (
            <UtensilsSection
                rows={form.utensils}
                onUpdate={form.updateUtensil}
                onAdd={form.addUtensil}
                onRemove={form.removeUtensil}
            />
        ),
    },
    {
        key: 'image',
        label: 'Imagen',
        inAccordion: true,
        render: (form) => (
            <ImageUploadSection
                imageUrl={form.imageUrl}
                isUploading={form.isUploading}
                onUpload={form.handleImageUpload}
                onRemove={form.removeImage}
            />
        ),
    },
    {
        key: 'review',
        label: 'Revisar',
        inAccordion: false,
        render: (form) => (
            <ReviewSection
                title={form.title}
                isPublic={form.isPublic}
                ingredients={form.validIngredients}
                instructions={form.validInstructions}
                utensils={form.validUtensils}
                isEditing={form.isEditing}
                isPending={form.isPending}
                onSubmit={form.handleSubmit}
            />
        ),
    },
]

export function RecipeForm(props: IRecipeFormProps) {
    const { initialData } = props
    const form = useRecipeForm(initialData)
    const [step, setStep] = useState(0)

    const accordionSections = FORM_SECTIONS.filter((s) => s.inAccordion)

    return (
        <>
            {/* Mobile wizard */}
            <div className="md:hidden space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        Paso {step + 1} de {FORM_SECTIONS.length}
                    </span>
                    <span className="text-sm font-medium">
                        {FORM_SECTIONS[step].label}
                    </span>
                </div>
                <div className="flex gap-1">
                    {FORM_SECTIONS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 flex-1 rounded-full ${
                                i <= step ? 'bg-primary' : 'bg-muted'
                            }`}
                        />
                    ))}
                </div>

                {FORM_SECTIONS[step].render(form)}

                <div className="flex gap-2 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setStep((s) => Math.max(0, s - 1))}
                        disabled={step === 0}
                        className="flex-1"
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
                    </Button>
                    {step < FORM_SECTIONS.length - 1 && (
                        <Button
                            onClick={() =>
                                setStep((s) =>
                                    Math.min(FORM_SECTIONS.length - 1, s + 1)
                                )
                            }
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
                    defaultValue={accordionSections.map((s) => s.key)}
                >
                    {accordionSections.map((section) => (
                        <AccordionItem key={section.key} value={section.key}>
                            <AccordionTrigger>{section.label}</AccordionTrigger>
                            <AccordionContent>
                                {section.render(form)}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                <Button
                    onClick={form.handleSubmit}
                    disabled={form.isPending}
                    className="w-full"
                    size="lg"
                >
                    {form.isPending
                        ? 'Guardando...'
                        : form.isEditing
                          ? 'Guardar Cambios'
                          : 'Crear Receta'}
                </Button>
            </div>
        </>
    )
}
