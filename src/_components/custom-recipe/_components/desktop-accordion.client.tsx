import { Button } from '@/_components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/_components/ui/accordion'
import { FORM_SECTIONS } from '@/_components/custom-recipe/_constants/form_sections'
import { useRecipeForm } from '@/_hooks/use-recipe-form'

interface IDesktopAccordionRecipeFormProps {
    form: ReturnType<typeof useRecipeForm>
}

export function DesktopAccordionRecipeForm(props: IDesktopAccordionRecipeFormProps) {
    const { form } = props
    const accordionSections = FORM_SECTIONS.filter((s) => s.inAccordion)

    return (
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
    )
}