import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        scaleAndFadeIn: 'scale-and-fade-in 150ms cubic-bezier(.25, .75, .6, .98)',
        scaleAndFadeOut: 'scale-and-fade-out 75ms ease-out',
        slideUp: 'slide-up 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        slideDown: 'slide-down 300ms cubic-bezier(0.87, 0, 0.13, 1)',
      },
      colors: ({ colors }) => ({
        grayCaption: '#828282',
        graySubtitle: '#575757',
        grayDefault: '#EFEFF0',
        graySubtle: '#F7F7F9',
        base: {
          gray: '#2D2D2D',
          black: '#121212',
          blue: '#01B0C5',
          white: '#fafafa',
          bodyDark: '#474747s',
        },
        orange: {
          default: '#FB8417',
          50: '#FDF4EC',
          100: '#FBE9DA',
          600: '#E67731',
        },
        turquoise: {
          50: '#EBFAFD',
          100: '#D7F4FB',
          500: '#11CDEF',
        },
        lemonGreen: {
          500: '#8EF846',
          600: '#90F24C',
          700: '#66C227',
        },
        purple: {
          100: '#E6DFF5',
          500: '#8A62D8',
        },
      }),
      transitionDuration: {
        DEFAULT: '75ms',
      },
      boxShadow: {
        md: '0 2px 4px rgba(0, 0, 0, 0.2)',
      },
      fontFamily: {
        aeonik: ['var(--font-aeonik)'],
      },
      lineHeight: {
        '1.2': '1.2',
        '1.3': '1.33',
      },
    },
  },
  plugins: [],
};
export default config;
