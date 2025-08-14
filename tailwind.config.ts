
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'arabic': ['IBM Plex Sans Arabic', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
			},
			fontSize: {
				'display-l': ['40px', { lineHeight: '48px', fontWeight: '700' }],
				'display-m': ['32px', { lineHeight: '40px', fontWeight: '700' }],
				'title': ['20px', { lineHeight: '28px', fontWeight: '700' }],
				'subtitle': ['16px', { lineHeight: '24px', fontWeight: '600' }],
				'body': ['14px', { lineHeight: '22px', fontWeight: '400' }],
				'label': ['12px', { lineHeight: '18px', fontWeight: '500' }],
			},
			colors: {
				// SoaBra Design Tokens v1.0.0
				'soabra': {
					'ink': '#0B0F12',
					'ink-80': 'rgba(11,15,18,0.80)',
					'ink-60': 'rgba(11,15,18,0.60)',
					'ink-30': 'rgba(11,15,18,0.30)',
					'white': '#FFFFFF',
					'panel': '#d9e7ed',
					'border': '#DADCE0',
					'surface': '#FFFFFF',
					'accent-green': '#3DBE8B',
					'accent-yellow': '#F6C445',
					'accent-red': '#E5564D',
					'accent-blue': '#3DA8F5',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'card-top': '24px',
				'card-bottom': '6px',
				'panel': '18px',
				'chip': '9999px',
				'tooltip': '10px',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'slide-in-right': {
					'0%': {
						transform: 'translateX(100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1'
					}
				},
				'slide-out-right': {
					'0%': {
						transform: 'translateX(0)',
						opacity: '1'
					},
					'100%': {
						transform: 'translateX(100%)',
						opacity: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(24px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-out': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(24px)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'scale-out': {
					'0%': {
						transform: 'scale(1)',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(0.95)',
						opacity: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-in-right': 'slide-in-right 300ms ease-out',
				'slide-out-right': 'slide-out-right 300ms ease-out',
				'fade-in': 'fade-in 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
				'fade-out': 'fade-out 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
				'scale-in': 'scale-in 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
				'scale-out': 'scale-out 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
				'reveal': 'fade-in 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
				'stagger': 'fade-in 0.7s cubic-bezier(0.22, 1, 0.36, 1)'
			},
			spacing: {
				'1': '4px',  // xs
				'2': '8px',  // sm
				'3': '12px', // md
				'4': '16px', // lg
				'6': '24px', // xl
				'8': '32px', // xxl
				'10': '40px', // 3xl
				'18': '4.5rem',
				'88': '22rem'
			},
			zIndex: {
				'header': '1000',
				'sidebar': '1000',
				'projects': '900',
				'calendar': '900',
				'project-cards': '800',
				'dashboard-panel': '950',
				'modal': '1100'
			},
			width: {
				'sidebar-expanded': 'var(--sidebar-width-expanded)',
				'sidebar-collapsed': 'var(--sidebar-width-collapsed)',
			},
			margin: {
				'sidebar': 'var(--sidebar-margin)',
				'content': 'var(--content-margin)',
			},
			height: {
				'header': 'var(--header-height)',
			}
		}
	},
        plugins: [tailwindcssAnimate],
} satisfies Config;
