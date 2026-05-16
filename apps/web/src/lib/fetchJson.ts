type QueryParamValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryParamValue | QueryParamValue[]>;

const appendQueryParam = (searchParams: URLSearchParams, key: string, value: QueryParamValue | QueryParamValue[]) => {
    if (Array.isArray(value)) {
        value.forEach((item) => appendQueryParam(searchParams, `${key}[]`, item));
        return;
    }

    if (value != null) {
        searchParams.append(key, String(value));
    }
};

const withQueryParams = (url: string, params?: QueryParams) => {
    if (!params) {
        return url;
    }

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => appendQueryParam(searchParams, key, value));

    const queryString = searchParams.toString();

    if (!queryString) {
        return url;
    }

    return `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
};

export const fetchJson = async <T>(url: string, params?: QueryParams): Promise<T> => {
    const response = await fetch(withQueryParams(url, params));

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
};
