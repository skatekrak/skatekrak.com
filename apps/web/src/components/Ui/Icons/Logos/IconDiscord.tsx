import React from 'react';

type Props = {
    className?: string;
};

const IconDiscord: React.FC<Props> = ({ className }) => (
    <svg height="24" width="24" viewBox="0 0 24 24" className={`icon ${className}`}>
        <path
            d="M19.6361 5.20032C18.212 4.53402 16.6893 4.04978 15.0973 3.77405C14.9018 4.12752 14.6734 4.60296 14.5159 4.98116C12.8236 4.72666 11.1469 4.72666 9.48573 4.98116C9.32828 4.60296 9.09467 4.12752 8.89741 3.77405C7.30374 4.04978 5.77928 4.5358 4.35518 5.20385C1.48276 9.54445 0.70409 13.7772 1.09342 17.9499C2.99856 19.3726 4.84487 20.2369 6.66003 20.8024C7.1082 20.1856 7.50791 19.5299 7.85224 18.8389C7.19644 18.5897 6.56832 18.2822 5.97482 17.9252C6.13227 17.8086 6.28628 17.6866 6.43508 17.5611C10.055 19.2542 13.9882 19.2542 17.5648 17.5611C17.7154 17.6866 17.8694 17.8086 18.0251 17.9252C17.4299 18.284 16.8 18.5915 16.1442 18.8407C16.4885 19.5299 16.8865 20.1874 17.3364 20.8042C19.1533 20.2386 21.0014 19.3744 22.9065 17.9499C23.3633 13.1127 22.1261 8.9188 19.6361 5.20032ZM8.34541 15.3838C7.25874 15.3838 6.36759 14.3693 6.36759 13.1339C6.36759 11.8985 7.23972 10.8823 8.34541 10.8823C9.45114 10.8823 10.3423 11.8968 10.3232 13.1339C10.325 14.3693 9.45114 15.3838 8.34541 15.3838ZM15.6545 15.3838C14.5678 15.3838 13.6767 14.3693 13.6767 13.1339C13.6767 11.8985 14.5488 10.8823 15.6545 10.8823C16.7602 10.8823 17.6514 11.8968 17.6323 13.1339C17.6323 14.3693 16.7602 15.3838 15.6545 15.3838Z"
            fill="white"
        />
    </svg>
);

export default IconDiscord;