import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        sm: '385px',
      },
      animation: {
        scaleAndFadeIn: 'scale-and-fade-in 150ms cubic-bezier(.25, .75, .6, .98)',
        scaleAndFadeOut: 'scale-and-fade-out 75ms ease-out',
        slideUp: 'slide-up  300ms cubic-bezier(0.87, 0, 0.13, 1)',
        slideDown: 'slide-down 300ms cubic-bezier(0.87, 0, 0.13, 1)',
      },
      colors: {
        white: '#FFFFFF',
        black: {
          100: '',
          800: '#2D2D2D',
          900: '#121212',
          970: '#070D04',
          950: '#000000',
        },
        gray: {
          50: '#FAFAFA',
          100: '#F7F7F9',
          200: '#EFEFF0',
          300: '#707170',
          400: '#828282',
          500: '#645D72',
          600: '#575757',
          700: '#474747',
        },
        green: {
          600: '#006D00',
        },

        lemonGreen: {
          50: '#E8FCD8',
          100: '#E1FEC9',
          200: '#E1F6D6',
          300: '#ECF7E2',
          400: '#78EF2C',
          500: '#8EF846',
          600: '#66C227',
          800: '#2B660E',
          900: '#33810A',
          950: '#103003',
        },

        success: {
          500: '#219653',
          900: '#089E05',
        },
        red: { 100: '#FEE7E3', 200: '#FBEDEF', 500: '#F5365C', 600: '#D2303E' },
        orange: { 100: '#F9DFD8', 600: '#E24526' },
        purple: { 100: '#D9D9FA', 600: '#7774ED' },
      },
      fontSize: {
        // sm: [
        //   '14px',
        //   {
        //     lineHeight: '22px',
        //   },
        // ],
      },
      transitionDuration: {
        DEFAULT: '75ms',
      },
      boxShadow: {
        md: '0 2px 4px rgba(0, 0, 0, 0.2)',
      },
      fontFamily: {
        aeonik: ['var(--font-aeonik)'],
      },
      backgroundImage: {
        'app-gradient': 'linear-gradient(20.37deg, #66C227 15.2%, #2A860A 74.4%);',
        'onboarding-overlay':
          'linear-gradient(180deg, rgba(18, 18, 18, 0) 50%, rgba(15, 45, 0, 0.43) 179.64%)',
        'header-gradient':
          'radial-gradient(316.4% 252.92% at 50% 263.33%, #C3FD99 20%, #FFFFFF 100%)',
        'planned-vs-actual': 'linear-gradient(180deg, #7544D4 -6.35%, #C09FFF 140.43%)',
        'top-expenses': 'linear-gradient(180deg, #8D2A7B 0%, #D877C6 100%)',
        'top-expenses-border':
          'linear-gradient(180deg, rgba(255, 168, 239, 0.24) 0%, rgba(216, 129, 200, 0.46) 100%)',
        'top-expenses-bar1': 'linear-gradient(180deg, #7AD3FF 0%, #4FBAF0 100%)',
        'top-expenses-bar2': 'linear-gradient(180deg, #FF9364 0%, #F25F33 100%)',
        'top-expenses-bar3': 'linear-gradient(180deg, #FFD572 0%, #FEBD38 100%)',
        'best-performing': 'linear-gradient(20.37deg, #66C227 15.2%, #2A860A 74.4%)',
        'worst-performing': 'linear-gradient(180deg, #1850A8 0%, #4780DB 100%)',
        subscription: 'linear-gradient(180deg, #727A25 0%, #A2AE2A 100%)',
        'spedning-trends': 'linear-gradient(180deg, #00BFE2 0%, #0BABC6 100%)',
        'income-breakdown': 'linear-gradient(180deg, #D2303E 0%, #6C1920 100%)',
        'expenses-breakdown': 'linear-gradient(180deg, #5856D6 0%, #5856D6 100%)',
        'profile-stats': 'linear-gradient(360deg, #66C227 -34.78%, #2A860A 100%)',
        'subscription-bg': 'url("/images/bg/subscription.png")',
        'rewards-bg': 'url("/images/bg/rewards.png")',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;
