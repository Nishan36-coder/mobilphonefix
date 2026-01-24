import React from 'react';

export const USFlag = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="32" fill="#eeeeee" />
        <clipPath id="circleClip">
            <circle cx="32" cy="32" r="32" />
        </clipPath>
        <g clipPath="url(#circleClip)">
            <path fill="#B22234" d="M0 0h64v64H0z" />
            <path fill="#fff" d="M0 6.4h64v6.4H0zM0 19.2h64v6.4H0zM0 32h64v6.4H0zM0 44.8h64v6.4H0zM0 57.6h64v6.4H0z" />
            <path fill="#3C3B6E" d="M0 0h32v34H0z" />
            {/* Simplified stars as dots for small icon size */}
            <circle cx="4" cy="4" r="1.5" fill="#fff" /> <circle cx="10" cy="4" r="1.5" fill="#fff" /> <circle cx="16" cy="4" r="1.5" fill="#fff" /> <circle cx="22" cy="4" r="1.5" fill="#fff" /> <circle cx="28" cy="4" r="1.5" fill="#fff" />
            <circle cx="7" cy="9" r="1.5" fill="#fff" /> <circle cx="13" cy="9" r="1.5" fill="#fff" /> <circle cx="19" cy="9" r="1.5" fill="#fff" /> <circle cx="25" cy="9" r="1.5" fill="#fff" />
            <circle cx="4" cy="14" r="1.5" fill="#fff" /> <circle cx="10" cy="14" r="1.5" fill="#fff" /> <circle cx="16" cy="14" r="1.5" fill="#fff" /> <circle cx="22" cy="14" r="1.5" fill="#fff" /> <circle cx="28" cy="14" r="1.5" fill="#fff" />
            <circle cx="7" cy="19" r="1.5" fill="#fff" /> <circle cx="13" cy="19" r="1.5" fill="#fff" /> <circle cx="19" cy="19" r="1.5" fill="#fff" /> <circle cx="25" cy="19" r="1.5" fill="#fff" />
            <circle cx="4" cy="24" r="1.5" fill="#fff" /> <circle cx="10" cy="24" r="1.5" fill="#fff" /> <circle cx="16" cy="24" r="1.5" fill="#fff" /> <circle cx="22" cy="24" r="1.5" fill="#fff" /> <circle cx="28" cy="24" r="1.5" fill="#fff" />
        </g>
    </svg>
);

export const SpainFlag = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="32" fill="#eeeeee" />
        <clipPath id="esCircleClip">
            <circle cx="32" cy="32" r="32" />
        </clipPath>
        <g clipPath="url(#esCircleClip)">
            <path fill="#AA151B" d="M0 0h64v64H0z" />
            <path fill="#F1BF00" d="M0 16h64v32H0z" />
            {/* Simplified coat of arms */}
            <path fill="#AA151B" d="M12 24h10v16H12z" />
        </g>
    </svg>
);
