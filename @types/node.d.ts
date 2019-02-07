declare module NodeJS {
    interface Process {
        browser: boolean | undefined;
    }

    interface Global {
        fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
    }
}
