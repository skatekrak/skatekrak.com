import { z } from 'zod';

const cityFields = {
    name: z.string().min(1),
    smallName: z.string().nullable(),
    subtitle: z.string(),
    edito: z.string(),
    about: z.string(),
    bounds: z.tuple([z.tuple([z.number(), z.number()]), z.tuple([z.number(), z.number()])]),
    videos: z.array(z.url()),
    position: z.number().int().min(0),
    hidden: z.boolean(),
};

export const CitySchema = z.object({
    id: z.string(),
    ...cityFields,
});

export const createCityInput = z.object({
    id: z
        .string()
        .min(1)
        .regex(/^[a-z0-9-]+$/, 'ID must contain only lowercase letters, numbers, and hyphens'),
    ...cityFields,
});

export const updateCityInput = z
    .object(cityFields)
    .partial()
    .extend({ id: z.string().min(1) });

export const deleteCityInput = z.object({ id: z.string().min(1) });

export type City = z.infer<typeof CitySchema>;
