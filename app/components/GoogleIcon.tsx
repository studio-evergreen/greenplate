import { memo } from 'react';

interface GoogleIconProps {
  size?: number;
  className?: string;
}

const GoogleIcon = memo(function GoogleIcon({ size = 20, className }: GoogleIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_17_40)">
        <path d="M47.532 24.552c0-1.636-.146-3.272-.438-4.908H24.48v9.292h13.02c-.563 2.98-2.25 5.48-4.792 7.188v5.98h7.74c4.54-4.188 7.084-10.376 7.084-17.552z" fill="#4285F4"/>
        <path d="M24.48 48c6.48 0 11.924-2.124 15.896-5.792l-7.74-5.98c-2.146 1.48-4.896 2.354-8.156 2.354-6.27 0-11.584-4.188-13.5-9.812H2.48v6.188C6.542 43.292 14.542 48 24.48 48z" fill="#34A853"/>
        <path d="M10.98 28.77A14.77 14.77 0 0 1 8.48 24c0-1.646.292-3.23.792-4.77v-6.188H2.48A23.98 23.98 0 0 0 .48 24c0 3.98.938 7.75 2.5 11.188l7.998-6.418z" fill="#FBBC05"/>
        <path d="M24.48 9.542c3.542 0 6.708 1.208 9.208 3.584l6.896-6.896C36.398 2.124 30.958 0 24.48 0 14.542 0 6.542 4.708 2.48 12.02l7.998 6.208c1.916-5.624 7.23-9.812 13.502-9.812z" fill="#EA4335"/>
      </g>
      <defs>
        <clipPath id="clip0_17_40">
          <path fill="#fff" d="M0 0h48v48H0z"/>
        </clipPath>
      </defs>
    </svg>
  );
});

export default GoogleIcon;