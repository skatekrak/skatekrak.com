import { City } from 'map';

const cities: City[] = [
    {
        id: 'paris',
        name: 'Paris',
        edito: 'The city of Love!',
        subtitle: 'We love Paris sidewalks!',
        about: `
Paris is a paradise for skateboarders! From its concrete sidewalks perfect to go get your baguette in the morning to all these iconic spots still receiving their fair amount of destruction nowadays, Paris is the place to be!
        `,
        bounds: [
            [2.2548510078733557, 48.810511704540005],
            [2.4308845217189514, 48.9121314930525],
        ],
    },
    {
        id: 'barcelona',
        name: 'Barcelona',
        edito: 'Euro skate capital',
        subtitle: 'Macbalife!',
        about:
            "You can netflix n chill at Macba all day or you can go discover the crazy amount of piece of art the architectures have created in this spanish playground! It's also a wild place for the party night life..",
        bounds: [
            [2.0576750759531706, 41.32263417922036],
            [2.279536643486864, 41.4467123861632],
        ],
    },
];

export default cities;
