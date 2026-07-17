const urlPattern = /(https?:\/\/[^\s]+)/g;

const MediaCaption = ({ caption }: { caption: string }) =>
    caption.split(urlPattern).map((part, index) =>
        part.startsWith('http://') || part.startsWith('https://') ? (
            <a
                key={index}
                className="underline hover:text-onDark-highEmphasis"
                href={part}
                target="_blank"
                rel="noopener noreferrer"
            >
                {part}
            </a>
        ) : (
            part
        ),
    );

export default MediaCaption;
