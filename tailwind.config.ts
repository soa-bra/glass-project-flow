
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
    			arabic: [
    				'IBM Plex Sans Arabic',
    				'sans-serif'
    			],
    			sans: [
    				'ui-sans-serif',
    				'system-ui',
    				'sans-serif',
    				'Apple Color Emoji',
    				'Segoe UI Emoji',
    				'Segoe UI Symbol',
    				'Noto Color Emoji'
    			],
    			serif: [
    				'ui-serif',
    				'Georgia',
    				'Cambria',
    				'Times New Roman',
    				'Times',
    				'serif'
    			],
    			mono: [
    				'ui-monospace',
    				'SFMono-Regular',
    				'Menlo',
    				'Monaco',
    				'Consolas',
    				'Liberation Mono',
    				'Courier New',
    				'monospace'
    			]
    		},
    		colors: {
    			sb: {
    				ink: '#000000',
    				'ink-70': 'rgba(0,0,0,0.7)',
    				'ink-40': 'rgba(0,0,0,0.4)',
    				'ink-20': 'rgba(0,0,0,0.2)',
    				white: '#FFFFFF',
    				'app-bg': '#F1F5F9',
    				'panel-bg': '#F8F9FA',
    				'card-bg': '#FFFFFF',
    				border: '#DADCE0',
    				'brand-mint': '#BDEED3',
    				'brand-sky': '#A4E2F6',
    				'brand-lilac': '#D9D2FE',
    				'brand-rose': '#F1B5B9',
    				'brand-amber': '#FBE2AA',
    				'muted-blue': '#D1E1EA',
    				'todo-muted': '#DFECF2',
    				'project-card-bg': '#F1F5F9',
    				'task-card-bg': '#F8F9FA',
    				'box-bg': '#FFFFFF',
    				'modal-scrim': 'rgba(0,0,0,0.2)'
    			},
    			soabra: {
    				'solid-bg': '#CCD4D7',
    				'sidebar-bg': '#CCD4D7',
    				'projects-bg': '#E3E3E3',
    				'card-bg': '#f8f9fa',
    				'calendar-start': '#E8F2FE',
    				'calendar-mid': '#F9DBF8',
    				'calendar-end': '#DAD4FC',
    				'glass-bg': 'rgba(255, 255, 255, 0.45)',
    				'primary-blue': '#0099FF',
    				'primary-blue-hover': '#0077CC',
    				success: '#34D399',
    				warning: '#FBBF24',
    				error: '#EF4444',
    				secondary: '#6B7280',
    				'status-success': '#5DDC82',
    				'status-warning': '#ECFF8C',
    				'status-error': '#F23D3D',
    				'status-neutral': '#EDEDEE',
    				'text-primary': '#060606',
    				'text-secondary': '#4B5563'
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
    			'24': '24px',
    			'41': '41px',
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)',
    			'sb-global': 'var(--sb-radius-global)'
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
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'slide-in-right': 'slide-in-right 300ms ease-out',
    			'slide-out-right': 'slide-out-right 300ms ease-out'
    		},
    		spacing: {
    			'18': '4.5rem',
    			'88': '22rem'
    		},
    		zIndex: {
    			header: '1000',
    			sidebar: '1000',
    			projects: '900',
    			calendar: '900',
    			'project-cards': '800',
    			'dashboard-panel': '950',
    			modal: '1100'
    		},
    		width: {
    			'sidebar-expanded': 'var(--sidebar-width-expanded)',
    			'sidebar-collapsed': 'var(--sidebar-width-collapsed)'
    		},
    		margin: {
    			sidebar: 'var(--sidebar-margin)',
    			content: 'var(--content-margin)'
    		},
    		height: {
    			header: 'var(--header-height)'
    		}
    	}
    },
        plugins: [tailwindcssAnimate],
} satisfies Config;
