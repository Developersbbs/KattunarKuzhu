'use client';
import { vars } from 'nativewind';

// Helper function to convert hex to RGB string
const hexToRgb = (hex: string) => {
  // Remove the # if it exists
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Return the RGB string
  return `${r} ${g} ${b}`;
};

// New color palette
const PRIMARY = '#2D1248'; // Dark purple
const SECONDARY = '#E1E4DD'; // Light gray with slight green tint

// RGB conversions
const PRIMARY_RGB = hexToRgb(PRIMARY);
const SECONDARY_RGB = hexToRgb(SECONDARY);

// Generate color variations
const generateShades = (baseRgb: string, isLight: boolean) => {
  const [r, g, b] = baseRgb.split(' ').map(Number);
  
  // For dark colors (like PRIMARY), we lighten for variations
  // For light colors (like SECONDARY), we darken for variations
  const factor = isLight ? -1 : 1;
  
  return {
    '0': `${Math.min(255, r + factor * 90)} ${Math.min(255, g + factor * 90)} ${Math.min(255, b + factor * 90)}`,
    '50': `${Math.min(255, r + factor * 80)} ${Math.min(255, g + factor * 80)} ${Math.min(255, b + factor * 80)}`,
    '100': `${Math.min(255, r + factor * 70)} ${Math.min(255, g + factor * 70)} ${Math.min(255, b + factor * 70)}`,
    '200': `${Math.min(255, r + factor * 60)} ${Math.min(255, g + factor * 60)} ${Math.min(255, b + factor * 60)}`,
    '300': `${Math.min(255, r + factor * 50)} ${Math.min(255, g + factor * 50)} ${Math.min(255, b + factor * 50)}`,
    '400': `${Math.min(255, r + factor * 30)} ${Math.min(255, g + factor * 30)} ${Math.min(255, b + factor * 30)}`,
    '500': `${r} ${g} ${b}`, // Original color
    '600': `${Math.max(0, r - factor * 20)} ${Math.max(0, g - factor * 20)} ${Math.max(0, b - factor * 20)}`,
    '700': `${Math.max(0, r - factor * 40)} ${Math.max(0, g - factor * 40)} ${Math.max(0, b - factor * 40)}`,
    '800': `${Math.max(0, r - factor * 60)} ${Math.max(0, g - factor * 60)} ${Math.max(0, b - factor * 60)}`,
    '900': `${Math.max(0, r - factor * 80)} ${Math.max(0, g - factor * 80)} ${Math.max(0, b - factor * 80)}`,
    '950': `${Math.max(0, r - factor * 90)} ${Math.max(0, g - factor * 90)} ${Math.max(0, b - factor * 90)}`,
  };
};

// Generate primary shades (dark purple)
const primaryShades = generateShades(PRIMARY_RGB, false);

// Generate secondary shades (light gray)
const secondaryShades = generateShades(SECONDARY_RGB, true);

