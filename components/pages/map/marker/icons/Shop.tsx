import React from 'react';

const ShopIcon = () => (
    <svg className="map-icon map-icon-shop" viewBox="0 0 48 48">
        <path
            className="map-icon-stroke-outter"
            d="M28,5.9H20.71a2,2,0,0,0-2,2V9.65a10,10,0,0,0-6.24,8.87A8.76,8.76,0,0,0,16,25.78l-3.25.89a2,2,0,0,0-1.36,2.58l.28.82a13,13,0,0,0,7,8.06V39.9a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V38.2a9.9,9.9,0,0,0,6.34-9.29,9.26,9.26,0,0,0-4.21-7.7l2.74-.76A2,2,0,0,0,36.21,18L36,17.17a12,12,0,0,0-6-7.26v-2a2,2,0,0,0-2-2Z"
        />
        <path
            className="map-icon-shop-fill"
            d="M28,39.9H20.71V36.74a10.89,10.89,0,0,1-7.14-7.33l-.28-.82,7-1.9.24.71a4.34,4.34,0,0,0,4,3.12c1.37,0,2.18-.5,2.18-1.33s-1.32-1.43-3.65-2.26c-.62-.22-1.29-.45-2-.72-2.31-.9-6.61-2.58-6.61-7.69,0-3.33,2.54-6.34,6.24-7.49V7.9H28v3.3a10,10,0,0,1,6.1,6.53l.23.79-7,1.95-.21-.78a3.37,3.37,0,0,0-3.32-2.55c-1.22,0-1.88.53-1.88,1,0,.8,1.64,1.38,3.54,2.06l1.18.43c3.31,1.24,7.7,3.44,7.7,8.25,0,3.77-2.41,6.74-6.34,7.88Z"
        />
        <path
            className="map-icon-stroke-inner"
            d="M27,8.9v2.3a1,1,0,0,0,.64.93A9,9,0,0,1,33,17.83L28,19.24a4.34,4.34,0,0,0-4.23-3.09c-1.89,0-2.88,1-2.88,2,0,1.5,1.85,2.16,4.21,3l1.15.42c3.28,1.23,7.05,3.17,7.05,7.31,0,3.32-2.1,5.9-5.62,6.92a1,1,0,0,0-.72,1V38.9H21.71V36.74a1,1,0,0,0-.71-1,9.9,9.9,0,0,1-6.42-6.51l5-1.37a5.29,5.29,0,0,0,4.93,3.61c2.35,0,3.18-1.26,3.18-2.33,0-1.68-1.81-2.32-4.32-3.2-.59-.21-1.26-.44-1.95-.71-2.23-.87-6-2.33-6-6.76C15.48,15.64,17.7,13,21,12a1,1,0,0,0,.7-1V8.9H27m1-1H20.71V11c-3.7,1.15-6.24,4.16-6.24,7.49,0,5.11,4.3,6.79,6.61,7.69.69.27,1.36.5,2,.72,2.33.82,3.65,1.33,3.65,2.26s-.82,1.33-2.18,1.33a4.34,4.34,0,0,1-4-3.12l-.24-.71-7,1.9.28.82a10.89,10.89,0,0,0,7.14,7.33V39.9H28V36.79c3.93-1.13,6.34-4.11,6.34-7.88,0-4.81-4.39-7-7.7-8.25l-1.18-.43c-1.9-.68-3.54-1.27-3.54-2.06,0-.5.66-1,1.88-1a3.37,3.37,0,0,1,3.32,2.55l.21.78,7-1.95-.23-.79A10,10,0,0,0,28,11.2V7.9Z"
        />
    </svg>
);

export default React.memo(ShopIcon);
