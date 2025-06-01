export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"メイリオ"', 'Helvetica','sans-serif'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      colors: {
        primary: {
          DEFAULT: '#004386',
          text: '#BBBBBB',
        },
        secondary: {
          DEFAULT: '#8E9FAE',
          text: '#222222',
        },
        warning: {
          DEFAULT: '#F59E0B',
          text: '#92400E',
        },
        danger: {
          DEFAULT: '#EF5555',
          text: '#000000',
        },
        neutral: {
          DEFAULT: '#9CA3AF',
          text: '#4B5563',
        },
        info: {
          DEFAULT: '#FFFFFF',
          text: '#000000',
        },
      }
    },
  },
  plugins: [],
}
