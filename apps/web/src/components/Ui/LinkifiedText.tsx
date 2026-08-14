const linkPattern = /((?:https?:\/\/|www\.)[^\s<>"']*[^\s<>"'.,!?;:)\]}])/gi;

const LinkifiedText = ({ children }: { children: string }) =>
    children.split(linkPattern).map((part, index) =>
        index % 2 === 1 ? (
            <a
                className="underline hover:text-onDark-highEmphasis"
                href={part.toLowerCase().startsWith('www.') ? `https://${part}` : part}
                key={`${part}-${index}`}
                rel="noopener noreferrer"
                target="_blank"
            >
                {part}
            </a>
        ) : (
            part
        ),
    );

export default LinkifiedText;
