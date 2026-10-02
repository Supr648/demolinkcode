/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FAFAF8',
        ink: {
          DEFAULT: '#1A1A1A',
          primary: '#111827',
          secondary: '#4B5563',
          muted: '#6B7280',
          subtle: '#9CA3AF',
        },
        edge: {
          subtle: '#E5E7EB',
          strong: '#D1D5DB',
        },
        brand: {
          50: '#EEF0FD',
          100: '#DCE0FB',
          200: '#B9C1F8',
          300: '#96A2F4',
          400: '#697AF0',
          500: '#3B3FD9', // Primary Accent
          600: '#2F32B5',
          700: '#232591',
          800: '#17186E',
          900: '#0C0D4A',
        },
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#FFFFFF',
          subtle: '#F9FAFB',
          muted: '#F3F4F6',
          border: '#E5E7EB',
        },
        status: {
          success: '#059669',
          'success-bg': '#ECFDF5',
          warning: '#D97706',
          'warning-bg': '#FFFBEB',
          danger: '#E11D48',
          'danger-bg': '#FFF1F2',
          info: '#0284C7',
          'info-bg': '#F0F9FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px -2px rgba(0, 0, 0, 0.05), 0 1px 3px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 28px -6px rgba(0, 0, 0, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
        'dropdown': '0 10px 30px -5px rgba(0, 0, 0, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px -3px rgba(59, 63, 217, 0.35)',
      },
    },
  },
  plugins: [],
}
