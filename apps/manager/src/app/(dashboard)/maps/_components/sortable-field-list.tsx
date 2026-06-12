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

import type { MapFormValues } from './map-form-types';
import type { FieldArrayWithId, UseFormReturn } from 'react-hook-form';

// ============================================================================
// Props
// ============================================================================

type ReorderableArrayName = 'videos' | 'soundtrack';

interface SortableFieldListProps {
    form: UseFormReturn<MapFormValues>;
    name: ReorderableArrayName;
    fields: FieldArrayWithId<MapFormValues, ReorderableArrayName, 'id'>[];
    placeholder: string;
    onMove: (from: number, to: number) => void;
    onRemove: (index: number) => void;
    /** When false, rows render without the drag handle and reordering is disabled */
    reorderable?: boolean;
}

// ============================================================================
// SortableFieldList — drag-and-drop reorderable list of text inputs
// ============================================================================

export function SortableFieldList({
    form,
    name,
    fields,
    placeholder,
    onMove,
    onRemove,
    reorderable = false,
}: SortableFieldListProps) {
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

interface FieldRowBaseProps {
    form: UseFormReturn<MapFormValues>;
    name: ReorderableArrayName;
    index: number;
    placeholder: string;
    onRemove: (index: number) => void;
}

interface SortableFieldRowProps extends FieldRowBaseProps {
    id: string;
}

function SortableFieldRow({ id, form, name, index, placeholder, onRemove }: SortableFieldRowProps) {
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

interface FieldRowProps extends FieldRowBaseProps {
    reorderable: false;
}

function FieldRow({ form, name, index, placeholder, onRemove }: FieldRowProps) {
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

function FieldInput({
    form,
    name,
    index,
    placeholder,
}: {
    form: UseFormReturn<MapFormValues>;
    name: ReorderableArrayName;
    index: number;
    placeholder: string;
}) {
    return (
        <FormField
            control={form.control}
            name={`${name}.${index}.value`}
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
