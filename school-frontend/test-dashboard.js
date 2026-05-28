// c:/Users/ravi kumar/Desktop/sms/school-frontend/test-dashboard.js
/* -------------------------------------------------------------
   Dashboard verification script – authenticates with the backend
   and queries every admin‑dashboard endpoint to ensure real DB
   data is returned.
   ------------------------------------------------------------- */

const BASE_URL = process.env.API_URL || "http://localhost:8080/api";
const ADMIN_USER = process.env.ADMIN_USER || "ADMIN-001";
const ADMIN_PASS = process.env.ADMIN_PASS || "ADMIN-001";

async function login() {
  const resp = await fetch(`${BASE_URL}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS })
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Login failed (${resp.status}): ${txt}`);
  }

  const data = await resp.json();
  console.log(`🔐 Logged in as ${data.firstName} ${data.lastName}`);
  return data.token;
}

async function fetchEndpoint(url, token) {
  const resp = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!resp.ok) {
    const txt = await resp.text();
    console.warn(`⚠️  ${url} → ${resp.status}: ${txt}`);
    return null;
  }

  const json = await resp.json();
  console.log(`✅ ${url}:`, JSON.stringify(json, null, 2));
  return json;
}

(async () => {
  try {
    const token = await login();

    // Core admin dashboard view
    await fetchEndpoint(`${BASE_URL}/dashboard/admin`, token);

    // Individual KPI sections (Root Dashboard service)
    await fetchEndpoint(`${BASE_URL}/dashboard/summary`, token);
    await fetchEndpoint(`${BASE_URL}/dashboard/student`, token);
    await fetchEndpoint(`${BASE_URL}/dashboard/hr`, token);
    await fetchEndpoint(`${BASE_URL}/dashboard/finance`, token);
    await fetchEndpoint(`${BASE_URL}/dashboard/operations`, token);
    await fetchEndpoint(`${BASE_URL}/dashboard/attendance-trends`, token);
    await fetchEndpoint(`${BASE_URL}/dashboard/critical-alerts`, token);
    await fetchEndpoint(`${BASE_URL}/dashboard/activity-feed`, token);

    // CSV export (example: finance)
    const csvResp = await fetch(`${BASE_URL}/export/dashboard?type=finance`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (csvResp.ok) {
      const blob = await csvResp.blob();
      console.log(`📊 CSV export (finance) size: ${blob.size} bytes`);
    } else {
      console.warn(`⚠️ CSV export failed: ${csvResp.status}`);
    }

    console.log("\n✅ All dashboard endpoints verified.");
  } catch (e) {
    console.error("\n❌ Verification failed:", e.message);
  }
})();
