const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

console.log('REACT_APP_ENV:', process.env.REACT_APP_ENV);
console.log('API_BASE_URL:', API_BASE_URL);

const STRIPE_PACKAGES = [
    { id: process.env.REACT_APP_STRIPE_PACKAGE_BASIC, name: 'Basic', price: 35, classes: 1 },
    { id: process.env.REACT_APP_STRIPE_PACKAGE_STANDARD, name: 'Standard', price: 65, classes: 2 },
    { id: process.env.REACT_APP_STRIPE_PACKAGE_PLUS, name: 'Plus', price: 79, classes: 3 },
    { id: process.env.REACT_APP_STRIPE_PACKAGE_PREMIUM, name: 'Premium', price: 95, classes: 4 },
    { id: process.env.REACT_APP_STRIPE_PACKAGE_VIP, name: 'Vip', price: 119, classes: 5 },
];

export { API_BASE_URL, STRIPE_PACKAGES };