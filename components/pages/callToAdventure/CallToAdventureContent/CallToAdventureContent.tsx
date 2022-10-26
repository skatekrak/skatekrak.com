import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import React from 'react';
import { ctaSections } from '../constants';

import * as S from './CallToAdventureContent.styled';

const CallToAdventureContent = () => {
    return (
        <>
            <div id={ctaSections.TLDR} data-spy>
                <S.CallToAdventureTitle component="heading5">tl;dr</S.CallToAdventureTitle>
                <S.CallToAdventureBody>
                    We’re a bunch of skateboarders. Hungry to make sure skateboarding keeps its roots deep in
                    creativity, openness, rebellion and freedom. Foolish to believe we can build and own this
                    altogether, independantly, collectively.
                    <br />
                    <br />
                    Our mission is twofold:
                    <br />
                    (a) make more skateboarding happen in this world.
                    <br />
                    (b) archive and save every piece, corner, moment of our culture.
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
                    - DAO? yep! We are building a Decentralized Autonomous Organization.
                    <br />
                    <br />
                    Our forever promise? To make Krak a community asset, 100% owned by skateboarders, workers and the
                    community.
                </S.CallToAdventureBody>
                <S.CallTiAdventureImage src="/images/call-to-adventure/krak-basquiat.jpg" alt="basquiat krak canvas" />
                <S.CallToAdventureImageLegend>
                    <strong>A Panel of Experts</strong> is a painting created by American artist{' '}
                    <a
                        href="https://en.wikipedia.org/wiki/Jean-Michel_Basquiat"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Jean-Michel Basquiat{' '}
                    </a>
                    in 1982.
                    <br />
                    <br />
                </S.CallToAdventureImageLegend>
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
                    If you haven’t watched this documentary, <i>Dogtown and Z-Boys</i> is certainly the perfect dive
                    into the 70’s surfer culture turned <span className="line-through">sidewalk surfers</span>
                    {'  '} skateboarders.
                </S.CallToAdventureBody>
                <VideoPlayer
                    style={{ marginBottom: '2rem' }}
                    url="https://www.youtube.com/watch?v=xP9EMH6R50w"
                    controls
                />
                <S.CallToAdventureBody>
                    I also did a hour-long discussion - in french 🇫🇷 - last summer about skateboarding, the history,
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
                    - In culture, Tony Hawk Pro Skater is still one of the most sold ever video-game series in sports.
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
                    treated though; even fewer filmers and photographers — more poorly treated]; which parks to build,
                    where etc.
                    <br />
                    On the other side, we get tons of DIY [Do It Yourself] initiatives, locally rooted, led by extremely
                    ressourceful people, who spend all their energy for free because they do all this just for the
                    passion. They have no economical power. No political influence. While they’re the ones cementing the
                    community.
                    <br />
                    <br />
                    Krak aspires to unite all of these passionate people. Collectively, we could have more economical
                    power and political influence than any big corp. We could welcome 100x more people in the community,
                    offering them a way to make a life out of it. We could create physical spaces [plaza, parks, rooms
                    etc] around the world and offer them as safe and thriving hubs for the people. Possibilities are
                    endless.
                    <br />
                    <br />
                    Krak is a labour of love. It’s about passion. It’s about time.
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
                    documented. There’s something special with skatespots. Spots have history, context, and feel alive.
                    Krak is about annotating the streets somehow.
                    <br />
                    <br />
                    There is something very special that resonates with us re:{' '}
                    <a
                        href="https://www.placesconsulting.com/content/Character-Spirit-of-Place.html"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        the Spirit of place
                    </a>
                    :
                </S.CallToAdventureBody>
                <S.CallTiAdventureQuote>
                    Places are like people: they have personality and character. They are complicated and endlessly
                    interesting; we can and do fall in love with places just as we do with people.
                    <br />
                    When people feel richly connected to the places where they live, work, and play they will invest
                    more of themselves in those places. They will participate in civic life, engage in the issues that
                    shape the future. The connection of people to a place—again, to the land itself, to the cultures
                    people have created there, and to the buildings people have built there—is a form of social capital,
                    perhaps the single most important factor in whether a real community exists in a place.
                    <br />
                    To have healthy places, we must find ways to keep alive what is distinctive and emotionally
                    compelling there, which begins in understanding what those things are.
                </S.CallTiAdventureQuote>
                <S.CallToAdventureBody>
                    The map is such a beautiful medium to imbue our ‘skateboarding places’ with the sublime.
                    <br />
                    <br />
                    Old videos can be hard to find online and quality can be heartbreaking. Sometimes video parts get
                    deleted when pro’s switch sponsors. We’ve been dreaming of such a wiki-ABD kind of map and it will
                    surely help the younger generations to be aware of the past and add their own local scene videos and
                    write history themselves.
                    <br />
                    <br />
                    On a larger scale, archiving skatespots worldwide has always felt important to us. How to make sure
                    our culture survives centuries? milleniums?
                    <br />
                    So at some point, we’ve been like ‘sure, why not’. Let’s archive the culture and try to make it last
                    forever.
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
                    spent countless hours mapping their destination [which he continues to do nowadays by the way]. He
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
                </S.CallToAdventureBody>
                <S.CallTiAdventureBullet as="li">the hardware device</S.CallTiAdventureBullet>
                <S.CallToAdventureBody>
                    This feels like ages ago. We’re late 2013 / early 2014 and we built a 3D printed prototype of a
                    hardware device that we attached to our board - right under the truck axle - that tracked every
                    motion of the board to recognize which tricks we had just landed.
                    <br />
                    We went through many names at that time as well: trcksy, indy trackers, wodd, krack, krak. That name
                    - with the final orthograph and logo [made by{' '}
                    <a href="https://www.paradestud.io/" target="_blank" rel="noopener noreferrer">
                        Parade Studio
                    </a>
                    ] - only came up late 2014.
                </S.CallToAdventureBody>
                <S.CallTiAdventureBullet as="li">Krak app and its skatespots database</S.CallTiAdventureBullet>
                <S.CallToAdventureBody>
                    I realised we called our very first app: iOS Summer 😎 This one is so close to our hearts. We now
                    count more than 25,000 skatespots added to the database by the community.
                    <br />
                    And if I look in the past 6 months, we got between +10 and +800 new spots added per week. But the
                    database isn’t spots only. It’s also countless footages uploaded by skateboarders and specifically
                    attached to the spots. That’s how we know who ride where, landed what exactly and much more.
                    <br />
                    And if “a picture is worth a thousand words” imagine what pictures-in-motion is worth exactly. Enjoy
                    some footages uploaded into the app.
                </S.CallToAdventureBody>
                <VideoPlayer
                    style={{ marginBottom: '2rem' }}
                    url="https://www.youtube.com/watch?v=2O-aURqmDJY"
                    controls
                />
                <br />
                <S.CallTiAdventureBullet as="li">KrakBox</S.CallTiAdventureBullet>
                <S.CallToAdventureBody>
                    We launched mid-2015 the very first subscription box for skateboarders. For $39, people would
                    receive every 2 month a mistery package - full of skateboarding paraphernalia. Think components,
                    accessories, cultural stuff, apparel, electronics, art and more. In 2018, we were sending 2,000
                    boxes around the world: US, Canada, across 12 countries in Europe and in Australia.
                    <br />
                    Again, if “a picture is worth a thousand…”, okay jokes aside. Introducing KrakBox [again].
                </S.CallToAdventureBody>
                <VideoPlayer
                    style={{ marginBottom: '2rem' }}
                    url="https://www.youtube.com/watch?v=BvdDTThUzME"
                    controls
                />
                <br />
                <S.CallTiAdventureBullet as="li">KrakMag</S.CallTiAdventureBullet>
                <S.CallToAdventureBody>
                    We designed and wrote our own skate zine. We always included a printed version into every KrakBox
                    mix we shipped. The content itself revolved around the stuff in the mix, the brands and the people
                    behind the brands.
                    <br />
                    <br />
                    <S.CallTiAdventureImage src="/images/call-to-adventure/krakmag-preview.jpg" alt="krak mag" />
                    It’s funny because we always heard things like "kids nowadays don’t read. And worst, they’d never
                    read on papers." so we tried once: we didn’t print the zine and didn’t include it in a mix. We got
                    overwhelmed by messages everywhere asking us "where’s the zine?". We knew it 😎
                    <br />
                    <br />
                    Then later on, we{' '}
                    <a href="https://skatekrak.com/mag" target="_blank" rel="noopener noreferrer">
                        published online{' '}
                    </a>
                    some of the content. Especially some interviews in longer form; including more pictures and videos.
                    Here’s an example with{' '}
                    <a
                        href="https://skatekrak.com/mag/amrit-jain-skate-sauce"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Amrit Jain of Skate Sauce.
                    </a>
                    <br />
                    <br />
                </S.CallToAdventureBody>
                <S.CallTiAdventureBullet as="li">Krak History Clip and our Youtube channel</S.CallTiAdventureBullet>
                <S.CallToAdventureBody>
                    We opened{' '}
                    <a href="https://www.youtube.com/krakskate" target="_blank" rel="noopener noreferrer">
                        our channel{' '}
                    </a>
                    years ago. Our videos have been viewed more than one million times in total. We used it for many
                    things but our most popular series has always been our history clips. The idea is to dig into an
                    iconic spot history of NBDs.
                </S.CallToAdventureBody>
                <VideoPlayer
                    style={{ marginBottom: '2rem' }}
                    url="https://www.youtube.com/watch?v=InueCj-iQfY"
                    controls
                />
                <S.CallToAdventureBody>
                    We tried making video interviews once, thanks{' '}
                    <a href="https://hugobernatas.com" target="_blank" rel="noopener noreferrer">
                        Hugo
                    </a>
                    . That time when we welcomed Chris Chann, his brother and filmer in Lyon was quite special.
                </S.CallToAdventureBody>
                <VideoPlayer
                    style={{ marginBottom: '2rem' }}
                    url="https://www.youtube.com/watch?v=N7ufHikT4Os"
                    controls
                />
                <br />
                <S.CallTiAdventureBullet as="li">some collabs and our own merch</S.CallTiAdventureBullet>
                <S.CallToAdventureBody>
                    We’ve been extremely lucky to work with so many talented and passionate people. We can’t list them
                    all here but let’s randomly cherry-pick few examples.
                    <br />
                    <br />
                    As someone who grew up in Lyon and started skateboarding in 1999, Cliché always had a special place
                    in my heart. Interviewing{' '}
                    <a href="https://skatekrak.com/mag/daclin" target="_blank" rel="noopener noreferrer">
                        Jeremie, the founder{' '}
                    </a>{' '}
                    — and coming up with a special exclusive deck with them felt very special.
                    <br />
                    <br />
                    <S.CallTiAdventureImage
                        src="/images/call-to-adventure/KrakxCliche.png"
                        alt="krak x cliche skateboard deck"
                    />
                    Our very own{' '}
                    <a href="https://skatekrak.com/mag/the-krak-tee" target="_blank" rel="noopener noreferrer">
                        Krak Tee{' '}
                    </a>
                    was another proud moment.
                    <br />
                    <br />
                    We worked many times with the artist Lucas Beaufort. This{' '}
                    <a
                        href="https://skatekrak.com/mag/pindejo-lucas-beaufort-krak"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        exclusive pin with Pindejo{' '}
                    </a>
                    is one of kind. But more importantly, we proudly supported Lucas for his Devoted documentary on
                    skateboard media. We spent some time in Tampa, FL with him, we met few times around the world like
                    in LA, Berlin and Denver.
                </S.CallToAdventureBody>
                <VideoPlayer style={{ marginBottom: '2rem' }} url="https://vimeo.com/207691184" controls />
                <S.CallToAdventureBody>
                    We also published the one and only Devoted magazine. I still open it to this day to read few
                    interviews here and there.
                </S.CallToAdventureBody>
                <S.CallTiAdventureImage
                    src="/images/call-to-adventure/lucas-beaufort.png"
                    alt="presentaition Lucas Beaufort - French artist"
                />
                <S.CallToAdventureBody>
                    Anthony Pappalardo’s{' '}
                    <a href="https://anthonypappalardo.substack.com" target="_blank" rel="noopener noreferrer">
                        newsletter{' '}
                    </a>
                    - and writings in general - is one of the best. We’re still diligently reading every issue.
                    Partnering with him and his brand{' '}
                    <a
                        href="https://skatekrak.com/mag/anthony-pappalardo-adult-inc"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Adult, Inc. for an exclusive tee{' '}
                    </a>
                    was special.
                    <br />
                    <br />
                    The Yeah Girl capsule box is most probably one of our best work, ever.{' '}
                    <a href="https://skatekrak.com/mag/yeah-girl-krakbox" target="_blank" rel="noopener noreferrer">
                        Few words here{' '}
                    </a>
                    . Picture below.
                    <br />
                    <br />
                    <S.CallTiAdventureImage
                        src="/images/call-to-adventure/krak-yeah-girl.jpg"
                        alt="krak x cliche skateboard deck"
                    />
                    We always enjoyed teaming up with Getta Grip. Work-in-action.
                </S.CallToAdventureBody>
                <VideoPlayer
                    style={{ marginBottom: '2rem' }}
                    url="https://www.youtube.com/watch?v=NqYSTk1iBUI4"
                    controls
                />
                <br />
                <S.CallTiAdventureBullet as="li">some physical events and many sessions</S.CallTiAdventureBullet>
                <S.CallToAdventureBody>Remember the “a picture is worth a thousand words” 😎</S.CallToAdventureBody>
                <VideoPlayer
                    style={{ marginBottom: '2rem' }}
                    url="https://www.youtube.com/watch?v=_GNho4pIsx0"
                    controls
                />
                <S.CallToAdventureBody>
                    We also took part of the Nuits Sonores; an electro music festival happening every year in Lyon.
                </S.CallToAdventureBody>
                <VideoPlayer
                    style={{ marginBottom: '2rem' }}
                    url="https://www.youtube.com/watch?v=h-sMv-9zQj8"
                    controls
                />
                <S.CallToAdventureBody>We made few trips in the woods.</S.CallToAdventureBody>
                <VideoPlayer
                    style={{ marginBottom: '2rem' }}
                    url="https://www.youtube.com/watch?v=tNdIQMK-CZ8"
                    controls
                />
                <S.CallToAdventureBody>Or some event reports.</S.CallToAdventureBody>
                <VideoPlayer
                    style={{ marginBottom: '2rem' }}
                    url="https://www.youtube.com/watch?v=i8NhD70aLvA"
                    controls
                />
                <br />
                <S.CallTiAdventureBullet as="li">the Krak Session app</S.CallTiAdventureBullet>
                <S.CallToAdventureBody>
                    That app was very different than what we used to develop. You can think of it as a friendly
                    skateboarding journal. We heard many people express their need for a digital journal - literally -
                    to record their session, what they’ve landed, how they felt and much more.
                    <br />
                    <br />
                    It’s been very fun to make and truth be told, I think they’re still a hundreds nice features to add.
                    Like launching your THPS playlist when you start riding, automatically ping your crew when you reach
                    a specific spot etc.
                </S.CallToAdventureBody>
                <S.CallTiAdventureImage
                    src="/images/call-to-adventure/krak-session.jpg"
                    alt="krak session app screenshots"
                />
                <br />
                <br />
                <S.CallTiAdventureBullet as="li">the news & video feed</S.CallTiAdventureBullet>
                <S.CallToAdventureBody>
                    One day we were wondering which kind of digital tools we could add to the suite to empower
                    skateboarders or just enhance their own experience of the culture. Like too many times we landed on
                    Youtube and started watching few videos. And as always, we started complaining about the algorithm
                    and the overcrowded interface that just wants to make you stick in there forever. That’s when it
                    clicked. What about a feed of skateboarding video, introduced chronologically, and that’s it.
                    Nothing more. That’s how{' '}
                    <a href="https://skatekrak.com/video" target="_blank" rel="noopener noreferrer">
                        the video feed{' '}
                    </a>
                    was born. Including channels from Youtube & Vimeo.
                    <br />
                    <br />I always read many people amd media from skateboarding [hence Devoted felt special to us]. I’m
                    a heavy user of Feedly for more than 10 years; Google Reader before that [and before they just
                    killed it]. So offering a{' '}
                    <a href="https://skatekrak.com/news" target="_blank" rel="noopener noreferrer">
                        clean feed of skateboarding news{' '}
                    </a>
                    made total sense as well. Moreover, it was also a way to promote the voices and work of many
                    passionate folks. Again: no reco, just the titles and articles by order of release date. You can
                    select the media by language too.
                    <br />
                    <br />
                </S.CallToAdventureBody>
                <S.CallTiAdventureBullet as="li">the map on the web & the custom ones</S.CallTiAdventureBullet>
                <S.CallToAdventureBody>
                    While we’ve always been true fans of our phones as medium to both consume and create some
                    skateboarding content, we also enjoy the size and comfort of our laptops. That’s why we released the{' '}
                    <a href="https://skatekrak.com" target="_blank" rel="noopener noreferrer">
                        skatespots map on the web
                    </a>
                    ; and made it the homepage of our website.
                    <br />
                    <br />
                    And since we are heavy believers of the map as the perfect medium to explore skateboarding, we
                    started playing with what we call ‘custom maps’ — or specific theme-based maps. Here’s one of our
                    latest example:{' '}
                    <a href="https://skatekrak.com/?id=onespotpart" target="_blank" rel="noopener noreferrer">
                        spots worldwide that received their own dedicated video part
                    </a>
                    . Possibilities are endless with this tool.
                    <br />
                    <br />
                </S.CallToAdventureBody>
                <S.CallTiAdventureBullet as="li">the discord community</S.CallTiAdventureBullet>
                <S.CallToAdventureBody>
                    We’ve played with many tools over the years to keep a direct channel of communication with everyone.
                    At the end of the day, emails have been our best friends. For some obvious reasons, we also launched
                    some channels on the ‘usual suspects’ of social media.{' '}
                    <a href="https://www.instagram.com/skate_krak/" target="_blank" rel="noopener noreferrer">
                        Instagram
                    </a>
                    .{' '}
                    <a href="https://twitter.com/skatekrak" target="_blank" rel="noopener noreferrer">
                        Twitter
                    </a>
                    . Facebook page. Snapchat. Tiktok came later on but we resisted. The thing is we grew worried about
                    social media impact on everyone’s mental health and addiction at the same time. After all, the only
                    winner of this ‘rat race’ are the companies behind and their only one incentive is to show us always
                    more ads, and retain always more of our attention.{' '}
                    <a href="https://www.youtube.com/watch?v=uaaC57tcci0" target="_blank" rel="noopener noreferrer">
                        The Social Dilemma{' '}
                    </a>
                    is an interesting documentary in that regard but I digress.
                    <br />
                    At the end of the day we want to deliver value to people, not to platforms or companies.
                    <br />
                    <br />
                    We’re still dreaming of a space to welcome everyone, a safe environment where we all just feel to
                    hang out, discuss, learn, progress, explore, have fun. We want to nurture relationships, create
                    magic. And that’s why we launched our own space on Discord.{' '}
                    <a href="https://discord.gg/exMAqSuVfj" target="_blank" rel="noopener noreferrer">
                        You’re invited
                    </a>
                    . We’re a group of people who care for each other. And we share the same passion: skateboarding.
                </S.CallToAdventureBody>
            </div>
            <div id={ctaSections.VISION} data-spy>
                <S.CallToAdventureTitle component="heading5">where we’re heading to</S.CallToAdventureTitle>
                <S.CallToAdventureBody>
                    Back in 2019 we hit a wall. Energy speaking, we were exhausted. Then some of us became parents —
                    which is both at the same time a blessing and the most challenging mission ever — then COVID broke
                    out. So we felt the need to slow down, pause for a little while and recharge.
                    <br />
                    <br />
                    In 2020, we decided to embrace a 100% communal move. We’ve done everything for the love of the
                    culture and community so we started to wonder: what more could we do to definitely turn this journey
                    into a proper collective one? After all, our only 'raison d’etre' is to add value to the community,
                    not extracting some from it. So the main question became: what can we give to the skateboarding
                    community? and not: what can we get?
                    <br />I joined the{' '}
                    <a href="https://e2c.how" target="_blank" rel="noopener noreferrer">
                        E2C initiative{' '}
                    </a>
                    and their first peer learning cohort to dig into everything co-op related.
                    <br />
                    <br />
                    We’re still deep into that transition; which takes many forms:
                    <br />- open source the whole tech stack
                    <br />- converting the company itself [the legal structure] into a co-op
                    <br />- welcoming people to participate and own this thing altogether
                    <br />- practice collective ownership and governance
                    <br />
                    <br />
                    Yancey Strickler — a writer, co-founder of Kickstarter — published a piece recently that resonates a
                    lot with us:{' '}
                    <a
                        href="https://www.metalabel.xyz/magazine/features/how-culture-is-made"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        How culture is made
                    </a>
                    .
                    <br />
                    Its main takeaways are three observations about culture creation:
                </S.CallToAdventureBody>
                <S.CallTiAdventureQuote>
                    1) Culture isn't made overnight — it’s created over time and through dialogue.
                    <br />
                    2) Cultures and subcultures aren’t created through a single moment, they’re created through a
                    catalog of activity.
                    <br />
                    3) Cultural shifts are often outcomes of collective effort.
                </S.CallTiAdventureQuote>
                <S.CallToAdventureBody>He went on:</S.CallToAdventureBody>
                <S.CallTiAdventureQuote>
                    In the internet culture era our new institutions are still being formed, but what’s become clear is
                    that our primary challenge today is sifting through all the ideas, cultural norms, and potential
                    paths forward made possible by the web. This has made the curator (or the aggregator) an
                    increasingly powerful form. More and more these curators are using a new format to promote their
                    work: a form I call the culture label.
                    <br />
                    <br />
                    There are many kinds of labels: record labels, fashion labels, publishing houses, art galleries,
                    production companies, and so on.
                    <br />
                    <br />
                    To date, we’ve thought about the different kinds of labels as distinct from each other. Rarely do we
                    see a book publisher and a record label compared that deeply because their industries are so
                    different. But both are fundamentally doing the same thing.
                    <br />
                    <br />
                    A label looks out into the world with a specific point of view they’re looking to manifest through
                    projects they apply their resources to. If they’re a label that specializes in grizzly horror movies
                    or that releases specific microgenres of electronic music from certain regions, this is the lens
                    through which they see the world and ultimately the lens they’re inviting other people to see the
                    world through, too.
                    <br />
                    <br />
                    When we see the work of labels from this wider view, we get a better sense of what they’re doing:
                    they’re creating culture based on their lens, incrementally, with each release they make. By
                    bringing together the resources the projects in their worlds need (funding, collaborators,
                    materials, curatorial attention), labels help projects they’re culturally aligned with while putting
                    them in a context that creates more understanding for the work.
                    <br />
                    <br />
                    Culture labels reflect and project a desired reality onto the world.
                </S.CallTiAdventureQuote>
                <S.CallToAdventureBody>
                    Krak is evolving into a skateboarding metalabel. Skateboarders always wore a special kind of lens.
                    We don’t see the world around us like regular people. While they see sidewalks, handrails, stairs,
                    we see a playground.
                    <br />
                    <br />
                    Our next steps will be detailed on our{' '}
                    <a href="https://skatekrak.com/roadmap" target="_blank" rel="noopener noreferrer">
                        roadmap page
                    </a>
                    . Meanwhile, here’s the path forward:
                    <br />
                    <br />- welcoming our founding community. We’re in search of 1,000 members eager to co-author this
                    next chapter of skateboarding history. You should see a ‘Support’ button on the right side of this
                    page [otherwise, ‘Houston, we have a problem’] - for $50 a year, we will all make this project
                    durable and sustainable for life - and afterlife
                    <br />
                    <br />- finally removing gatekeepers and relying on our newly earned common treasury to co-create -
                    as a community - the longer-term roadmap
                    <br />
                    <br />- starting to practice collective decision making
                    <br />
                    <br />
                    We invite you to join and own Krak as a member owner 👉
                </S.CallToAdventureBody>
            </div>
            <div id={ctaSections.DAO} data-spy>
                <S.CallToAdventureTitle component="heading5">why a DAO + co-op</S.CallToAdventureTitle>
                <S.CallToAdventureBody>This is how folks from E2C explain their approach:</S.CallToAdventureBody>
                <S.CallTiAdventureQuote>
                    Most startups aim for an "exit” like getting acquired or going public, but these ownership
                    transitions often pit startup founders and investors against the health of their community. We're
                    enabling a new option, an Exit to Community — a path for startups to become owned and controlled by
                    users, workers, and stakeholders who value and depend on the startup. With E2C, the businesses
                    become a way to advance economic justice as a commons, not a commodity for investors to buy and
                    sell.
                </S.CallTiAdventureQuote>
                <S.CallToAdventureBody>
                    How not to genuinely aim for this when you read these lines? We are part of the community for more
                    than 20 years now [well, one current member could even claim 40 years haha]; we started building for
                    this community more than 8 years ago. I can tell you it is painful to see some people, brands,
                    tools, products, titles [you name it] just come and go for economic reasons. We’ve seen countless
                    companies being launched with grandiose mission statements — and a popular ‘for / by skateboarders’
                    to then be shut down or acquired by yet another big corp.
                    <br />
                    <br />
                    We’re also aligned with Ben Horowitz when he talked about joy and happiness:
                </S.CallToAdventureBody>
                <S.CallTiAdventureQuote>
                    In my experience there are really two things that lead to happiness and everything else is mostly
                    noise. The two things are contribution and abundance.
                    <br />
                    Contribution is basically exactly as it sounds. If you can align your life with where you have the
                    talent to make a large, meaningful, and real contribution to the world, your circle, or your family,
                    then you can be very happy.
                    <br />
                    <br />
                    An easy way to think of abundance is that it’s the anti-hater/anti-jealous mindset. If you believe
                    there is plenty in the world for everyone and you are always happy to see people who contribute
                    succeed, then you become part of “team contribution.” You don’t worry that someone is getting ahead
                    of you at work or that someone made a lot of money or that someone is better looking than you,
                    because you believe in abundance over scarcity and you can focus on maximizing your contribution. In
                    fact, their joy can become your joy (then you have an abundance of joy :-)). The good news is that
                    abundance is actually true. There is plenty in the world for everyone and once you see that, there
                    are so many ways to contribute.
                </S.CallTiAdventureQuote>
                <S.CallToAdventureBody>
                    We are definitely team contribution. We love the culture too much. Some things shouldn’t be built
                    and managed by a ‘startup’ or another classic company. So rather than being a corporation that
                    exists to maximize shareholder value, Krak becomes a cooperative owned by its members for the
                    benefit of the members and the whole community.
                    <br />
                    <br />
                    If you’re curious to know how we plan to organize Krak, the co-op, don’t look further than the{' '}
                    <a href="https://docs.ampled.com/coop/" target="_blank" rel="noopener noreferrer">
                        Ampled doc
                    </a>
                    . This is our playbook.
                    <br />
                    <br />
                    And to explicit right here what is a Co-op exactly:
                </S.CallToAdventureBody>
                <S.CallTiAdventureQuote>
                    A cooperative is a collectively owned enterprise that serves the interests of its members. This
                    means a company owned by its workers, customers, or both.
                    <br />
                    <br />
                    - Co-ops are for-profit, private enterprises. The primary distinction is that the shareholders in
                    co-ops are its workers or customers—not its investors and founders. This means that the company’s
                    profits are distributed back to its members, instead of to a singular owner or group of executives.
                    <br />
                    <br />
                    - Co-ops are controlled by their members. In addition to profit sharing, cooperative member-owners
                    are given a voice in business decisions.
                    <br />
                    <br />- Co-ops are a constructive alternative. Historically, co-ops have emerged when markets have
                    failed to meet the needs of a particular community, or to correct markets that have consolidated
                    into monopolies or monopsonies. When the government or private market fails to provide solutions,
                    collective actions are needed.
                    <br />
                    <br />
                    Co-ops are the answer when people organize and say, “If no one is going to build this for us, we’ll
                    build it for ourselves.”
                </S.CallTiAdventureQuote>
                <S.CallToAdventureBody>
                    You can think of DAOs as native internet-based co-ops, managed async, remotely and across the globe
                    [not necessarily though] and powered by code — with the use of smart contracts.
                    <br />
                    <br />
                    We like the efficiency of such a structure. We also plan to launch a token [our own currency; and
                    NFTs] that rewards everyone who’s participating. Imagine a local council around a specific spot made
                    of people who care about the place: they ride it of course but not only; they also document it
                    [photographers, filmers, writers…], clean it, re-build it, gather the community on it, enlive it,
                    paint it, cook for everyone — in other words — they magnify it.
                    <br />
                    <br />
                    We believe in that DAO + Co-op duo’s potential to restore trust and enable new kinds of governance
                    where the community collectively makes important decisions & benefits from the value created as a
                    whole.
                    <br />
                    <br />
                    If you’re curious to learn and dig more, here’s an hour discussion with Austin directly — Ampled
                    co-founder:
                    <br />
                    <br />
                    <iframe
                        src="https://open.spotify.com/embed/episode/0K39Ki1HICvY5XqMtGXr2k?utm_source=generator"
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                    ></iframe>
                </S.CallToAdventureBody>
            </div>
            <div id={ctaSections.FINAL} data-spy>
                <S.CallToAdventureTitle component="heading5">final words - world-building</S.CallToAdventureTitle>
                <S.CallToAdventureBody>
                    Krak is in the business of universe creation.
                    <br />
                    <br />I remember few years ago someone asking me why we added ‘Studio’ to the name of the company.
                    Back then we were living in Venice, CA and had just spent a whole day at Universal Studios. I
                    replied: “we’re on a mission to turn the world into a huge skatepark” so in an ideal scenario, the
                    company exists just as a space to empower people — skateboarders — to launch products for the
                    community; like a Hollywood studio works with directors on a specific movie [without being defined
                    only by this or that title].
                    <br />
                    <br />
                    Metalabels hadn’t been invented yet but that was typically it. As Yancey wrote:
                </S.CallToAdventureBody>
                <S.CallTiAdventureQuote>
                    Humans have always been involved in creating, affirming, or following cultural norms, knowingly or
                    not. What’s different about today is that it’s possible to not only be aware of what’s happening,
                    but to tip the cultural scales in one direction or another provided that, as the “
                    <a
                        href="https://www.metalabel.xyz/magazine/features/how-culture-is-made"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        How culture is made
                    </a>
                    ” piece theorizes, you're committed to doing it over time, with a catalog of work, and collaborating
                    alongside a group of people who see the world the same way.
                </S.CallTiAdventureQuote>
                <S.CallToAdventureBody>
                    Skateboarders care about the streets. They go out, explore, hack the original purpose of the urban
                    environment and make fun out of it. Outside is a playground for us.
                    <br />
                    <br />
                    Skateboarding is an expression of beauty, skateboarders open minds — of everyone, riders or not —
                    you could look at how people gather in crowd when they see a skater jumping on handrails; it is
                    amazing to watch this type of curiosity and energy.
                    <br />
                    <br />
                    It is a whole culture. It is a community. When we travel, the dream is to crash in another skater’s
                    place, getting to explore the city with the locals, eating / drinking where they have their habits.
                    <br />
                    <br />
                    Krak should become impossible to explain actually. We build a multilayered experience across the
                    skateboarding world, including offline-online bridges, visual, digital, and physical goods.
                    <br />
                    <br />
                    Krak is a community-owned and -ran experiential brand. We explore — collectively — at the
                    intersection of culture, art, history, style, web3, brands and businesses.
                    <br />
                    <br />
                    Krak is an incubator for community ideas. Krak creates a common good for the whole community, truly
                    owned by everyone. Let’s provide the foundational building blocks for the rest of the community to
                    play with, get their inspiration from, use, build on.
                    <br />
                    <br />
                    Now imagine if we succeed to:
                    <br />
                    <br />- provide a basic income to 1,000 people so they would live off skateboarding
                    <br />
                    <br />- own a network of parks and rooms across the world so members could always travel, ride and
                    crash for free
                    <br />
                    <br />
                    We play the long game and we’re thinking about Krak in a 100 years lifetime.
                </S.CallToAdventureBody>
                <S.CallTiAdventureImage
                    src="/images/call-to-adventure/zeb-weisman.jpeg"
                    alt="skateboarder trick over stairs"
                />
                <S.CallToAdventureImageLegend>Zeb Weisman- sw flip, Lisbon; photo © Ando</S.CallToAdventureImageLegend>
                <S.CallToAdventureBody>
                    <br />
                    This collage comes from Ando and features in{' '}
                    <a href="https://pushperiodical.com" target="_blank" rel="noopener noreferrer">
                        PP19
                    </a>
                    ’s extended FOTO section.
                </S.CallToAdventureBody>
            </div>
        </>
    );
};

export default CallToAdventureContent;
