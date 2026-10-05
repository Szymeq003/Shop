import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
    stages: [
        { duration: '30s', target: 50 },  // Ramp up to 50 users
        { duration: '1m', target: 50 },   // Stay at 50 users for 1 min
        { duration: '30s', target: 0 },   // Ramp down to 0
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    },
};

const BASE_URL = 'http://host.docker.internal:8080/api';

export default function () {
    const userIndex = randomIntBetween(1, 1000);
    const userId = 10000 + userIndex;
    const email = `testuser${userIndex}@example.com`;
    const password = 'password';

    // 1. Login
    const loginPayload = JSON.stringify({
        email: email,
        password: password,
    });
    
    const loginParams = {
        headers: { 'Content-Type': 'application/json' },
    };

    let loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, loginParams);
    
    check(loginRes, {
        'login successful': (r) => r.status === 200,
    });

    if (loginRes.status !== 200) {
        return; // Stop if login fails
    }

    const token = loginRes.json('token');
    const authHeaders = {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    };

    sleep(1);

    // 2. Add to Cart (variantId=1 is seeded by DataLoader)
    const cartPayload = JSON.stringify({
        variantId: 1,
        quantity: 1,
    });

    let cartRes = http.post(`${BASE_URL}/cart/add`, cartPayload, authHeaders);
    
    check(cartRes, {
        'added to cart': (r) => r.status === 200,
    });

    sleep(1);

    // 3. Place Order
    const orderPayload = JSON.stringify({
        addressId: userId, // we created addresses with id = userId
        shippingMethod: 'Kurier',
        paymentMethod: 'Karta',
    });

    let orderRes = http.post(`${BASE_URL}/user/orders`, orderPayload, authHeaders);
    
    check(orderRes, {
        'order placed': (r) => r.status === 200,
    });

    sleep(randomIntBetween(1, 3));
}
