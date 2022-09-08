export default [
    {
        id: 'famous',
        name: 'Famous Spots',
        subtitle: 'Who did what?',
        edito: 'Worldwide famous spots with decades of skateboarding history.',
        about: `
We try to keep track of what's been done on these spots for a while now! Rewatch skateboarding history on all these familiar spots and add your knowledge or your own footage on the app!
        `,
        spots: require('data/customMaps/famous.json'),
    },
    {
        id: 'history',
        name: 'Krak History Clip',
        subtitle: 'Krak History Clip',
        edito: 'Skateboarding history right there!',
        about: `
Decades of Skateboarding History on famous worldwide epic spots.

We tried to compile every tricks we had in mind landed on these spots and we update the list on our mag when we think of something we forgot or everytime someone lands a new trick!

Check it in the clips section of each spot!
        `,
        spots: require('data/customMaps/history.json'),
        videos: ['https://youtu.be/wHhMC5sWqdc'],
    },
    {
        id: 'minute',
        name: 'Krak Minute',
        subtitle: 'Krak Minute',
        edito: 'One minute of tricks on worldwide famous spots.',
        about: `
After the History Clip serie, we kept going with this new format that enabled us to highlight less legendary but still amazing spots. 

Krak Minute is one minute of tricks from the best footage uploaded on the app. 

Check it in the clips section of each spot!
        `,
        spots: require('data/customMaps/minute.json'),
        videos: ['https://www.youtube.com/watch?v=ODidvGV7bUA&list=PL2q6XHjX4Ujd3_6mUWQQe02cFvGg1ILNX'],
    },
    {
        id: 'spohnranch',
        name: 'Spohn Ranch',
        subtitle: 'Spohn Ranch Skateparks',
        edito: 'Designing and building skateparks with the relentless dedication to detail and architectural finesse.',
        about: 'Spohn Ranch began as a community, anchored by Aaron Spohn’s backyard half-pipe, and grew into an award-winning skatepark design-build firm.\nA cornerstone of wheel sports progression for over 30 years, Spohn Ranch’s Los Angeles backyard roots have spread globally, culminating in hundreds of cutting-edge creations.',
        spots: require('data/customMaps/spohn.json'),
        staging: true,
    },
    {
        id: 'theboardr',
        name: 'The Boardr Events',
        subtitle: 'The Boardr Events Map',
        edito: 'The Boardr hosts and organizes skateboardings big events like Vans Park Series and small ones like the Grind for Life series.',
        about: `
We host and organize skateboarding's top events like Vans Park Series.
The Boardr also owns and operates grassroots series such as The Boardr Am and Grind for Life. These 15 annual events target younger, newer participants and cover the United States.
We want to grow skateboarding and help you also do what we do, so we made an in depth roadmap on how to run your own skateboarding event you can find on our site at [TheBoardr.com](http://theboardr.com/)
Our software, The Boardr Live™, powers several top events in skateboarding, from payment transactions to live scoring and broadcast data integration. Check it out at [SkateScores.com](http://skatescores.com/)
If you want your event and all the details to be professionally executed by proven experts who live and breate this industry, The Boardr is who you hire.
        `,
        spots: require('data/customMaps/theboardr.json'),
        staging: true,
    },
    {
        id: 'theblacklist',
        name: 'The Black List',
        subtitle: 'Black-owned biz to support',
        edito: 'We believe that getting eyeballs on a list of Black-owned brands is a humble, yet necessary offering to building whatever lies ahead.',
        about: '"Over the last decade, skating has diversified and globalized tremendously. Despite this progress, however, “The Industry” remains very white, very Californian, and it retains hegemonic control over the direction of skateboarding."\nSpecial thanks to Patrick Kigongo.',
        spots: require('data/customMaps/theblacklist.json'),
        staging: true,
    },
    {
        id: 'nycsubway',
        name: 'NYC Subway Spots',
        subtitle: '100% Illegal',
        edito: 'Your guide to skating the NYC subway system.',
        about: `
Our friends at Jenkem cooked us a brief map to some of the most skateable spots within the NYC subway system a while ago. 

It's a non-exhaustive list so feel free to add your spots on the map with the app!
        
As they reminded in their article, don't forget skateboarding on MTA property is 100% illegal so watch out before you go for a trick!
        `,
        spots: require('data/customMaps/nycsubway.json'),
        videos: ['https://www.youtube.com/watch?v=uNkFTKsYqiY'],
    },
    {
        id: 'betty',
        name: 'Betty',
        subtitle: 'Betty',
        edito: 'Vans Europe Present: Betty',
        about: `
After last winter when the pandemic came around, Harry Billiet started filming his homies. Turned out they all killed it non-stop for a whole year so the project naturally became a real team video with the support of Vans. Most of the scenes are in Belgium instead of some in Luxemburg and Marseille.
The video speaks for itself. These three Betties battled together through lockdowns.

Skaters
Jonathan Vlerick
Jeroen Bruggeman
Arthur Buyltinck
Timothy Deconinck
        `,
        spots: require('data/customMaps/betty.json'),
        staging: false,
        videos: ['https://www.youtube.com/watch?v=vc1XPamfLUY'],
    },
    {
        id: 'knobbuster',
        name: 'The Knobbuster',
        subtitle: 'Who you gonna call?',
        edito: 'He is a hero for the community! Delivering iconic spots from those horrible skatestoppers popping out everywhere in the Los Angeles area!',
        about: `
This guy is keeping the magic alive! How cool it is to see pros skating these iconic spots today!

Let History continue! The show must go on!
        `,
        spots: require('data/customMaps/knobbuster.json'),
        staging: true,
    },
    {
        id: 'andrew',
        name: 'Andrew Reynolds Frontside Flips',
        subtitle: 'The perfect flick!',
        edito: 'The Boss signature trick!',
        about: `
Nobody can teach you frontside flips better than Andrew! It's been his signature trick for decades now and he brought it to quite a lot of iconic spots! 
        `,
        spots: require('data/customMaps/andrew.json'),
        staging: true,
    },
    {
        id: 'googleearthers',
        name: 'Google Earthers',
        subtitle: "'Mankind's biggest tool/enemy'",
        edito: "Jake Keenan's spots as seen in his Google Earthers episodes playing on jenkemmag.com",
        about: `
Jake Keenan uses Google Earth to find unusual and virgin skate spots in the NYC landscape. Google Earth and Street View are used by several skaters/filmers across the globe!
        `,
        spots: require('data/customMaps/googleearthers.json'),
        videos: ['https://www.youtube.com/watch?v=JEd_YeihXnI&list=PLu4RiFW9tsSnAzCkMFvG0sfSzST642zgg'],
    },
    {
        id: 'thps',
        name: "Tony Hawk Pro Skater's Spots",
        subtitle: 'Nine Hundred!',
        edito: 'All the spots and inspirations from the famous game series in real life!',
        about: `
Back to that era he was the one who could spin with his board more than anyone else and he is still rippin today in his fifty's! Tony Hawk is a legend and his game rocked our teenage years! 

Rediscover the first 2 games remastered in HD out now!
        `,
        spots: require('data/customMaps/thps.json'),
        staging: true,
    },
    {
        id: 'onespotpart',
        name: 'One spot video-parts',
        subtitle: 'They own the spot!',
        edito: 'Video-parts filmed intentionally at one spot.',
        about: `
From the good people at *Quartersnacks*, a map for all these local legends killing their plaza like no one else.
Here is the original article :
https://quartersnacks.com/2021/07/introducing-the-quartersnacks-one-spot-part-map
        `,
        spots: require('data/customMaps/onespotpart.json'),
        staging: true,
    },
];
