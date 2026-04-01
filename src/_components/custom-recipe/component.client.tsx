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
import { FORM_SECTIONS } from './_constants/form_sections'

export type { IRecipeFormData }

export interface IRecipeFormProps {
    initialData?: IRecipeFormData
}

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
