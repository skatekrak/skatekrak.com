import React from 'react';

import Typography from '@/components/Ui/typography/Typography';

const AuthProjectDescription = () => {
    return (
        <div className="p-8 max-w-[40rem] tablet:text-center laptop-s:p-12 laptop-s:text-left laptop:px-16 laptop:py-12">
            <Typography as="h1" component="condensedHeading4">
                The first skateboarding
                <br />
                DAO x Co-op
            </Typography>
            <Typography className="my-6 mb-10 text-onDark-mediumEmphasis" component="heading6">
                Let's make sure skateboarding keeps its roots deep in creativity, openness, rebellion & freedom.
            </Typography>
            <div className="[&_.ui-Typography]:mb-4 [&_.ui-Typography:last-child]:mb-0">
                <Typography>
                    Our mission is to make more skateboarding happen in this world. We build knowledge, ressources and
                    tools for skateboarders, to inspire creative collaboration, cooperation and mutual support within
                    the community.
                </Typography>
                <Typography>Think an open, decentralized, collective Wikipedia focus on skateboarding.</Typography>
                <Typography>And 100% owned by skateboarders.</Typography>
            </div>
        </div>
    );
};

export default AuthProjectDescription;
