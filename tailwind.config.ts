import type { Config } from 'tailwindcss';
import { TopographyPath } from './public/svg/topography-path';
import { withUt } from 'uploadthing/tw';
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette');
const svgToDataUri = require('mini-svg-data-uri');

const config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        dark: 'hsl(200,100%,5%)',
        light: 'hsl(100,100%,100%)',
        orange: 'hsl(1,97%,61%)',
        turquoise: 'hsl(182,63%,45%)',
        'off-white': '#f7f8f8',
        'transparent-white': 'rgba(255, 255, 255, 0.08)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        page: 'hsl(var(--page))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        sidebar: 'hsl(var(--sidebar))',
        thumb: 'hsl(var(--thumb))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        pending: {
          DEFAULT: 'hsl(var(--pending))',
          foreground: 'hsl(var(--pending-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'glow-lines': 'linear-gradient(var(--direction),#9d9bf2 0.43%,#7877c6 14.11%,rgba(120,119,198,0) 62.95%)',
        'radial-faded': 'radial-gradient(circle at bottom center,var(--color),transparent 70%)',
        'hero-glow':
          'conic-gradient(from 230.29deg at 51.63% 52.16%, rgb(0, 183, 255) 0deg, rgb(0, 135, 255) 67.5deg, rgb(39, 116, 157) 198.75deg, rgb(27, 157, 169) 251.25deg, rgb(54, 103, 196) 301.88deg, rgb(105, 30, 255) 360deg)',
      },
      keyframes: {
        ripple: {
          '0%, 100%': {
            transform: 'translate(-50%, -50%) scale(1)',
          },
          '50%': {
            transform: 'translate(-50%, -50%) scale(0.9)',
          },
        },
        'fade-in': {
          from: {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          to: {
            opacity: '1',
            transform: 'none',
          },
        },
        'image-rotate': {
          '0%': {
            transform: 'rotateX(25deg)',
          },
          '25%': {
            transform: 'rotateX(25deg) scale(0.9)',
          },
          '60%': {
            transform: 'none',
          },
          '100%': {
            transform: 'none',
          },
        },
        'image-glow': {
          '0%': {
            opacity: '0',
            'animation-timing-function': 'cubic-bezier(0.74,0.25,0.76,1)',
          },
          '10%': {
            opacity: '1',
            'animation-timing-function': 'cubic-bezier(0.12,0.01,0.08,0.99)',
          },
          '100%': {
            opacity: '0.4',
          },
        },
        'sketch-lines': {
          '0%': {
            'stroke-dashoffset': '1',
          },
          '50%': {
            'stroke-dashoffset': '0',
          },
          '99%': {
            'stroke-dashoffset': '0',
          },
          '100%': {
            visiblity: 'hidden',
          },
        },
        'border-beam': {
          '100%': {
            'offset-distance': '100%',
          },
        },
        'glow-line-horizontal': {
          '0%': {
            opacity: '0',
            transform: 'translateX(0)',
          },
          '5%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
          '90%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
            transform: 'translateX(min(60vw, 45rem))',
          },
        },
        'glow-line-vertical': {
          '0%': {
            opacity: '0',
            transform: 'translateY(0)',
          },
          '5%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
          '90%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(min(21vw, 45rem))',
          },
        },
        zap: {
          '0%, 9%, 11%, 100% ': {
            fill: 'transparent',
          },
          '10%': {
            fill: 'white',
          },
        },
        bounce: {
          '50%': {
            transform: 'scale(0.98)',
          },
        },
        scroll: {
          to: {
            transform: 'translate(calc(-50% - 0.5rem))',
          },
        },
        spotlight: {
          '0%': {
            opacity: '0',
            transform: 'translate(-72%, -62%) scale(0.5)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate(-50%,-40%) scale(1)',
          },
        },
        moveHorizontal: {
          '0%': {
            transform: 'translateX(-50%) translateY(-10%)',
          },
          '50%': {
            transform: 'translateX(50%) translateY(10%)',
          },
          '100%': {
            transform: 'translateX(-50%) translateY(-10%)',
          },
        },
        moveInCircle: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '50%': {
            transform: 'rotate(180deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        moveVertical: {
          '0%': {
            transform: 'translateY(-50%)',
          },
          '50%': {
            transform: 'translateY(50%)',
          },
          '100%': {
            transform: 'translateY(-50%)',
          },
        },
        float: {
          '0%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-15px)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        meteor: {
          '0%': {
            transform: 'rotate(215deg) translateX(0)',
            opacity: '1',
          },
          '70%': {
            opacity: '1',
          },
          '100%': {
            transform: 'rotate(215deg) translateX(-500px)',
            opacity: '0',
          },
        },
        marquee: {
          from: {
            transform: 'translateX(0)',
          },
          to: {
            transform: 'translateX(calc(-100% - var(--gap)))',
          },
        },
        'marquee-vertical': {
          from: {
            transform: 'translateY(0)',
          },
          to: {
            transform: 'translateY(calc(-100% - var(--gap)))',
          },
        },
        shine: {
          '0%': {
            'background-position': '0% 0%',
          },
          '50%': {
            'background-position': '100% 100%',
          },
          to: {
            'background-position': '0% 0%',
          },
        },
      },
      animation: {
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
        ripple: 'ripple 2000ms ease-in-out infinite',
        meteor: 'meteor 5s linear infinite',
        scroll: 'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
        spotlight: 'spotlight 2s ease .75s 1 forwards',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        first: 'moveVertical 30s ease infinite',
        second: 'moveInCircle 20s reverse infinite',
        third: 'moveInCircle 40s linear infinite',
        fourth: 'moveHorizontal 40s ease infinite',

        'float-slow': 'float 5s ease-in-out infinite',
        'float-medium': 'float 3s ease-in-out infinite',
        'float-fast': 'float 2s ease-in-out infinite',

        fifth: 'moveInCircle 20s ease infinite',
        'meteor-effect': 'meteor 5s linear infinite',
        'fade-in': 'fade-in 1000ms var(--animation-delay, 0ms) ease forwards',
        'image-rotate': 'image-rotate 1400ms ease forwards',
        'image-glow': 'image-glow 4100ms 300ms ease-out forwards',
        zap: 'zap 2250ms calc(var(--index) * 20ms) linear infinite',
        bounce: '240ms ease 0s 1 running bounce',
        'sketch-lines': 'sketch-lines 1200ms ease-out forwards',
        'glow-line-horizontal': 'glow-line-horizontal var(--animation-duration) ease-in forwards',
        'glow-line-vertical': 'glow-line-vertical var(--animation-duration) ease-in forwards',
        shine: 'shine var(--duration) infinite linear',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    addVariablesForColors,
    require('tailwind-scrollbar')({
      nocompatible: true,
      preferredStrategy: 'pseudoelements',
    }),
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          'bg-grid': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
            maskImage: `linear-gradient(to bottom, transparent, transparent 2px, black 1px, black)`, // Create a mask to hide the first line
          }),
          'bg-grid-small': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          'bg-dot': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`,
            )}")`,
          }),
          'bg-dot-thick': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="2.5"></circle></svg>`,
            )}")`,
          }),
          'bg-topography': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" fill="none" viewBox="0 0 600 600"><path fill="${value}" d="${TopographyPath}" ></path></svg>`,
              { cacheBust: Math.random().toString(36).substring(2, 15) },
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme('backgroundColor')), type: 'color' },
      );
    },
  ],
} satisfies Config;

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme('colors'));
  let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));
  addBase({
    ':root': newVars,
  });
}

export default withUt(config);
