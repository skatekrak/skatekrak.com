export default [
    {
        id: 'jenkem',
        name: 'JENKEM',
        subtitle: 'Evolution of...',
        edito: 'There are still many more spots worth chronicling for our ‘Evolution of…’ series.',
        about:
            'In an effort to educate ourselves and any other skateboarders, we decided to visit some of the most iconic spots with some of the city’s foremost skate historians and ask them to walk us through the timelines of these architectural blessings.\nWhat we came up with is a new series on the “Evolution” of New York City’s [*sic*] skate spots.',
        spots: require('data/evolutionof.json'),
    },
    {
        id: 'spohnranch',
        name: 'Spohn Ranch',
        subtitle: 'Spohn Ranch Skateparks',
        edito: 'Designing and building skateparks with the relentless dedication to detail and architectural finesse.',
        about:
            'Spohn Ranch began as a community, anchored by Aaron Spohn’s backyard half-pipe, and grew into an award-winning skatepark design-build firm.\nA cornerstone of wheel sports progression for over 30 years, Spohn Ranch’s Los Angeles backyard roots have spread globally, culminating in hundreds of cutting-edge creations.',
        spots: require('data/spohn.json'),
    },
    {
        id: 'theboardr',
        name: 'The Boardr Events',
        subtitle: 'The Boardr Events Map',
        edito:
            'The Boardr hosts and organizes skateboardings big events like Vans Park Series and small ones like the Grind for Life series.',
        about: `
        We host and organize skateboarding's top events like Vans Park Series.
        \n
        The Boardr also owns and operates grassroots series such as The Boardr Am and Grind for Life. These 15 annual events target younger, newer participants and cover the United States.
        \n
        We want to grow skateboarding and help you also do what we do, so we made an in depth roadmap on how to run your own skateboarding event you can find on our site at [TheBoardr.com](http://theboardr.com/)
        \n
        Our software, The Boardr Live™, powers several top events in skateboarding, from payment transactions to live scoring and broadcast data integration. Check it out at [SkateScores.com](http://skatescores.com/)
        \n
        If you want your event and all the details to be professionally executed by proven experts who live and breate this industry, The Boardr is who you hire.
        `,
        spots: require('data/theboardr.json'),
    },
];
