import { createMuiTheme } from '@material-ui/core';
import shadows from './shadows';

const MuiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#3b3e66'
    },
    grey: {
      300: '#fefefe',
      A100: '#f8f9ff'
    },
    secondary: {
      main: '#2EBC7F'
    },
    error: {
      main: '#f83245'
    },
    success: {
      main: '#49E287'
    },
    info: {
      main: '#11c5db'
    },
    warning: {
      main: '#FFD039'
    },
    helpers: {
      primary: '#3c44b1',
      main: 'rgba(25, 46, 91, .035)'
    },
    contrastThreshold: 3,
    tonalOffset: 0.1
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 1100,
      xl: 1381
    }
  },
  shape: {
    borderRadius: '0.2rem'
  },
  overrides: {
    MuiTab: {
      root: {
        fontWeight: 'bold'
      }
    },
    MuiButton: {
      sizeSmall: {
        padding: '6px 20px',
        fontSize: 14
      },
      outlinedSmall: {
        padding: '6px 20px',
        fontSize: 14
      },
      textSmall: {
        padding: '6px 20px',
        fontSize: 14
      },

      sizeMedium: {
        padding: '10px 22px',
        fontSize: 15
      },
      outlined: {
        padding: '10px 22px',
        fontSize: 14
      },
      text: {
        padding: '10px 22px',
        fontSize: 14
      },

      sizeLarge: {
        padding: '16px 28px',
        fontSize: 16
      },
      outlinedLarge: {
        padding: '16px 28px',
        fontSize: 16
      },
      textLarge: {
        padding: '16px 28px',
        fontSize: 16
      },

      root: {
        textTransform: 'none',
        fontWeight: 'normal',
        padding: '10px 22px',
        fontSize: 14
      }
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: '#070919',
        padding: '8px 16px',
        fontSize: '13px'
      },
      arrow: {
        color: '#070919'
      }
    }
  },
  typography: {
    fontFamily: ['Heebo', 'sans-serif'].join(','),
    htmlFontSize: 16,
    fontSize: 14
  },
  shadows
});

export default MuiTheme;
