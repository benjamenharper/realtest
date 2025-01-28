/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // JavaScript and TypeScript files
    "./public/index.html", // HTML files
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#1a1a1a',
            a: {
              color: '#2563eb',
              '&:hover': {
                color: '#1d4ed8',
              },
            },
            h1: {
              color: '#1a1a1a',
              fontWeight: '700',
            },
            h2: {
              color: '#1a1a1a',
              fontWeight: '600',
            },
            h3: {
              color: '#1a1a1a',
              fontWeight: '600',
            },
            h4: {
              color: '#1a1a1a',
              fontWeight: '600',
            },
            img: {
              borderRadius: '0.5rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              color: '#1a1a1a',
              backgroundColor: '#f3f4f6',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
