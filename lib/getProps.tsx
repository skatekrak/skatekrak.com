const createPropsGetter = <DP extends object>(defaultProps: DP) => {
    return <P extends Partial<DP>>(props: P) => {
        type PropsExcludingDefaults = Pick<P, Exclude<keyof P, keyof DP>>;
        type RecomposedProps = DP & PropsExcludingDefaults;
        return (Object.assign(Object.assign({}, defaultProps), props) as any) as RecomposedProps;
    };
};

export default createPropsGetter;
