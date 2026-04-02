import { Button } from '@/_components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { FORM_SECTIONS } from '@/_components/custom-recipe/_constants/form_sections'
import { useRecipeForm } from '@/_hooks/use-recipe-form'

interface IMobileWizardRecipeFormProps {
    form: ReturnType<typeof useRecipeForm>
}

export function MobileWizardRecipeForm(props: IMobileWizardRecipeFormProps) {
    const { form } = props

    const [step, setStep] = useState(0)

    return (
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
    )
}