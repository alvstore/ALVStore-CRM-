import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type LayoutState = {
  openDrawer: boolean
  openMobileDrawer: boolean
  openSearch: boolean
  openQuickView: boolean
  openCart: boolean
  openWishlist: boolean
  openCompare: boolean
  openNotification: boolean
  openUserMenu: boolean
  openMobileMenu: boolean
  openMobileFilter: boolean
  openMobileSort: boolean
  openMobileView: boolean
  openMobileSearch: boolean
  openMobileAccountMenu: boolean
  openMobileNavMenu: boolean
  openMobileCategoryMenu: boolean
  openMobileLanguageMenu: boolean
  openMobileCurrencyMenu: boolean
  openMobileAuthDialog: boolean
  openMobileCart: boolean
  openMobileWishlist: boolean
  openMobileCompare: boolean
  openMobileNotification: boolean
  openMobileUserMenu: boolean
}

const initialState: LayoutState = {
  openDrawer: false,
  openMobileDrawer: false,
  openSearch: false,
  openQuickView: false,
  openCart: false,
  openWishlist: false,
  openCompare: false,
  openNotification: false,
  openUserMenu: false,
  openMobileMenu: false,
  openMobileFilter: false,
  openMobileSort: false,
  openMobileView: false,
  openMobileSearch: false,
  openMobileAccountMenu: false,
  openMobileNavMenu: false,
  openMobileCategoryMenu: false,
  openMobileLanguageMenu: false,
  openMobileCurrencyMenu: false,
  openMobileAuthDialog: false,
  openMobileCart: false,
  openMobileWishlist: false,
  openMobileCompare: false,
  openMobileNotification: false,
  openMobileUserMenu: false,
}

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    // Toggle drawer
    toggleDrawer: (state) => {
      state.openDrawer = !state.openDrawer
    },
    
    // Set drawer
    setDrawer: (state, action: PayloadAction<boolean>) => {
      state.openDrawer = action.payload
    },
    
    // Toggle mobile drawer
    toggleMobileDrawer: (state) => {
      state.openMobileDrawer = !state.openMobileDrawer
    },
    
    // Set mobile drawer
    setMobileDrawer: (state, action: PayloadAction<boolean>) => {
      state.openMobileDrawer = action.payload
    },
    
    // Toggle search
    toggleSearch: (state) => {
      state.openSearch = !state.openSearch
    },
    
    // Set search
    setSearch: (state, action: PayloadAction<boolean>) => {
      state.openSearch = action.payload
    },
    
    // Toggle quick view
    toggleQuickView: (state) => {
      state.openQuickView = !state.openQuickView
    },
    
    // Set quick view
    setQuickView: (state, action: PayloadAction<boolean>) => {
      state.openQuickView = action.payload
    },
    
    // Toggle cart
    toggleCart: (state) => {
      state.openCart = !state.openCart
    },
    
    // Set cart
    setCart: (state, action: PayloadAction<boolean>) => {
      state.openCart = action.payload
    },
    
    // Toggle wishlist
    toggleWishlist: (state) => {
      state.openWishlist = !state.openWishlist
    },
    
    // Set wishlist
    setWishlist: (state, action: PayloadAction<boolean>) => {
      state.openWishlist = action.payload
    },
    
    // Toggle compare
    toggleCompare: (state) => {
      state.openCompare = !state.openCompare
    },
    
    // Set compare
    setCompare: (state, action: PayloadAction<boolean>) => {
      state.openCompare = action.payload
    },
    
    // Toggle notification
    toggleNotification: (state) => {
      state.openNotification = !state.openNotification
    },
    
    // Set notification
    setNotification: (state, action: PayloadAction<boolean>) => {
      state.openNotification = action.payload
    },
    
    // Toggle user menu
    toggleUserMenu: (state) => {
      state.openUserMenu = !state.openUserMenu
    },
    
    // Set user menu
    setUserMenu: (state, action: PayloadAction<boolean>) => {
      state.openUserMenu = action.payload
    },
    
    // Reset all
    resetLayout: () => {
      return { ...initialState }
    },
  },
})

export const {
  toggleDrawer,
  setDrawer,
  toggleMobileDrawer,
  setMobileDrawer,
  toggleSearch,
  setSearch,
  toggleQuickView,
  setQuickView,
  toggleCart,
  setCart,
  toggleWishlist,
  setWishlist,
  toggleCompare,
  setCompare,
  toggleNotification,
  setNotification,
  toggleUserMenu,
  setUserMenu,
  resetLayout,
} = layoutSlice.actions

export default layoutSlice.reducer
