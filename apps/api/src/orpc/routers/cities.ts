import { os } from '../base';

export const listCities = os.cities.list.handler(async ({ context }) => {
    const cities = await context.prisma.city.findMany({
        where: { hidden: false },
        orderBy: [{ position: 'asc' }, { name: 'asc' }],
    });

    return cities.map((city) => ({
        ...city,
        bounds: [
            [city.bounds[0], city.bounds[1]],
            [city.bounds[2], city.bounds[3]],
        ] as [[number, number], [number, number]],
    }));
});
