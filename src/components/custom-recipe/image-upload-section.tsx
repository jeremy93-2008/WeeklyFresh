"use client";

import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ImageUploadSectionProps {
  imageUrl: string | null;
  isUploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export function ImageUploadSection(props: ImageUploadSectionProps) {
  const { imageUrl, isUploading, onUpload, onRemove } = props;
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
            onClick={onRemove}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
      <Input
        type="file"
        accept="image/*"
        onChange={onUpload}
        disabled={isUploading}
      />
      {isUploading && (
        <p className="text-xs text-muted-foreground">Subiendo...</p>
      )}
    </div>
  );
}