export const config = {
  light: vars({
    // Primary (Dark purple) - Adjusted for light theme
    '--color-primary-0': primaryShades['0'],
    '--color-primary-50': primaryShades['50'],
    '--color-primary-100': primaryShades['100'],
    '--color-primary-200': primaryShades['200'],
    '--color-primary-300': primaryShades['300'],
    '--color-primary-400': primaryShades['400'],
    '--color-primary-500': primaryShades['500'],
    '--color-primary-600': primaryShades['600'],
    '--color-primary-700': primaryShades['700'],
    '--color-primary-800': primaryShades['800'],
    '--color-primary-900': primaryShades['900'],
    '--color-primary-950': primaryShades['950'],

    /* Secondary (Light gray with green tint) - Adjusted for light theme */
    '--color-secondary-0': secondaryShades['0'],
    '--color-secondary-50': secondaryShades['50'],
    '--color-secondary-100': secondaryShades['100'],
    '--color-secondary-200': secondaryShades['200'],
    '--color-secondary-300': secondaryShades['300'],
    '--color-secondary-400': secondaryShades['400'],
    '--color-secondary-500': secondaryShades['500'],
    '--color-secondary-600': secondaryShades['600'],
    '--color-secondary-700': secondaryShades['700'],
    '--color-secondary-800': secondaryShades['800'],
    '--color-secondary-900': secondaryShades['900'],
    '--color-secondary-950': secondaryShades['950'],

    /* Tertiary */
    '--color-tertiary-0': '255 250 245',
    '--color-tertiary-50': '255 242 229',
    '--color-tertiary-100': '255 233 213',
    '--color-tertiary-200': '254 209 170',
    '--color-tertiary-300': '253 180 116',
    '--color-tertiary-400': '251 157 75',
    '--color-tertiary-500': '231 129 40',
    '--color-tertiary-600': '215 117 31',
    '--color-tertiary-700': '180 98 26',
    '--color-tertiary-800': '130 73 23',
    '--color-tertiary-900': '108 61 19',
    '--color-tertiary-950': '84 49 18',

    /* Error */
    '--color-error-0': '254 233 233',
    '--color-error-50': '254 226 226',
    '--color-error-100': '254 202 202',
    '--color-error-200': '252 165 165',
    '--color-error-300': '248 113 113',
    '--color-error-400': '239 68 68',
    '--color-error-500': '230 53 53',
    '--color-error-600': '220 38 38',
    '--color-error-700': '185 28 28',
    '--color-error-800': '153 27 27',
    '--color-error-900': '127 29 29',
    '--color-error-950': '83 19 19',

    /* Success */
    '--color-success-0': '228 255 244',
    '--color-success-50': '202 255 232',
    '--color-success-100': '162 241 192',
    '--color-success-200': '132 211 162',
    '--color-success-300': '102 181 132',
    '--color-success-400': '72 151 102',
    '--color-success-500': '52 131 82',
    '--color-success-600': '42 121 72',
    '--color-success-700': '32 111 62',
    '--color-success-800': '22 101 52',
    '--color-success-900': '20 83 45',
    '--color-success-950': '27 50 36',

    /* Warning */
    '--color-warning-0': '255 249 245',
    '--color-warning-50': '255 244 236',
    '--color-warning-100': '255 231 213',
    '--color-warning-200': '254 205 170',
    '--color-warning-300': '253 173 116',
    '--color-warning-400': '251 149 75',
    '--color-warning-500': '231 120 40',
    '--color-warning-600': '215 108 31',
    '--color-warning-700': '180 90 26',
    '--color-warning-800': '130 68 23',
    '--color-warning-900': '108 56 19',
    '--color-warning-950': '84 45 18',

    /* Info */
    '--color-info-0': '236 248 254',
    '--color-info-50': '199 235 252',
    '--color-info-100': '162 221 250',
    '--color-info-200': '124 207 248',
    '--color-info-300': '87 194 246',
    '--color-info-400': '50 180 244',
    '--color-info-500': '13 166 242',
    '--color-info-600': '11 141 205',
    '--color-info-700': '9 115 168',
    '--color-info-800': '7 90 131',
    '--color-info-900': '5 64 93',
    '--color-info-950': '3 38 56',

    /* Typography */
    '--color-typography-0': '254 254 255',
    '--color-typography-50': '245 245 245',
    '--color-typography-100': '229 229 229',
    '--color-typography-200': '219 219 220',
    '--color-typography-300': '212 212 212',
    '--color-typography-400': '163 163 163',
    '--color-typography-500': '140 140 140',
    '--color-typography-600': '115 115 115',
    '--color-typography-700': '82 82 82',
    '--color-typography-800': '64 64 64',
    '--color-typography-900': PRIMARY_RGB, // Using primary color for dark text
    '--color-typography-950': PRIMARY_RGB,
    '--color-typography-white': SECONDARY_RGB, // Using secondary color for light text
    '--color-typography-gray': '212 212 212',
    '--color-typography-black': PRIMARY_RGB,

    /* Outline */
    '--color-outline-0': '253 254 254',
    '--color-outline-50': '243 243 243',
    '--color-outline-100': '230 230 230',
    '--color-outline-200': '221 220 219',
    '--color-outline-300': '211 211 211',
    '--color-outline-400': '165 163 163',
    '--color-outline-500': '140 141 141',
    '--color-outline-600': '115 116 116',
    '--color-outline-700': SECONDARY_RGB, // Using secondary color for outlines
    '--color-outline-800': primaryShades['300'],
    '--color-outline-900': PRIMARY_RGB,
    '--color-outline-950': primaryShades['800'],

    /* Background */
    '--color-background-0': SECONDARY_RGB, // Light background
    '--color-background-50': secondaryShades['50'],
    '--color-background-100': secondaryShades['100'],
    '--color-background-200': secondaryShades['200'],
    '--color-background-300': secondaryShades['300'],
    '--color-background-400': secondaryShades['400'],
    '--color-background-500': secondaryShades['500'],
    '--color-background-600': secondaryShades['600'],
    '--color-background-700': secondaryShades['700'],
    '--color-background-800': secondaryShades['800'],
    '--color-background-900': primaryShades['300'],
    '--color-background-950': PRIMARY_RGB, // Dark background (primary color)

    /* Background Special */
    '--color-background-error': '254 241 241',
    '--color-background-warning': '255 243 234',
    '--color-background-success': '237 252 242',
    '--color-background-muted': '247 248 247',
    '--color-background-info': '235 248 254',
    '--color-background-light': SECONDARY_RGB,
    '--color-background-dark': PRIMARY_RGB,

    /* Focus Ring Indicator  */
    '--color-indicator-primary': PRIMARY_RGB,
    '--color-indicator-info': '83 153 236',
    '--color-indicator-error': '185 28 28',
  }),
  dark: vars({
    // Primary (Dark purple) - Maintained for dark theme
    '--color-primary-0': primaryShades['950'],
    '--color-primary-50': primaryShades['900'],
    '--color-primary-100': primaryShades['800'],
    '--color-primary-200': primaryShades['700'],
    '--color-primary-300': primaryShades['600'],
    '--color-primary-400': primaryShades['500'],
    '--color-primary-500': primaryShades['400'],
    '--color-primary-600': primaryShades['300'],
    '--color-primary-700': primaryShades['200'],
    '--color-primary-800': primaryShades['100'],
    '--color-primary-900': primaryShades['50'],
    '--color-primary-950': primaryShades['0'],

    /* Secondary (Light gray with green tint) - Maintained for dark theme */
    '--color-secondary-0': secondaryShades['950'],
    '--color-secondary-50': secondaryShades['900'],
    '--color-secondary-100': secondaryShades['800'],
    '--color-secondary-200': secondaryShades['700'],
    '--color-secondary-300': secondaryShades['600'],
    '--color-secondary-400': secondaryShades['500'],
    '--color-secondary-500': secondaryShades['400'],
    '--color-secondary-600': secondaryShades['300'],
    '--color-secondary-700': secondaryShades['200'],
    '--color-secondary-800': secondaryShades['100'],
    '--color-secondary-900': secondaryShades['50'],
    '--color-secondary-950': secondaryShades['0'],

    /* Tertiary */
    '--color-tertiary-0': '84 49 18',
    '--color-tertiary-50': '108 61 19',
    '--color-tertiary-100': '130 73 23',
    '--color-tertiary-200': '180 98 26',
    '--color-tertiary-300': '215 117 31',
    '--color-tertiary-400': '231 129 40',
    '--color-tertiary-500': '251 157 75',
    '--color-tertiary-600': '253 180 116',
    '--color-tertiary-700': '254 209 170',
    '--color-tertiary-800': '255 233 213',
    '--color-tertiary-900': '255 242 229',
    '--color-tertiary-950': '255 250 245',

    /* Error */
    '--color-error-0': '83 19 19',
    '--color-error-50': '127 29 29',
    '--color-error-100': '153 27 27',
    '--color-error-200': '185 28 28',
    '--color-error-300': '220 38 38',
    '--color-error-400': '230 53 53',
    '--color-error-500': '239 68 68',
    '--color-error-600': '249 97 96',
    '--color-error-700': '229 91 90',
    '--color-error-800': '254 202 202',
    '--color-error-900': '254 226 226',
    '--color-error-950': '254 233 233',

    /* Success */
    '--color-success-0': '27 50 36',
    '--color-success-50': '20 83 45',
    '--color-success-100': '22 101 52',
    '--color-success-200': '32 111 62',
    '--color-success-300': '42 121 72',
    '--color-success-400': '52 131 82',
    '--color-success-500': '72 151 102',
    '--color-success-600': '102 181 132',
    '--color-success-700': '132 211 162',
    '--color-success-800': '162 241 192',
    '--color-success-900': '202 255 232',
    '--color-success-950': '228 255 244',

    /* Warning */
    '--color-warning-0': '84 45 18',
    '--color-warning-50': '108 56 19',
    '--color-warning-100': '130 68 23',
    '--color-warning-200': '180 90 26',
    '--color-warning-300': '215 108 31',
    '--color-warning-400': '231 120 40',
    '--color-warning-500': '251 149 75',
    '--color-warning-600': '253 173 116',
    '--color-warning-700': '254 205 170',
    '--color-warning-800': '255 231 213',
    '--color-warning-900': '255 244 237',
    '--color-warning-950': '255 249 245',

    /* Info */
    '--color-info-0': '3 38 56',
    '--color-info-50': '5 64 93',
    '--color-info-100': '7 90 131',
    '--color-info-200': '9 115 168',
    '--color-info-300': '11 141 205',
    '--color-info-400': '13 166 242',
    '--color-info-500': '50 180 244',
    '--color-info-600': '87 194 246',
    '--color-info-700': '124 207 248',
    '--color-info-800': '162 221 250',
    '--color-info-900': '199 235 252',
    '--color-info-950': '236 248 254',

    /* Typography */
    '--color-typography-0': primaryShades['950'],
    '--color-typography-50': primaryShades['900'],
    '--color-typography-100': primaryShades['800'],
    '--color-typography-200': primaryShades['700'],
    '--color-typography-300': primaryShades['600'],
    '--color-typography-400': primaryShades['500'],
    '--color-typography-500': primaryShades['400'],
    '--color-typography-600': secondaryShades['700'],
    '--color-typography-700': secondaryShades['600'],
    '--color-typography-800': secondaryShades['400'],
    '--color-typography-900': secondaryShades['200'],
    '--color-typography-950': SECONDARY_RGB, // Light text using secondary color
    '--color-typography-white': SECONDARY_RGB, // Light text using secondary color
    '--color-typography-gray': secondaryShades['400'],
    '--color-typography-black': PRIMARY_RGB, // Dark text using primary color

    /* Outline */
    '--color-outline-0': primaryShades['950'],
    '--color-outline-50': primaryShades['900'],
    '--color-outline-100': primaryShades['800'],
    '--color-outline-200': primaryShades['700'],
    '--color-outline-300': primaryShades['600'],
    '--color-outline-400': primaryShades['500'],
    '--color-outline-500': primaryShades['400'],
    '--color-outline-600': secondaryShades['800'],
    '--color-outline-700': secondaryShades['700'], // Highlight outline in dark mode
    '--color-outline-800': secondaryShades['600'],
    '--color-outline-900': secondaryShades['400'],
    '--color-outline-950': SECONDARY_RGB,

    /* Background */
    '--color-background-0': PRIMARY_RGB, // Dark background using primary color
    '--color-background-50': primaryShades['700'],
    '--color-background-100': primaryShades['600'],
    '--color-background-200': primaryShades['500'],
    '--color-background-300': primaryShades['400'],
    '--color-background-400': primaryShades['300'],
    '--color-background-500': primaryShades['200'],
    '--color-background-600': secondaryShades['900'],
    '--color-background-700': secondaryShades['800'],
    '--color-background-800': secondaryShades['600'],
    '--color-background-900': secondaryShades['400'],
    '--color-background-950': SECONDARY_RGB, // Light background using secondary color

    /* Background Special */
    '--color-background-error': '66 43 43',
    '--color-background-warning': '65 47 35',
    '--color-background-success': '28 43 33',
    '--color-background-muted': primaryShades['400'],
    '--color-background-info': '26 40 46',
    '--color-background-light': SECONDARY_RGB,
    '--color-background-dark': PRIMARY_RGB,

    /* Focus Ring Indicator  */
    '--color-indicator-primary': SECONDARY_RGB,
    '--color-indicator-info': '161 199 245',
    '--color-indicator-error': '232 70 69',
  }),
};
