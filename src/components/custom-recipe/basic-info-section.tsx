"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface BasicInfoSectionProps {
  title: string;
  onTitleChange: (value: string) => void;
  isPublic: boolean;
  onPublicChange: (value: boolean) => void;
}

export function BasicInfoSection(props: BasicInfoSectionProps) {
  const { title, onTitleChange, isPublic, onPublicChange } = props;
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          placeholder="Nombre de la receta"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={isPublic} onCheckedChange={onPublicChange} />
        <Label>{isPublic ? "Pública" : "Privada"}</Label>
      </div>
    </div>
  );
}
