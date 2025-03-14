import fetch from 'node-fetch';

async function testAPI() {
    try {
        // Test 1: Create Access Code
        console.log('Testing Access Code Creation...');
        const accessCodeResponse = await fetch('http://localhost:5000/api/access-codes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                expiry: '2025-12-31T23:59:59.999Z'
            })
        });
        const accessCode = await accessCodeResponse.json();
        console.log('Access Code Created:', accessCode);

        // Test 2: Get All Access Codes
        console.log('\nTesting Get All Access Codes...');
        const allCodesResponse = await fetch('http://localhost:5000/api/access-codes');
        const allCodes = await allCodesResponse.json();
        console.log('All Access Codes:', allCodes);

        // Test 3: Get Analytics Overview
        console.log('\nTesting Analytics Overview...');
        const analyticsResponse = await fetch('http://localhost:5000/api/analytics');
        const analytics = await analyticsResponse.json();
        console.log('Analytics:', analytics);

    } catch (error) {
        console.error('Error during testing:', error);
    }
}

testAPI(); 