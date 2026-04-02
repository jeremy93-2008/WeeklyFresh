import { BasicInfoSection } from '../_components/section/basic-info-section.client'
import { IngredientsSection } from '../_components/section/ingredients-section.client'
import { InstructionsSection } from '../_components/section/instructions-section.client'
import { UtensilsSection } from '../_components/section/utensils-section.client'
import { ImageUploadSection } from '../_components/section/image-upload-section.client'
import { ReviewSection } from '../_components/section/review-section.client'
import { useRecipeForm } from '@/_hooks/use-recipe-form'

interface IFormSection {
    key: string
    label: string
    render: (form: ReturnType<typeof useRecipeForm>) => React.ReactNode
    inAccordion: boolean
}

export const FORM_SECTIONS: IFormSection[] = [
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