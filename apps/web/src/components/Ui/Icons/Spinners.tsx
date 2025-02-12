/* Author
https://codepen.io/supah/pen/BjYLdW
*/
import classNames from 'classnames';
import React from 'react';

export const SpinnerCircle = ({ className }: { className?: string }) => (
    <svg className={classNames('spinner-circle', className)} viewBox="0 0 50 50" data-author="supahfunk">
        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
    </svg>
);

export const KrakLoading = ({ className }: { className?: string }) => (
    <svg className={classNames('icon-loading-krak', className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
        <title>loading</title>
        <g>
            <g className="icon-loading-krak-text">
                <path d="M22.4,56.92,20.93,50.2l3-.65,2.32,10.58-16,3.51-.85-3.86Z" />
                <path d="M22.53,30.29A9.66,9.66,0,0,1,26,32.85a6.57,6.57,0,0,1,1.55,3.48,7,7,0,0,1-.63,3.81,7.14,7.14,0,0,1-2.41,3A6.56,6.56,0,0,1,21,44.29a9.37,9.37,0,0,1-4.13-.83L16,43.08a9.71,9.71,0,0,1-3.51-2.56A6.56,6.56,0,0,1,11,37,7.5,7.5,0,0,1,14,30.23a6.68,6.68,0,0,1,3.62-1.15,9.44,9.44,0,0,1,4.2.89Zm-2.28,3.38a6.9,6.9,0,0,0-3.72-.79,2.62,2.62,0,0,0-2.12,1.61q-1.23,2.71,2.76,4.7l1.09.51a7.09,7.09,0,0,0,3.7.8,2.62,2.62,0,0,0,2.16-1.63,2.58,2.58,0,0,0-.21-2.63,6.89,6.89,0,0,0-3-2.26Z" />
                <path d="M39.85,24.12l-4.92,2.26.42,3.18-3.83,1.76-1.39-17.4,3.37-1.55L45.85,24.73,42,26.5Zm-5.33-.9,3.2-1.47-4-4.43Z" />
                <path d="M49.4,25,53.85,9.27l5.08,1.43a7.77,7.77,0,0,1,3.49,2,6.93,6.93,0,0,1,1.85,3.41,8.4,8.4,0,0,1-.15,4.14l-.21.73a8.45,8.45,0,0,1-2,3.63,7,7,0,0,1-3.34,2,7.6,7.6,0,0,1-4-.07Zm7.43-11.76L54,23.19l1.32.37a3.07,3.07,0,0,0,2.84-.46A5.92,5.92,0,0,0,60,19.9l.19-.68a5.88,5.88,0,0,0,.1-3.69,3.13,3.13,0,0,0-2.23-1.88Z" />
                <path d="M67.93,35.08l-2.67-2.9,12.05-11.1L80,24Z" />
                <path d="M73.79,52.64l-.66-3.87,9.08-7.44L72.16,43l-.66-3.89L87.65,36.4l.66,3.89-9.08,7.43L89.29,46l.66,3.88Z" />
                <path d="M67.44,69.68a6.34,6.34,0,0,1,0-3.13A11.48,11.48,0,0,1,69,63a6.87,6.87,0,0,1,4.4-3.32,8,8,0,0,1,5.74,1.16l1.21.74a9.77,9.77,0,0,1,3.13,3,6.35,6.35,0,0,1,1.06,3.55A6.93,6.93,0,0,1,83.4,71.7,7.26,7.26,0,0,1,79.69,75a5.93,5.93,0,0,1-4.59-.54l2-3.23a3.11,3.11,0,0,0,2.13.29,2.84,2.84,0,0,0,1.51-1.31,2.58,2.58,0,0,0,.15-2.62A6.73,6.73,0,0,0,78.28,65l-.84-.53a6.59,6.59,0,0,0-3.57-1.24,3,3,0,0,0-2.44,1.59,3.31,3.31,0,0,0-.63,2.31l2.16,1.35,1.46-2.33,2.3,1.44-3.55,5.68Z" />
                <path d="M56.24,76.91a2.15,2.15,0,0,1-1.58-.12,1.87,1.87,0,0,1-.72-2.64,2.16,2.16,0,0,1,1.3-.91,2.14,2.14,0,0,1,1.59.13A1.86,1.86,0,0,1,57.55,76,2.13,2.13,0,0,1,56.24,76.91Z" />
                <path d="M44.91,77.65a2.16,2.16,0,0,1-1.41-.74,1.86,1.86,0,0,1,.39-2.71,2.36,2.36,0,0,1,3,.43,1.87,1.87,0,0,1-.38,2.7A2.14,2.14,0,0,1,44.91,77.65Z" />
                <path d="M34.2,73.8a2.16,2.16,0,0,1-1-1.24,1.86,1.86,0,0,1,1.44-2.33,2.36,2.36,0,0,1,2.55,1.58,1.86,1.86,0,0,1-1.43,2.32A2.14,2.14,0,0,1,34.2,73.8Z" />
            </g>
            <path
                className="icon-loading-krak-logo"
                d="M55.89,47.78v-.1a7.1,7.1,0,0,0-14.2,0v.1h0V52h4.64l-4.64,3.19h0v4.34l.3-.2,6.74-4.51h.08l6.79,4.51.3.2V55.14L51.2,52h4.69V47.78Z"
            />
        </g>
    </svg>
);
