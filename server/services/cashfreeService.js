import axios from 'axios';
import crypto from 'crypto';
import AppError from '../utils/AppError.js';

const API_VERSION = process.env.CASHFREE_API_VERSION || '2025-01-01';

const getBaseUrl = () =>
    process.env.CASHFREE_ENV === 'production'
        ? 'https://api.cashfree.com/pg'
        : 'https://sandbox.cashfree.com/pg';

const getCredentials = () => {
    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    if (!appId || !secretKey) {
        throw new AppError('Cashfree payment gateway is not configured', 500);
    }

    return { appId, secretKey };
};

const cashfreeClient = () => {
    const { appId, secretKey } = getCredentials();
    return axios.create({
        baseURL: getBaseUrl(),
        headers: {
            'x-client-id': appId,
            'x-client-secret': secretKey,
            'x-api-version': API_VERSION,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        timeout: 30000,
    });
};

export const createCashfreeOrder = async ({
    orderId,
    amount,
    customer,
    returnUrl,
    notifyUrl,
    orderNote,
    orderTags,
}) => {
    const client = cashfreeClient();
    console.log("Amount received:", amount);
    console.log("Number(amount):", Number(amount));

    const payload = {
        order_id: orderId,
        order_amount: Number(amount),
        order_currency: 'INR',
        customer_details: {
            customer_id: customer.customerId,
            customer_name: customer.name || 'Customer',
            customer_email: customer.email,
            customer_phone: customer.phone,
        },
        order_meta: {
            return_url: returnUrl,
            ...(notifyUrl ? { notify_url: notifyUrl } : {}),
        },
        order_note: orderNote || 'Powerfiling plan purchase',
        ...(orderTags ? { order_tags: orderTags } : {}),
    };

    try {
        const { data } = await client.post('/orders', payload);
        return data;
    } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error || err.message;
        throw new AppError(`Cashfree order creation failed: ${msg}`, err.response?.status || 500);
    }
};

export const fetchCashfreeOrder = async (orderId) => {
    const client = cashfreeClient();
    try {
        const { data } = await client.get(`/orders/${encodeURIComponent(orderId)}`);
        return data;
    } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error || err.message;
        throw new AppError(`Cashfree order fetch failed: ${msg}`, err.response?.status || 500);
    }
};

export const isOrderPaid = (order) => {
    const status = order?.order_status || order?.orderStatus;
    return status === 'PAID';
};

export const getOrderStatus = (order) => order?.order_status || order?.orderStatus || 'UNKNOWN';

export const getPaymentOutcomeMessage = (status) => {
    switch (status) {
        case 'ACTIVE':
            return 'Payment was not completed. You can try again.';
        case 'EXPIRED':
            return 'Payment session expired. Please start a new payment.';
        case 'TERMINATED':
        case 'TERMINATION_REQUESTED':
            return 'Payment was cancelled.';
        default:
            return `Payment not successful. Status: ${status}`;
    }
};

export const verifyWebhookSignature = (signature, rawBody, timestamp) => {
    if (!signature || !rawBody || !timestamp) return false;

    const { secretKey } = getCredentials();
    const computed = crypto
        .createHmac('sha256', secretKey)
        .update(timestamp + rawBody)
        .digest('base64');

    const sigBuffer = Buffer.from(signature);
    const computedBuffer = Buffer.from(computed);

    if (sigBuffer.length !== computedBuffer.length) return false;
    return crypto.timingSafeEqual(sigBuffer, computedBuffer);
};
