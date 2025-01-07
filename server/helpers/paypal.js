const paypal = require('paypal-rest-sdk');

paypal.configure({
    mode: 'sandbox',
    client_id: process.env.VITE_PAYPAL_CLIENT_ID,
    client_secret: process.env.VITE_PAYPAL_SECRET_ID,
});

module.exports = paypal;