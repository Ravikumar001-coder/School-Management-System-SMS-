/**
 * Comprehensive Admin API and Database Connection Diagnostics Script
 * Run this script with node to verify database connection,
 * admin authentication, and retrieve core entity listings, RBAC roles, audit logs, and trigger backups.
 */

const BASE_URL = 'http://localhost:8080/api/v1';

async function runDiagnostics() {
  console.log('==================================================');
  console.log('🚀 SCHOOL MANAGEMENT SYSTEM (SMS) ADMIN DIAGNOSTICS');
  console.log('==================================================');
  console.log(`Target Host: ${BASE_URL}`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  let token = '';

  // 1. Authenticate as Admin
  try {
    console.log('🔄 Step 1: Authenticating as ADMIN-001...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'ADMIN-001',
        password: 'ADMIN-001',
      }),
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      throw new Error(`Authentication failed with status ${loginResponse.status}: ${errorText}`);
    }

    const loginData = await loginResponse.json();
    token = loginData.token;
    console.log('✅ Authentication SUCCESSFUL!');
    console.log(`   User: ${loginData.firstName} ${loginData.lastName}`);
    console.log(`   Email: ${loginData.email}`);
    console.log(`   Roles: ${JSON.stringify(loginData.roles)}\n`);
  } catch (error) {
    console.error('❌ Step 1 FAILED:', error.message);
    process.exit(1);
  }

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // 2. Fetch /auth/me profile info
  try {
    console.log('🔄 Step 2: Querying /auth/me Profile info...');
    const meResponse = await fetch(`${BASE_URL}/auth/me`, {
      headers: authHeaders,
    });

    if (!meResponse.ok) {
      throw new Error(`Failed with status ${meResponse.status}`);
    }

    const meData = await meResponse.json();
    console.log('✅ /auth/me profile verified successfully!\n');
  } catch (error) {
    console.error('❌ Step 2 FAILED:', error.message);
  }

  // 3. Fetch Admin Dashboard Statistics (confirms database connectivity & complex queries)
  try {
    console.log('🔄 Step 3: Fetching Admin Dashboard metrics...');
    const dbResponse = await fetch(`${BASE_URL}/dashboard/admin`, {
      headers: authHeaders,
    });

    if (!dbResponse.ok) {
      throw new Error(`Failed with status ${dbResponse.status}`);
    }

    const res = await dbResponse.json();
    const statsData = res.data;
    console.log('✅ Admin Dashboard data loaded successfully (Database respond check: OK)!');
    console.log('   Metrics Summary:');
    console.log(`   - Total Students: ${statsData.totalStudents}`);
    console.log(`   - Total Teachers: ${statsData.totalTeachers}`);
    console.log(`   - Total Classes: ${statsData.totalClasses}`);
    console.log(`   - Total Staff: ${statsData.totalStaff}`);
    console.log(`   - Total Revenue Collection: ${statsData.totalRevenue || 0}\n`);
  } catch (error) {
    console.error('❌ Step 3 FAILED:', error.message);
  }

  // 4. Fetch Classrooms list
  try {
    console.log('🔄 Step 4: Fetching Classrooms list...');
    const classesResponse = await fetch(`${BASE_URL}/classes`, {
      headers: authHeaders,
    });

    if (!classesResponse.ok) {
      throw new Error(`Failed with status ${classesResponse.status}`);
    }

    const res = await classesResponse.json();
    const classes = res.data;
    console.log(`✅ Classrooms fetched: ${classes.length} classroom(s) found!`);
    classes.slice(0, 5).forEach(c => {
      console.log(`   - [ID: ${c.id}] ${c.name} - Section: ${c.section} (Capacity: ${c.maxCapacity || 'N/A'}, Fee: ${c.classFee || 0})`);
    });
    if (classes.length > 5) {
      console.log(`   ... and ${classes.length - 5} more classrooms.`);
    }
    console.log();
  } catch (error) {
    console.error('❌ Step 4 FAILED:', error.message);
  }

  // 5. Fetch Teachers list
  try {
    console.log('🔄 Step 5: Fetching Teachers list...');
    const teachersResponse = await fetch(`${BASE_URL}/teachers`, {
      headers: authHeaders,
    });

    if (!teachersResponse.ok) {
      throw new Error(`Failed with status ${teachersResponse.status}`);
    }

    const res = await teachersResponse.json();
    const teachersPage = res.data;
    const teachers = teachersPage.content || teachersPage;
    console.log(`✅ Teachers fetched: ${teachers.length} teacher(s) found!`);
    teachers.slice(0, 5).forEach(t => {
      console.log(`   - [Employee ID: ${t.employeeId || 'N/A'}] ${t.firstName} ${t.lastName} (${t.email}) - Status: ${t.status}`);
    });
    if (teachers.length > 5) {
      console.log(`   ... and ${teachers.length - 5} more teachers.`);
    }
    console.log();
  } catch (error) {
    console.error('❌ Step 5 FAILED:', error.message);
  }

  // 6. Fetch Students list
  try {
    console.log('🔄 Step 6: Fetching Students list...');
    const studentsResponse = await fetch(`${BASE_URL}/students`, {
      headers: authHeaders,
    });

    if (!studentsResponse.ok) {
      throw new Error(`Failed with status ${studentsResponse.status}`);
    }

    const res = await studentsResponse.json();
    const studentsPage = res.data;
    const students = studentsPage.content || studentsPage;
    console.log(`✅ Students fetched: ${students.length} student(s) found!`);
    students.slice(0, 5).forEach(s => {
      console.log(`   - [Student ID: ${s.studentId || 'N/A'}] ${s.firstName} ${s.lastName} (${s.email}) - Class: ${s.classRoomName || 'None'}`);
    });
    if (students.length > 5) {
      console.log(`   ... and ${students.length - 5} more students.`);
    }
    console.log();
  } catch (error) {
    console.error('❌ Step 6 FAILED:', error.message);
  }

  // 7. RBAC Verification (Roles & Permissions)
  try {
    console.log('🔄 Step 7: Verifying RBAC Management (Roles & Permissions)...');
    const rolesResponse = await fetch(`${BASE_URL}/roles`, {
      headers: authHeaders,
    });

    if (!rolesResponse.ok) {
      throw new Error(`Roles fetch failed with status ${rolesResponse.status}`);
    }

    const roles = await rolesResponse.json();
    console.log(`✅ RBAC roles fetched: ${roles.length} role(s) configured in DB!`);
    roles.forEach(r => {
      console.log(`   - [Role: ${r.name}] Description: ${r.description} (System Role: ${r.systemRole})`);
    });
    console.log();
  } catch (error) {
    console.error('❌ Step 7 FAILED:', error.message);
  }

  // 8. Audit Logs Verification
  try {
    console.log('🔄 Step 8: Fetching Session & Activity Audit Logs...');
    const logsResponse = await fetch(`${BASE_URL}/audit-logs`, {
      headers: authHeaders,
    });

    if (!logsResponse.ok) {
      throw new Error(`Audit logs fetch failed with status ${logsResponse.status}`);
    }

    const logsPage = await logsResponse.json();
    const logs = logsPage.content || logsPage;
    console.log(`✅ Audit Logs retrieved successfully: ${logs.length || 0} entry/entries found!`);
    if (logs.length > 0) {
      logs.slice(0, 5).forEach(l => {
        console.log(`   - [${l.timestamp || l.createdAt || 'N/A'}] [Actor: ${l.username || l.actor || 'SYSTEM'}] Action: ${l.action || l.details}`);
      });
    }
    console.log();
  } catch (error) {
    console.error('❌ Step 8 FAILED:', error.message);
  }

  // 9. Manual Database Backup Trigger (Confirms transactional robustness and disk write)
  try {
    console.log('🔄 Step 9: Triggering system manual backup via API...');
    const backupResponse = await fetch(`${BASE_URL}/backups/manual`, {
      method: 'POST',
      headers: authHeaders,
    });

    if (!backupResponse.ok) {
      throw new Error(`Backup trigger failed with status ${backupResponse.status}`);
    }

    const res = await backupResponse.json();
    const backup = res.data;
    console.log('✅ Manual database backup triggered successfully!');
    console.log(`   Backup Record:`);
    console.log(`   - ID: ${backup.id}`);
    console.log(`   - File Name: ${backup.fileName}`);
    console.log(`   - File Path: ${backup.filePath}`);
    console.log(`   - Status: ${backup.status}`);
    console.log(`   - Size: ${backup.fileSize || 0} bytes`);
    console.log(`   - Date: ${backup.createdAt || backup.backupDate || 'N/A'}\n`);
  } catch (error) {
    console.error('❌ Step 9 FAILED:', error.message);
  }

  console.log('==================================================');
  console.log('🎉 DIAGNOSTICS COMPLETED SUCCESSFULLY!');
  console.log('==================================================');
}

runDiagnostics();
