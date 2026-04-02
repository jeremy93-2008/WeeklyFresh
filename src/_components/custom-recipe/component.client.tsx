'use client'

import { useRecipeForm, type IRecipeFormData } from '@/_hooks/use-recipe-form'
import { MobileWizardRecipeForm } from '@/_components/custom-recipe/_components/mobile-wizard.client'
import { DesktopAccordionRecipeForm } from '@/_components/custom-recipe/_components/desktop-accordion.client'

export type { IRecipeFormData }

export interface IRecipeFormProps {
    initialData?: IRecipeFormData
}

export function RecipeForm(props: IRecipeFormProps) {
    const { initialData } = props
    const form = useRecipeForm(initialData)

    return (
        <>
            <MobileWizardRecipeForm form={form} />
            <DesktopAccordionRecipeForm form={form} />
        </>
    )
}
