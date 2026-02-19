import React from 'react';
import Typography from '@/components/Ui/typography/Typography';

const CallToAdventureCTA = () => {
    return (
        <div className="relative order-1 flex flex-col mt-16 items-end">
            <a
                className="fixed top-16 left-0 right-0 py-1 px-6 text-center text-onLight-highEmphasis bg-[#ffdc73] cursor-pointer laptop-s:static laptop-s:top-auto laptop-s:left-auto laptop-s:right-auto laptop-s:py-2 laptop-s:px-6 laptop-s:bg-onDark-highEmphasis laptop-s:rounded laptop-s:[&_.ui-Typography]:text-base laptop-s:after:content-[''] laptop-s:after:absolute laptop-s:after:top-2 laptop-s:after:left-2 laptop-s:after:w-full laptop-s:after:h-full laptop-s:after:border laptop-s:after:border-onDark-mediumEmphasis laptop-s:after:rounded laptop-s:after:transition-all laptop-s:after:duration-100 laptop-s:after:ease-in-out laptop-s:hover:after:top-0 laptop-s:hover:after:left-0"
                href="https://opencollective.com/opensb/projects/krakmap"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Typography component="button">
                    Support Krak
                    <br />
                    Become a member
                </Typography>
            </a>
        </div>
    );
};

export default CallToAdventureCTA;
