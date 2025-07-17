import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ThemeMode = 'light' | 'dark' | 'system'
type ThemeDirection = 'ltr' | 'rtl'

type ThemeState = {
  mode: ThemeMode
  direction: ThemeDirection
  isDark: boolean
  isRTL: boolean
  skin: 'default' | 'bordered' | 'semi-dark'
  contentWidth: 'full' | 'boxed'
  layout: 'vertical' | 'horizontal'
  lastLayout: 'vertical' | 'horizontal'
  verticalNavToggleType: 'accordion' | 'collapse'
  navCollapsed: boolean
  navHidden: boolean
  footerType: 'static' | 'sticky' | 'hidden'
  menuTextTruncate: boolean
  responsiveFontSizes: boolean
  disableCustomizer: boolean
  disableThemeTour: boolean
}

const initialState: ThemeState = {
  mode: 'light',
  direction: 'ltr',
  isDark: false,
  isRTL: false,
  skin: 'default',
  contentWidth: 'full',
  layout: 'vertical',
  lastLayout: 'vertical',
  verticalNavToggleType: 'accordion',
  navCollapsed: false,
  navHidden: false,
  footerType: 'static',
  menuTextTruncate: true,
  responsiveFontSizes: true,
  disableCustomizer: false,
  disableThemeTour: false,
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Set theme mode
    setMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload
      state.isDark = action.payload === 'dark' || (action.payload === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    },
    
    // Toggle theme mode
    toggleMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      state.isDark = state.mode === 'dark' || (state.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    },
    
    // Set direction
    setDirection: (state, action: PayloadAction<ThemeDirection>) => {
      state.direction = action.payload
      state.isRTL = action.payload === 'rtl'
      document.documentElement.dir = action.payload
    },
    
    // Toggle direction
    toggleDirection: (state) => {
      state.direction = state.direction === 'ltr' ? 'rtl' : 'ltr'
      state.isRTL = state.direction === 'rtl'
      document.documentElement.dir = state.direction
    },
    
    // Set skin
    setSkin: (state, action: PayloadAction<ThemeState['skin']>) => {
      state.skin = action.payload
    },
    
    // Set content width
    setContentWidth: (state, action: PayloadAction<ThemeState['contentWidth']>) => {
      state.contentWidth = action.payload
    },
    
    // Set layout
    setLayout: (state, action: PayloadAction<ThemeState['layout']>) => {
      state.layout = action.payload
      
      // Save last layout for future use
      if (action.payload !== 'horizontal') {
        state.lastLayout = action.payload
      }
    },
    
    // Toggle layout
    toggleLayout: (state) => {
      state.layout = state.layout === 'vertical' ? 'horizontal' : 'vertical'
      
      // Save last layout for future use
      if (state.layout !== 'horizontal') {
        state.lastLayout = state.layout
      }
    },
    
    // Set vertical nav toggle type
    setVerticalNavToggleType: (state, action: PayloadAction<ThemeState['verticalNavToggleType']>) => {
      state.verticalNavToggleType = action.payload
    },
    
    // Toggle nav collapsed
    toggleNavCollapsed: (state) => {
      state.navCollapsed = !state.navCollapsed
    },
    
    // Set nav collapsed
    setNavCollapsed: (state, action: PayloadAction<boolean>) => {
      state.navCollapsed = action.payload
    },
    
    // Toggle nav hidden
    toggleNavHidden: (state) => {
      state.navHidden = !state.navHidden
    },
    
    // Set nav hidden
    setNavHidden: (state, action: PayloadAction<boolean>) => {
      state.navHidden = action.payload
    },
    
    // Set footer type
    setFooterType: (state, action: PayloadAction<ThemeState['footerType']>) => {
      state.footerType = action.payload
    },
    
    // Toggle menu text truncate
    toggleMenuTextTruncate: (state) => {
      state.menuTextTruncate = !state.menuTextTruncate
    },
    
    // Toggle responsive font sizes
    toggleResponsiveFontSizes: (state) => {
      state.responsiveFontSizes = !state.responsiveFontSizes
    },
    
    // Toggle customizer
    toggleDisableCustomizer: (state) => {
      state.disableCustomizer = !state.disableCustomizer
    },
    
    // Toggle theme tour
    toggleDisableThemeTour: (state) => {
      state.disableThemeTour = !state.disableThemeTour
    },
    
    // Reset theme settings
    resetTheme: () => {
      return { ...initialState }
    },
  },
})

export const {
  setMode,
  toggleMode,
  setDirection,
  toggleDirection,
  setSkin,
  setContentWidth,
  setLayout,
  toggleLayout,
  setVerticalNavToggleType,
  toggleNavCollapsed,
  setNavCollapsed,
  toggleNavHidden,
  setNavHidden,
  setFooterType,
  toggleMenuTextTruncate,
  toggleResponsiveFontSizes,
  toggleDisableCustomizer,
  toggleDisableThemeTour,
  resetTheme,
} = themeSlice.actions

export default themeSlice.reducer
