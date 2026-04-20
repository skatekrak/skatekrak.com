'use client';

import { ImageIcon, Plus, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';

import {
    Badge,
    Button,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Separator,
    Switch,
    Textarea,
} from '@krak/ui';

import { categoryLabels, mapCategories, type MapCategory, type MapFormValues } from './map-form-types';

import type { UseFormReturn } from 'react-hook-form';

// ============================================================================
// Props
// ============================================================================

interface MapFormFieldsProps {
    form: UseFormReturn<MapFormValues>;
    /** When true, the ID field is read-only (edit mode) */
    idReadOnly?: boolean;
    /** Existing image URL for edit mode (shown when no new file is selected) */
    existingImageUrl?: string;
    /** Called when a new image file is selected or cleared */
    onImageChange?: (file: File | null) => void;
}

// ============================================================================
// MapFormFields — shared form fields for create & edit
// ============================================================================

export function MapFormFields({ form, idReadOnly, existingImageUrl, onImageChange }: MapFormFieldsProps) {
    const videosField = useFieldArray({ control: form.control, name: 'videos' });
    const soundtrackField = useFieldArray({ control: form.control, name: 'soundtrack' });
    const watchedCategories = useWatch({ control: form.control, name: 'categories' });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setImagePreview(URL.createObjectURL(file));
        onImageChange?.(file);
    }

    function clearImage() {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onImageChange?.(null);
    }

    function toggleCategory(cat: MapCategory) {
        const current = form.getValues('categories');
        if (current.includes(cat)) {
            form.setValue(
                'categories',
                current.filter((c) => c !== cat),
                { shouldValidate: true },
            );
        } else {
            form.setValue('categories', [...current, cat], { shouldValidate: true });
        }
    }

    // Determine which image to show: new upload preview > existing image > nothing
    const displayImage = imagePreview ?? existingImageUrl ?? null;

    return (
        <>
            <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>ID (slug)</FormLabel>
                        <FormControl>
                            <Input placeholder="my-map" {...field} readOnly={idReadOnly} disabled={idReadOnly} />
                        </FormControl>
                        {!idReadOnly && (
                            <p className="text-xs text-muted-foreground">
                                URL-safe identifier (lowercase, numbers, hyphens)
                            </p>
                        )}
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Image upload */}
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Logo</span>
                {displayImage ? (
                    <div className="relative w-full">
                        <img
                            src={displayImage}
                            alt="Map image preview"
                            className="h-32 w-full rounded-md object-contain"
                        />
                        {imagePreview && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1 size-6 bg-background/80"
                                onClick={clearImage}
                            >
                                <X className="size-3" />
                            </Button>
                        )}
                        {!imagePreview && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute bottom-1 right-1 bg-background/80"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Replace
                            </Button>
                        )}
                    </div>
                ) : (
                    <button
                        type="button"
                        className="flex h-32 w-full items-center justify-center rounded-md border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="flex flex-col items-center gap-1 text-muted-foreground">
                            <ImageIcon className="size-6" />
                            <span className="text-xs">Click to upload</span>
                        </div>
                    </button>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                />
                <p className="text-xs text-muted-foreground">Any image format — will be converted to PNG</p>
            </div>

            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Map name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                            <Input placeholder="Optional subtitle" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Categories as toggleable badges */}
            <FormField
                control={form.control}
                name="categories"
                render={() => (
                    <FormItem>
                        <FormLabel>Categories</FormLabel>
                        <div className="flex flex-wrap gap-1.5">
                            {mapCategories.map((cat) => (
                                <Badge
                                    key={cat}
                                    variant={watchedCategories.includes(cat) ? 'default' : 'outline'}
                                    className="cursor-pointer"
                                    onClick={() => toggleCategory(cat)}
                                >
                                    {categoryLabels[cat] ?? cat}
                                </Badge>
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="edito"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Edito</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Editorial content..." rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>About</FormLabel>
                        <FormControl>
                            <Textarea placeholder="About this map..." rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="staging"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-3">
                        <FormLabel>Staging</FormLabel>
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                    </FormItem>
                )}
            />

            <Separator />

            {/* Videos dynamic list */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Videos</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => videosField.append({ value: '' })}>
                        <Plus className="mr-1 size-4" />
                        Add
                    </Button>
                </div>
                {videosField.fields.map((arrayField, index) => (
                    <div key={arrayField.id} className="flex items-center gap-2">
                        <FormField
                            control={form.control}
                            name={`videos.${index}.value`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => videosField.remove(index)}>
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                ))}
            </div>

            {/* Soundtrack dynamic list */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Soundtrack</span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => soundtrackField.append({ value: '' })}
                    >
                        <Plus className="mr-1 size-4" />
                        Add
                    </Button>
                </div>
                {soundtrackField.fields.map((arrayField, index) => (
                    <div key={arrayField.id} className="flex items-center gap-2">
                        <FormField
                            control={form.control}
                            name={`soundtrack.${index}.value`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input placeholder="Track name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => soundtrackField.remove(index)}>
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </>
    );
}
