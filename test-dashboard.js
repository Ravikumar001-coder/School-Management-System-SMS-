const axios = require('axios');

async function testDashboardEndpoints() {
    try {
        console.log("Attempting to log in as admin...");
        const loginRes = await axios.post('http://localhost:8080/api/v1/auth/login', {
            username: 'admin',
            password: 'ADMIN-001'
        });
        
        const token = loginRes.data.token;
        console.log("Login Success! Token obtained.");
        
        const client = axios.create({
            baseURL: 'http://localhost:8080/api/v1',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // 1. Test Summary
        console.log("\n--- GET /dashboard/summary ---");
        const summaryRes = await client.get('/dashboard/summary');
        console.log("Status:", summaryRes.status);
        console.log("Data Summary:", JSON.stringify(summaryRes.data.data, null, 2));

        // 2. Test Students Analytics
        console.log("\n--- GET /dashboard/students/analytics ---");
        const studentsRes = await client.get('/dashboard/students/analytics');
        console.log("Status:", studentsRes.status);
        console.log("Data Students Analytics:", JSON.stringify(studentsRes.data.data, null, 2));

        // 3. Test Finance Analytics
        console.log("\n--- GET /dashboard/finance/analytics ---");
        const financeRes = await client.get('/dashboard/finance/analytics');
        console.log("Status:", financeRes.status);
        console.log("Data Finance Analytics:", JSON.stringify(financeRes.data.data, null, 2));

        // 4. Test Attendance Details
        console.log("\n--- GET /dashboard/attendance/details ---");
        const todayStr = new Date().toISOString().split('T')[0];
        const attendanceRes = await client.get(`/dashboard/attendance/details?date=${todayStr}`);
        console.log("Status:", attendanceRes.status);
        console.log("Data Attendance Details for today:", JSON.stringify(attendanceRes.data.data, null, 2));

        // 5. Test Compliance Details
        console.log("\n--- GET /dashboard/health/compliance ---");
        const complianceRes = await client.get('/dashboard/health/compliance');
        console.log("Status:", complianceRes.status);
        console.log("Data Compliance Details:", JSON.stringify(complianceRes.data.data, null, 2));

        console.log("\nAll checks passed successfully!");
    } catch (error) {
        console.error("Verification failed!", error.response ? `${error.response.status} - ${JSON.stringify(error.response.data)}` : error.message);
    }
}

testDashboardEndpoints();
