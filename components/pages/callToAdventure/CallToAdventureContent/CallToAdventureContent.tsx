import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import React from 'react';
import { ctaSections } from '../constants';

import krakBasquiat from 'public/images/call-to-adventure/krak-basquiat.jpg';
import * as S from './CallToAdventureContent.styled';

const CallToAdventureContent = () => {
    return (
        <>
            <div id={ctaSections.TLDR} data-spy>
                <S.CallToAdventureTitle component="heading5">tl;dr</S.CallToAdventureTitle>
                <S.CallToAdventureBody>
                    We’re a bunch of skateboarders. Hungry to make sure skateboarding keeps its roots deep in
                    creativity, openness, rebellion and freedom. Foolish to believe we can build and own this
                    altogether. Independantly, collectively.
                    <br />
                    <br />
                    Our mission is twofold:
                    <br />
                    (a) make more skateboarding happen in this world.
                    <br />
                    (b) archive and save every pieces, corners, moments of our culture.
                    <br />
                    <br />
                    And we want to achieve this by creating a proper common good. You can think of us as if Wikipedia,
                    OpenStreetMap, Thrasher and a DAO had a baby.
                    <br />
                    <br />
                    - Wikipedia? yep! We are building a free online skateboarding encyclopedia written and maintained by
                    a community of passionate skateboarders through open collaboration.
                    <br />
                    - OpenStreetMap? yep! We are building a free, editable map of the whole world that is being built by
                    passionate skateboarders largely from scratch and released with an open-content license.
                    <br />
                    - Thrasher? yep! We are building a full skateboarding centric publication.
                    <br />
                    - DAO? yep! We are building a decentralized autonomous organization (DAO).
                    <br />
                    <br />
                    Krak is 100% owned by skateboarders and the community.
                </S.CallToAdventureBody>
                <S.CallTiAdventureImage src="/images/call-to-adventure/krak-basquiat.jpg" alt="basquiat krak canvas" />
            </div>
            <div id={ctaSections.EVOLUTION} data-spy>
                <S.CallToAdventureTitle component="heading5">skateboarding evolution</S.CallToAdventureTitle>
                <S.CallToAdventureBody>
                    Everyone reading this should know what we’re talking about but still, highlighting a bit more
                    context around skateboarding might be useful.
                    <br />
                    <br />
                    The best definition ever for us came from{' '}
                    <a href="https://en.wikipedia.org/wiki/Ian_MacKaye" target="_blank" rel="noopener noreferrer">
                        Ian MacKaye
                    </a>
                    : “Skateboarding is not a hobby. And it’s not a sport. Skateboarding is a way of learning how to
                    redefine the world around you. It’s a way of getting out of house, connecting with other people, and
                    looking at the world through different sets of eyes.” Every word feels equally important in these
                    sentences. As long as skateboarding stayed a kind of underground culture, this was the way everyone
                    experienced it.
                    <br />
                    <br />
                    If you haven’t watched this documentary, Dogtown and Z-Boys is certainly the perfect dive into the
                    70’s surfer culture turned sidewalk surfers skateboarders.
                </S.CallToAdventureBody>
                <VideoPlayer
                    style={{ marginBottom: '2rem' }}
                    url="https://www.youtube.com/watch?v=xP9EMH6R50w"
                    controls
                />
                <S.CallToAdventureBody>
                    Kev also did a hour-long discussion - in french 🇫🇷 - last summer about skateboarding, the history,
                    evolution and the trends.
                    <br />
                    <br />
                    <iframe
                        src="https://open.spotify.com/embed/episode/6e7Fhq5P3NQXCYwzRJX3Tl?utm_source=generator&theme=0"
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                    ></iframe>
                    <br />
                    <br />
                    Along the way - and across 40 years at least - skateboarding grew bigger and bigger and started to
                    hugely influence more industries.
                    <br />
                    <br />
                    - In fashion, Supreme, which started as a little skateshop in Manhattan back in 1994, sold for $2bn+
                    to VF Corp at the end of 2020.
                    <br />
                    - In luxury, Virgil Abloh - RIP - ex Louis Vuitton creative director, used to be a skater and got a
                    lot of his inspiration from the community.
                    <br />
                    - In culture, Tony Hawk Pro Skater is still one of the most sold ever video-game serie in sports.
                    <br />- In art, look at what{' '}
                    <a href="https://theskateroom.com" target="_blank" rel="noopener noreferrer">
                        The Skate Room{' '}
                    </a>
                    is doing: selling $500 decks with paintings from Basquiat on them.
                    <br />
                    <br />
                    All of this new acquired fame and influence attracted the biggest corporations of our world - Nike,
                    Adidas, Red Bull, the list is endless - and it turned skateboarding into an official Olympic Sport -
                    first appearance in Tokyo in 2021, second will be in Paris in 2024, and it’s already been confirmed
                    in LA in 2028.
                    <br />
                    <br />
                    This is cool of course but it also distorted the whole skateboarding landscape. Now we get on one
                    side big corps with the economical and political influence to decide whatever they want - and they
                    don’t make anything for the culture per se, their incentive is crystal clear: sell more sugar cans,
                    shoes and so on. They’re the ones deciding who gets paid in skateboarding [few pro’s - poorly
                    treated though; even fewer filmers & photographers — more poorly treated]; which parks to build,
                    where etc.
                    <br />
                    On the other side, we get tons of DIY [Do It Yourself] initiatives, locally rooted, lead by
                    extremely ressourceful people, who spend all their energy for free because they do all this just for
                    the passion. They have no economical power. No political influence. While they’re the ones cementing
                    the community.
                    <br />
                    <br />
                    Krak aspires to unite all of these passionate people. Collectively, we could have more economical
                    power and political influence than any big corp. We could welcome 100x more people in the community,
                    offering them a way to make a life out of it. We could create physical spaces [plaza, parks, rooms
                    etc] around the world and offer them as safe and thriving hubs for the people. Possibilities are
                    endless.
                </S.CallToAdventureBody>
            </div>
            <div id={ctaSections.ARCHIVING} data-spy>
                <S.CallToAdventureTitle component="heading5">why archiving is important</S.CallToAdventureTitle>
                <S.CallToAdventureBody>
                    When you ride somewhere, you leave an imprint. But at the speed things are now going, how can we
                    remember all the tricks done on a specific spot? and what about all the tricks on all the famous
                    spots worldwide?
                    <br />
                    <br />
                    Skateboarding evolves faster and faster and a lot of stuff will be forgotten and lost forever if not
                    documented. Krak is about annotating the streets somehow.
                    <br />
                    Old videos can be hard to find online and quality can be heartbreaking. Sometimes video parts get
                    deleted when pro’s switch sponsors. We’ve been dreaming of such a wiki-ABD kind of map and it will
                    surely help the younger generations to be aware of the past and add their own local scene videos and
                    write history themselves.
                    <br />
                    <br />
                    On a larger scale, archiving skate spots worldwide has always felt important to us. How to make sure
                    our culture survives centuries? milleniums?
                    <br />
                    So at some point, we’ve been like ‘sure, why not’. Let’s archive the culture and try to make it last
                    forever
                </S.CallToAdventureBody>
            </div>
            <div id={ctaSections.ABOUT} data-spy>
                <S.CallToAdventureTitle component="heading5">who we are</S.CallToAdventureTitle>
                <S.CallToAdventureBody>
                    Krak has been managed by a core team of 5 people since 2014. We received tons of help along the way
                    and at its peak, in 2018, there were 10 of us working full time.
                    <br />
                    <br />
                    Kev dreamt about Krak for the past 20+ years, literally. He grew up between Lyon and Paris and got
                    lost during every school holidays whith his board under his arm because his mother brought him and
                    his brothers in a new little town, somewhere in the french countryside. Where were the other
                    skaters? Where are the spots?
                    <br />
                    <br />
                    He started working on Krak in late 2013, while he was living in Singapore. Max joined him in the
                    first half of 2014 and both of them moved to LA during that summer to launch the company. Simon
                    spent his life skateboarding and filming others, literally. As a filmer responsible for trips, he
                    spent countless hours mapping their destination (which he continues to do nowadays by the way). He
                    joined Krak in early 2015. He also launched Silence Skateboards during that period.
                </S.CallToAdventureBody>
                <VideoPlayer
                    style={{ marginBottom: '2rem' }}
                    url="https://www.youtube.com/watch?v=J6E9jEcJJO0&feature=emb_title"
                    controls
                />
                <S.CallToAdventureBody>
                    Arthur joined in early 2018 and today, the 4 of us are dedicating some energy, bandwidth and space
                    to Krak on a weekly basis. Beyond us though, there is a community of 25 people, passionated, and
                    dedicated to skateboarding and its culture. They are developers, designers, entrepreneurs, hustlers.
                    Watching the level of energy of such a small group, we started dreaming about the impact 150 of us
                    could have, 250, 500, a thousand, ten thousands.
                </S.CallToAdventureBody>
            </div>
            <div id={ctaSections.DONE} data-spy>
                <S.CallToAdventureTitle component="heading5">what we’ve done</S.CallToAdventureTitle>
                <S.CallToAdventureBody>
                    While the project itself took many forms along all these years, the passion and mission always
                    stayed the same.
                    <br />
                    <br />
                    And because we’ve decided quite early on to build for this community, we now enjoy a kinda nice
                    track-record. Let’s dive into it - and brag a bit while we’re at it 😈
                    <br />
                    <br />
                    In no particular order, here are what we built and launched so far 👇
                    <br />
                    <br />
                    - the hardware device
                    <br />
                    This feels like ages ago. We’re late 2013 / early 2014 and we built a 3D printed prototype of a
                    hardware device that we attach to our board - right under the truck axle - that tracks every motion
                    of the board to recognize which tricks we’ve just landed.
                    <br />
                    We went through many names at that time as well: trcksy, indy trackers, wodd, krack, krak. That name
                    - with the final orthograph and logo - only came up late 2014.
                    <br />
                    <br />- Krak app and its skatespots database
                    <br />I realised we called our very first app: iOS Summer 😎 This one is so close to our hearts. We
                    now count more than 25,000 skatespots added to the database by the community.
                    <br />
                    And if I look in the past 6 months, we get between +10 and +800 new spots added per week.
                    <br />
                    <br />- KrakBox
                    <br />
                    We launched mid-2015 the very first subscription box for skateboarders. For $39, people would
                    receive every 2 month a mistery package - full of skateboarding paraphernalia. Think components,
                    accessories, cultural stuff, apparel, electronics, art and more. In 2018, we were sending 2,000
                    boxes around the world: US, Canada, across 12 countries in Europe and in Australia.
                    <br />
                    <br />
                    - KrakMag
                    <br />- Krak History Clip and our Youtube channel
                    <br />- some collabs and our own merch
                    <br />- some physical events and many sessions
                    <br />- the Krak Session app
                    <br />- the news feed
                    <br />- the video feed
                    <br />- the map on the web
                    <br />- the discord community
                </S.CallToAdventureBody>
                <div id={ctaSections.VISION} data-spy>
                    <S.CallToAdventureTitle component="heading5">where we’re heading to</S.CallToAdventureTitle>
                </div>
                <div id={ctaSections.DAO} data-spy>
                    <S.CallToAdventureTitle component="heading5">why a DAO + coop</S.CallToAdventureTitle>
                </div>
                <div id={ctaSections.FINAL} data-spy>
                    <S.CallToAdventureTitle component="heading5">final words - worldbuilding</S.CallToAdventureTitle>
                </div>
            </div>
        </>
    );
};

export default CallToAdventureContent;
