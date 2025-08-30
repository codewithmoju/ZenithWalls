export const theme = {
  colors: {
    // Ultra-premium primary colors - Royal Purple Collection
    primary: '#8B5CF6',           // Royal amethyst
    primaryDark: '#7C3AED',       // Deep royal purple
    primaryLight: '#A78BFA',      // Soft lavender
    primaryGlow: '#C4B5FD',       // Ethereal glow
    
    // Luxury secondary colors - Rose Gold Collection
    secondary: '#EC4899',         // Vibrant pink
    secondaryDark: '#DB2777',     // Deep rose
    secondaryLight: '#F472B6',    // Soft rose
    
    // Premium accent colors - Golden Collection
    accent: '#F59E0B',            // Luxury gold
    accentDark: '#D97706',        // Rich amber
    accentLight: '#FBBF24',       // Bright gold
    accentGlow: '#FEF3C7',        // Golden shimmer
    
    // Platinum accent collection
    platinum: '#E5E7EB',          // Platinum silver
    platinumDark: '#9CA3AF',      // Dark silver
    platinumLight: '#F3F4F6',     // Light platinum
    
    // Ultra-dark backgrounds - Obsidian Collection
    background: '#030712',        // Obsidian black
    backgroundSecondary: '#0F0F23', // Midnight blue
    backgroundTertiary: '#1A1B3A', // Deep space
    
    // Premium surfaces - Charcoal Collection
    surface: '#1E1B4B',          // Deep indigo surface
    surfaceElevated: '#312E81',   // Elevated indigo
    surfaceHighlight: '#3730A3',  // Highlighted surface
    
    // Luxury card backgrounds
    card: '#1E1E2E',             // Premium card
    cardElevated: '#2A2A3E',      // Elevated card
    cardHighlight: '#363654',     // Highlighted card
    cardGlass: 'rgba(255, 255, 255, 0.05)', // Glass morphism
    
    // Premium text hierarchy
    text: '#FAFAFA',              // Ultra-white
    textPrimary: '#FFFFFF',       // Pure white
    textSecondary: '#D1D5DB',     // Soft platinum
    textTertiary: '#9CA3AF',      // Muted silver
    textQuaternary: '#6B7280',    // Subtle grey
    textDisabled: '#4B5563',      // Disabled state
    
    // Luxury status colors
    success: '#10B981',           // Emerald green
    successLight: '#34D399',      // Light emerald
    successDark: '#059669',       // Deep emerald
    
    error: '#EF4444',             // Ruby red
    errorLight: '#F87171',        // Light ruby
    errorDark: '#DC2626',         // Deep ruby
    
    warning: '#F59E0B',           // Amber gold
    warningLight: '#FBBF24',      // Light amber
    warningDark: '#D97706',       // Deep amber
    
    info: '#3B82F6',              // Sapphire blue
    infoLight: '#60A5FA',         // Light sapphire
    infoDark: '#2563EB',          // Deep sapphire
    
    // Premium borders and dividers
    border: '#374151',            // Charcoal border
    borderLight: '#4B5563',       // Light charcoal
    borderAccent: '#6366F1',      // Accent border
    divider: '#374151',           // Subtle divider
    dividerLight: '#4B5563',      // Light divider
    
    // Utility colors
    black: '#000000',
    white: '#FFFFFF',
    transparent: 'transparent',
    
    // Premium overlays
    overlay: 'rgba(3, 7, 18, 0.8)',     // Dark overlay
    overlayLight: 'rgba(3, 7, 18, 0.6)', // Light overlay
    overlayGlass: 'rgba(255, 255, 255, 0.1)', // Glass overlay
    
    // Luxury gradient collections
    // Royal gradients
    gradientRoyal: ['#8B5CF6', '#7C3AED', '#6366F1'],
    gradientRoyalReverse: ['#6366F1', '#7C3AED', '#8B5CF6'],
    
    // Rose gold gradients
    gradientRose: ['#EC4899', '#F59E0B', '#EF4444'],
    gradientRoseReverse: ['#EF4444', '#F59E0B', '#EC4899'],
    
    // Platinum gradients
    gradientPlatinum: ['#E5E7EB', '#9CA3AF', '#6B7280'],
    gradientPlatinumReverse: ['#6B7280', '#9CA3AF', '#E5E7EB'],
    
    // Aurora gradients
    gradientAurora: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
    gradientSunset: ['#EF4444', '#F59E0B', '#EC4899'],
    gradientOcean: ['#3B82F6', '#8B5CF6', '#EC4899'],
    
    // Legacy gradient support
    gradientStart: '#8B5CF6',
    gradientEnd: '#7C3AED',
    gradientAccent: '#EC4899',
    
    // Premium status backgrounds with opacity
    successBg: 'rgba(16, 185, 129, 0.1)',
    errorBg: 'rgba(239, 68, 68, 0.1)',
    warningBg: 'rgba(245, 158, 11, 0.1)',
    infoBg: 'rgba(59, 130, 246, 0.1)',
    
    // Luxury shimmer and glow effects
    shimmer: 'rgba(255, 255, 255, 0.3)',
    glow: 'rgba(139, 92, 246, 0.4)',
    glowAccent: 'rgba(236, 72, 153, 0.4)',
  },
  fontWeights: {
    thin: '100',
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800'
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 20,
    xxl: 32,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  shadows: {
    // Standard elevation shadows
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3.84,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5.46,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 12,
    },
    xxl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.4,
      shadowRadius: 25,
      elevation: 16,
    },
    
    // Premium colored shadows
    primaryShadow: {
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    secondaryShadow: {
      shadowColor: '#EC4899',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    accentShadow: {
      shadowColor: '#F59E0B',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },
    
    // Luxury glow effects
    primaryGlow: {
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 20,
      elevation: 10,
    },
    secondaryGlow: {
      shadowColor: '#EC4899',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 20,
      elevation: 10,
    },
    accentGlow: {
      shadowColor: '#F59E0B',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 10,
    },
    
    // Ultra-premium luxury shadows
    luxury: {
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 15 },
      shadowOpacity: 0.5,
      shadowRadius: 30,
      elevation: 20,
    },
    
    // Inner shadows for depth
    innerShadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: -2,
    },
  },
  
  // Glass morphism effects
  glass: {
    light: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    medium: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    heavy: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    
    // Colored glass effects
    primaryGlass: {
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(139, 92, 246, 0.2)',
    },
    secondaryGlass: {
      backgroundColor: 'rgba(236, 72, 153, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(236, 72, 153, 0.2)',
    },
    accentGlass: {
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.2)',
    },
  },
  
  // Animation durations
  animations: {
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
  
  // Premium button styles
  buttons: {
    primary: {
      backgroundColor: '#B794F6',
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 24,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderColor: '#B794F6',
      borderWidth: 2,
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 22,
    },
    ghost: {
      backgroundColor: 'rgba(183, 148, 246, 0.1)',
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 24,
    }
  },
  
  // Typography scale
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 28,
      fontWeight: '600',
      lineHeight: 36,
      letterSpacing: -0.25,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    h4: {
      fontSize: 20,
      fontWeight: '500',
      lineHeight: 28,
    },
    body1: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    body2: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.5,
    }
  }
}
