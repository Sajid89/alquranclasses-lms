module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class',
    theme: {
      fontFamily: {
        display: ['Open Sans', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      extend: {
        fontSize: {
          14: '14px',
        },
        backgroundColor: {
          'main-bg': '#FAFBFB',
          'main-dark-bg': '#20232A',
          'secondary-dark-bg': '#33373E',
          'light-gray': '#F7F7F7',
          'half-transparent': 'rgba(0, 0, 0, 0.5)',
        },
        borderWidth: {
          1: '1px',
          1.5: '1.5px',
        },
        borderColor: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        width: {
          400: '400px',
          760: '760px',
          780: '780px',
          800: '800px',
          1000: '1000px',
          1200: '1200px',
          1400: '1400px',
          2.5: '0.625rem',
        },
        height: {
          80: '80px',
          8.5: '2.125rem',
          2.5: '0.625rem',
          70: '20rem',
          90: '25rem',
        },
        minHeight: {
          590: '590px',
        },
        backgroundImage: {
          'hero-pattern':
            "url('https://i.ibb.co/MkvLDfb/Rectangle-4389.png')",
        },
        borderRadius: {
          '3xl': '1.5rem',
          '4xl': '2rem',
          '5xl': '2.5rem',
          '6xl': '3rem',
          '7xl': '3.5rem',
          '8xl': '4rem',
          '9xl': '4.5rem',
          '10xl': '5rem',
        },
        margin: {
          '14': '3.5rem',
          '15': '3.75rem',
          '16': '4rem',
          '18': '4.5rem',
        },
        spacing: {
          '30': '7.5rem',
          '1/5': '50%',
          '1/8': '1.8rem',
        },
        keyframes: {
          spin: {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        },
        animation: {
          spin: 'spin 1s linear infinite',
        },
      },
    },
    plugins: [],
  };