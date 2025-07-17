# POS (Point of Sale) Module

A comprehensive Point of Sale system integrated with the Vuexy admin template. This module allows businesses to manage sales, inventory, and customer interactions efficiently.

## Features

- **Dashboard**: Overview of sales, orders, and key performance metrics
- **Point of Sale**: Intuitive interface for processing sales and payments
- **Order Management**: View, filter, and manage customer orders
- **Customer Management**: Track customer information and purchase history
- **Product Management**: Manage product catalog with categories and variants
- **Inventory Tracking**: Real-time stock level monitoring
- **Reporting**: Generate sales reports and analytics
- **Receipts**: Print or email receipts to customers

## Technical Stack

- **Frontend**: Next.js 14 with TypeScript
- **UI Library**: MUI v6
- **State Management**: Redux Toolkit
- **Data Fetching**: RTK Query
- **Form Handling**: React Hook Form
- **Charts**: Chart.js
- **Icons**: Tabler Icons

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- Next.js project with Redux Toolkit and MUI v6 configured

### Installation

1. Copy the `pos` directory to your Next.js project's `src/app/[lang]/(dashboard)/(private)/apps/` directory
2. Copy the components to your `src/views/apps/pos/` directory
3. Update your navigation menu to include the POS routes
4. Make sure all required dependencies are installed

### Required Dependencies

```bash
npm install @reduxjs/toolkit react-redux @tanstack/react-table react-hook-form date-fns classnames react-to-print
# or
yarn add @reduxjs/toolkit react-redux @tanstack/react-table react-hook-form date-fns classnames react-to-print
```

## Configuration

### Environment Variables

Create a `.env.local` file in your project root and add the following variables:

```env
NEXT_PUBLIC_API_URL=your_api_url_here
# Add any other required environment variables
```

### Redux Store Setup

Make sure your Redux store includes the POS reducer and middleware. Update your store configuration:

```typescript
// src/redux-store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { posApi } from './apis/posApi'
import posReducer from './slices/pos/posSlice'

export const store = configureStore({
  reducer: {
    // ... other reducers
    [posApi.reducerPath]: posApi.reducer,
    pos: posReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(posApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

## Usage

### Accessing the POS

1. Log in to your application
2. Navigate to "POS System" in the sidebar
3. Select "Point of Sale" to start a new transaction

### Processing a Sale

1. Search for products by name or SKU
2. Select a customer (optional)
3. Adjust quantities as needed
4. Apply discounts or promotions if applicable
5. Select a payment method
6. Complete the sale
7. Print or email the receipt

## Customization

### Theming

You can customize the POS appearance by modifying the theme in your MUI theme configuration:

```typescript
// src/theme/theme.ts
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#7367F0', // Your primary color
    },
    // ... other theme customizations
  },
  // ... other theme configurations
})
```

### Components

You can customize individual components by creating overrides in your theme or by creating wrapper components.

## API Integration

The POS module is designed to work with a RESTful API. Update the API endpoints in `src/redux-store/apis/posApi.ts` to match your backend API.

## Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Support

For support, please open an issue in the repository or contact the development team.
