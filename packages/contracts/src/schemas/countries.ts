import { z } from 'zod';

const countryFields = {
    code: z.string().regex(/^[A-Z]{2}$/, 'Use a two-letter uppercase country code, e.g. FR'),
    name: z.string().trim().min(1),
    subtitle: z.string(),
    edito: z.string(),
    about: z.string(),
    videos: z.array(z.url({ protocol: /^https?$/ })),
    soundtrack: z.array(z.string().trim().min(1)),
    bounds: z
        .tuple([
            z.tuple([z.number().min(-180).max(180), z.number().min(-85.051129).max(85.051129)]),
            z.tuple([z.number().min(-180).max(180), z.number().min(-85.051129).max(85.051129)]),
        ])
        .refine(
            ([[west, south], [east, north]]) => west !== east && south !== north,
            'Select a zone with a width and height on the map',
        ),
    hidden: z.boolean(),
};

export const CountrySchema = z.object({
    id: z.string(),
    ...countryFields,
});

export const createCountryInput = z.object({
    id: z
        .string()
        .min(1)
        .regex(/^[a-z0-9-]+$/, 'ID must contain only lowercase letters, numbers, and hyphens'),
    ...countryFields,
});

export const updateCountryInput = z
    .object(countryFields)
    .partial()
    .extend({ id: z.string().min(1) });
export const countryIdInput = z.object({ id: z.string().min(1) });

export type Country = z.infer<typeof CountrySchema>;
