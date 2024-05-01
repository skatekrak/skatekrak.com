import React from 'react';

type Props = {
    className?: string;
};

const IconFacebook: React.FC<Props> = ({ className }) => (
    <svg height="24" width="24" viewBox="0 0 24 24" className={`icon ${className}`}>
        <path
            d="M16.4501 13.2498L16.9821 9.78106H13.654V7.53006C13.654 6.58107 14.1189 5.65606 15.6096 5.65606H17.1227V2.70294C17.1227 2.70294 15.7495 2.46856 14.4366 2.46856C11.6955 2.46856 9.90399 4.12981 9.90399 7.13731V9.78106H6.85712V13.2498H9.90399V21.6353C10.5149 21.7311 11.1411 21.7811 11.779 21.7811C12.4169 21.7811 13.043 21.7311 13.654 21.6353V13.2498H16.4501Z"
            fill="white"
        />
    </svg>
);

export default IconFacebook;
