// Design Tokens - Centralized design system configuration

export const tokens = {
  // Color palette based on psychological principles
  colors: {
    primary: {
      50: 'hsl(207, 100%, 97%)',
      100: 'hsl(207, 96%, 94%)',
      200: 'hsl(207, 94%, 87%)',
      300: 'hsl(207, 90%, 77%)',
      400: 'hsl(207, 90%, 67%)',
      500: 'hsl(207, 90%, 54%)', // Primary brand color - trust & reliability
      600: 'hsl(207, 90%, 48%)',
      700: 'hsl(207, 90%, 42%)',
      800: 'hsl(207, 90%, 36%)',
      900: 'hsl(207, 90%, 30%)',
    },
    secondary: {
      50: 'hsl(262, 100%, 97%)',
      100: 'hsl(262, 96%, 94%)',
      200: 'hsl(262, 94%, 87%)',
      300: 'hsl(262, 90%, 77%)',
      400: 'hsl(262, 90%, 67%)',
      500: 'hsl(262, 83%, 58%)', // Secondary brand color - innovation & creativity
      600: 'hsl(262, 83%, 52%)',
      700: 'hsl(262, 83%, 46%)',
      800: 'hsl(262, 83%, 40%)',
      900: 'hsl(262, 83%, 34%)',
    },
    success: {
      50: 'hsl(158, 100%, 97%)',
      100: 'hsl(158, 96%, 94%)',
      200: 'hsl(158, 94%, 87%)',
      300: 'hsl(158, 90%, 77%)',
      400: 'hsl(158, 90%, 67%)',
      500: 'hsl(158, 64%, 52%)', // Success - growth & positive action
      600: 'hsl(158, 64%, 46%)',
      700: 'hsl(158, 64%, 40%)',
      800: 'hsl(158, 64%, 34%)',
      900: 'hsl(158, 64%, 28%)',
    },
    warning: {
      50: 'hsl(31, 100%, 97%)',
      100: 'hsl(31, 96%, 94%)',
      200: 'hsl(31, 94%, 87%)',
      300: 'hsl(31, 90%, 77%)',
      400: 'hsl(31, 90%, 67%)',
      500: 'hsl(31, 100%, 60%)', // Warning - attention & energy
      600: 'hsl(31, 100%, 54%)',
      700: 'hsl(31, 100%, 48%)',
      800: 'hsl(31, 100%, 42%)',
      900: 'hsl(31, 100%, 36%)',
    },
    error: {
      50: 'hsl(0, 100%, 97%)',
      100: 'hsl(0, 96%, 94%)',
      200: 'hsl(0, 94%, 87%)',
      300: 'hsl(0, 90%, 77%)',
      400: 'hsl(0, 90%, 67%)',
      500: 'hsl(0, 84%, 60%)', // Error - urgency & caution
      600: 'hsl(0, 84%, 54%)',
      700: 'hsl(0, 84%, 48%)',
      800: 'hsl(0, 84%, 42%)',
      900: 'hsl(0, 84%, 36%)',
    },
    neutral: {
      50: 'hsl(240, 5%, 98%)',
      100: 'hsl(240, 5%, 96%)',
      200: 'hsl(240, 6%, 90%)',
      300: 'hsl(240, 5%, 84%)',
      400: 'hsl(240, 5%, 65%)',
      500: 'hsl(240, 4%, 46%)',
      600: 'hsl(240, 5%, 34%)',
      700: 'hsl(240, 5%, 26%)',
      800: 'hsl(240, 4%, 16%)',
      900: 'hsl(240, 6%, 10%)',
    },
  },

  // Typography scale with psychological considerations
  typography: {
    fontFamilies: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
    },
    fontSizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeights: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // Spacing system for cognitive load reduction
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem',      // 384px
  },

  // Border radius for modern, friendly appearance
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    default: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows for depth and hierarchy
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
    // Emotional shadows
    glow: '0 0 20px rgb(59 130 246 / 0.3)',
    'glow-lg': '0 0 40px rgb(59 130 246 / 0.2)',
    'glow-purple': '0 0 30px rgb(147 51 234 / 0.3)',
  },

  // Animation durations and easing
  animations: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '750ms',
      slowest: '1000ms',
    },
    easings: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      // Emotional easing functions
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // Breakpoints for responsive design
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index scale for layering
  zIndex: {
    auto: 'auto',
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    modal: 1000,
    popover: 1010,
    tooltip: 1020,
    notification: 1030,
  },
};

// CSS Custom Properties Generator
export const generateCSSCustomProperties = () => {
  const properties: Record<string, string> = {};
  
  // Generate color properties
  Object.entries(tokens.colors).forEach(([colorName, colorScale]) => {
    if (typeof colorScale === 'object') {
      Object.entries(colorScale).forEach(([shade, value]) => {
        properties[`--color-${colorName}-${shade}`] = value;
      });
    }
  });
  
  // Generate spacing properties
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    properties[`--spacing-${key}`] = value;
  });
  
  // Generate typography properties
  Object.entries(tokens.typography.fontSizes).forEach(([key, value]) => {
    properties[`--font-size-${key}`] = value;
  });
  
  return properties;
};