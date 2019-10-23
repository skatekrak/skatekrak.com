import axios from 'axios';
import getConfig from 'next/config';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Types from 'Types';

import { savePricingCurrency } from 'store/payment/actions';

export interface IPData {
    ip: string;
    is_eu: boolean;
    city: string;
    region: string;
    region_code: string;
    country_name: string;
    country_code: string;
    continent_name: string;
    continent_code: string;
    latitude: number;
    longitude: number;
    postal: string;
    calling_code: string;
    flag: string;
    emoji_flag: string;
    emoji_unicode: string;
    asn: {
        asn: string;
        name: string;
        domain: string;
        route: string;
        type: string;
    };
    carrier: {
        name: string;
        mcc: string;
        mnc: string;
    };
    languages: {
        name: string;
        native: string;
    }[];
    currency: {
        name: string;
        code: string;
        symbol: string;
        native: string;
        plural: string;
    };
    time_zone: {
        name: string;
        abbr: string;
        offset: string;
        is_dst: boolean;
        current_time: string;
    };
    threat: {
        is_tor: boolean;
        is_proxy: boolean;
        is_anonymous: boolean;
        is_known_attacker: boolean;
        is_known_abuser: boolean;
        is_threat: boolean;
        is_bogon: boolean;
    };
    count: number;
}

/**
 * Hook that fetch IP Data and fill the redux store
 * @returns the content of the store
 */
export default function usePayment() {
    const [fetchedData, setFetchData] = useState(false);
    const dispatch = useDispatch();
    const payment = useSelector((state: Types.RootState) => state.payment);

    useEffect(() => {
        // If not in dev, we query ipdata.co to get country based on IP
        // and show currency accordingly
        if (!fetchedData && getConfig().publicRuntimeConfig.NODE_ENV !== 'development') {
            axios('https://api.ipdata.co/?api-key=4a4e1261ab0b0b8288f5ffef913072c177a0262cf1945fb399a0b712').then(
                result => {
                    if (result.data && result.data.country_code) {
                        if (result.data.country_code === 'US') {
                            dispatch(savePricingCurrency(9900, 'usd'));
                        } else if (result.data.country_code === 'GB') {
                            dispatch(savePricingCurrency(9900, 'gbp'));
                        }
                    }
                    setFetchData(true);
                },
            );
        }
    }, []); // We give it a empty array of data, so it's only trigger at component first render

    return payment;
}
