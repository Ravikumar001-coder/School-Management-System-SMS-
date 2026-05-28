const axios = require('axios');

async function testLogin() {
    try {
        const res = await axios.post('http://localhost:8080/api/v1/auth/login', {
            username: 'admin',
            password: 'password' // or whatever the default password is
        });
        console.log("Login Success! Token:", res.data.token ? "YES" : "NO");
        console.log("User:", res.data.username, res.data.role);
    } catch (error) {
        console.error("Login Failed!", error.response ? error.response.status : error.message);
        if (error.response && error.response.status === 401) {
            console.log("Trying password 826001...");
            try {
                const res2 = await axios.post('http://localhost:8080/api/v1/auth/login', {
                    username: 'admin',
                    password: 'password123'
                });
                console.log("Login Success with password123!");
            } catch (e) {
                console.log("Failed again:", e.response ? e.response.status : e.message);
            }
        }
    }
}
testLogin();
