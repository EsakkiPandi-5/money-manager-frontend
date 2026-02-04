# Money Manager Frontend

Frontend application for Money Manager built with React.js and Tailwind CSS.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (optional):
```
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Features

- **Dashboard**: View income, expense, and balance with month/week/year filters
- **Transactions**: Add, edit, and delete transactions with filtering options
- **Category Summary**: View spending breakdown by category
- **Accounts**: Manage multiple accounts and transfer funds between them

## Technologies Used

- React.js
- Tailwind CSS
- Axios
- React Icons
