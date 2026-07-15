/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: "#0A4D38",       // Deep Forest Green
        secondary: "#D4A574",     // Warm Sand
        accent: "#B87333",         // Copper Bronze
        surface: "#FFFFFF",       // White
        "surface-secondary": "#F9F7F4", // Off-White
        border: "#E8E4E0",        // Light Stone
        "text-primary": "#2D2D2D", // Charcoal
        "text-secondary": "#6B6B6B", // Medium Gray
        disabled: "#A0A0A0",      // Soft Gray
        success: "#2ECC71",       // Success Green
        warning: "#F39C12",       // Warning Orange
        error: "#E74C3C",         // Error Red
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        "4xl": "96px",
        "5xl": "128px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        full: "9999px",
      },
      boxShadow: {
        none: "none",
        soft: "0 2px 4px rgba(0, 0, 0, 0.05)",
        elevated: "0 4px 12px rgba(0, 0, 0, 0.1)",
        floating: "0 8px 24px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        "slide-in": "slideIn 0.3s ease-out",
        "spin": "spin 0.8s ease-in-out infinite",
      },
      keyframes: {
        slideIn: {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
