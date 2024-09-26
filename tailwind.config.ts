import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin';

export const HEADER_HEIGHT_DESKTOP = '248px';
export const HEADER_HEIGHT_MOBILE = '164px';

export const OUTER_PADDING = '16px';
export const CONTENT_CARD_PADDING = '16px';

export const CONTENT_GAP = '48px'


const customHeight = {
  'header-desktop': `${HEADER_HEIGHT_DESKTOP}`,
  'header-mobile': `${HEADER_HEIGHT_MOBILE}`,
  'content-gap': `${CONTENT_GAP}`,
  'fit-screen-with-header-desktop': `calc(100vh - ${HEADER_HEIGHT_DESKTOP} - ${CONTENT_GAP} - ${OUTER_PADDING} - ${OUTER_PADDING} - ${CONTENT_CARD_PADDING} - ${CONTENT_CARD_PADDING})`,
  'fit-screen-with-header-mobile': `calc(100vh - ${HEADER_HEIGHT_MOBILE} - ${CONTENT_GAP} -  ${OUTER_PADDING} - ${OUTER_PADDING} - ${CONTENT_CARD_PADDING} - ${CONTENT_CARD_PADDING})`,
};

const customPadding = {
  outer: `${OUTER_PADDING}`,
  'content-card': `${CONTENT_CARD_PADDING}`,
}

const customGap = {
  content: `${CONTENT_GAP}`,
}

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)'],
      },
      minHeight: {
        ...customHeight,
      },
      maxHeight: {
        ...customHeight,
      },
      height: {
        ...customHeight,
      },
      padding: {
        ...customPadding,
      },
      gap: {
        ...customGap,
      },
    },
  },
  plugins: [plugin(({ addUtilities }) => {
    addUtilities({
      '.center': {
        '@apply flex justify-center items-center': {},
      },
    });
  })],
};
export default config;
