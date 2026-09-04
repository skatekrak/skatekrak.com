'use client';

import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

import { Button, FormControl, FormField, FormItem, FormMessage, Input, cn } from '@krak/ui';

import type { FieldArrayPath, FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

// ============================================================================
// Props
// ============================================================================

interface SortableFieldListProps<TFieldValues extends FieldValues> {
    form: UseFormReturn<TFieldValues>;
    name: FieldArrayPath<TFieldValues>;
    fields: { id: string }[];
    placeholder: string;
    onMove: (from: number, to: number) => void;
    onRemove: (index: number) => void;
    /** When false, rows render without the drag handle and reordering is disabled */
    reorderable?: boolean;
}

// ============================================================================
// SortableFieldList — drag-and-drop reorderable list of text inputs
// ============================================================================

export function SortableFieldList<TFieldValues extends FieldValues>({
    form,
    name,
    fields,
    placeholder,
    onMove,
    onRemove,
    reorderable = false,
}: SortableFieldListProps<TFieldValues>) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const from = fields.findIndex((f) => f.id === active.id);
        const to = fields.findIndex((f) => f.id === over.id);
        if (from === -1 || to === -1) return;
        onMove(from, to);
    }

    if (!reorderable) {
        return (
            <>
                {fields.map((arrayField, index) => (
                    <FieldRow
                        key={arrayField.id}
                        form={form}
                        name={name}
                        index={index}
                        placeholder={placeholder}
                        onRemove={onRemove}
                        reorderable={false}
                    />
                ))}
            </>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                {fields.map((arrayField, index) => (
                    <SortableFieldRow
                        key={arrayField.id}
                        id={arrayField.id}
                        form={form}
                        name={name}
                        index={index}
                        placeholder={placeholder}
                        onRemove={onRemove}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );
}

// ============================================================================
// SortableFieldRow — a single draggable row
// ============================================================================

interface FieldRowBaseProps<TFieldValues extends FieldValues> {
    form: UseFormReturn<TFieldValues>;
    name: FieldArrayPath<TFieldValues>;
    index: number;
    placeholder: string;
    onRemove: (index: number) => void;
}

interface SortableFieldRowProps<TFieldValues extends FieldValues> extends FieldRowBaseProps<TFieldValues> {
    id: string;
}

function SortableFieldRow<TFieldValues extends FieldValues>({
    id,
    form,
    name,
    index,
    placeholder,
    onRemove,
}: SortableFieldRowProps<TFieldValues>) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className={cn('flex items-center gap-2', isDragging && 'z-10 opacity-80')}>
            <button
                type="button"
                className="flex size-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground active:cursor-grabbing"
                aria-label="Drag to reorder"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="size-4" />
            </button>
            <FieldInput form={form} name={name} index={index} placeholder={placeholder} />
            <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(index)}>
                <Trash2 className="size-4" />
            </Button>
        </div>
    );
}

// ============================================================================
// FieldRow — a single non-draggable row (used when reordering is disabled)
// ============================================================================

interface FieldRowProps<TFieldValues extends FieldValues> extends FieldRowBaseProps<TFieldValues> {
    reorderable: false;
}

function FieldRow<TFieldValues extends FieldValues>({
    form,
    name,
    index,
    placeholder,
    onRemove,
}: FieldRowProps<TFieldValues>) {
    return (
        <div className="flex items-center gap-2">
            <FieldInput form={form} name={name} index={index} placeholder={placeholder} />
            <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(index)}>
                <Trash2 className="size-4" />
            </Button>
        </div>
    );
}

// ============================================================================
// FieldInput — the form-bound text input shared by both row variants
// ============================================================================

function FieldInput<TFieldValues extends FieldValues>({
    form,
    name,
    index,
    placeholder,
}: {
    form: UseFormReturn<TFieldValues>;
    name: FieldArrayPath<TFieldValues>;
    index: number;
    placeholder: string;
}) {
    return (
        <FormField
            control={form.control}
            name={`${name}.${index}.value` as FieldPath<TFieldValues>}
            render={({ field }) => (
                <FormItem className="flex-1">
                    <FormControl>
                        <Input placeholder={placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
