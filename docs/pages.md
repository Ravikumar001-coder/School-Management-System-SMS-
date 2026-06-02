# Complete API Call Inventory — All 104 Screens

---

## AUTH SCREENS

```
01 Universal Login /login ALL
GET  /api/auth/roles
POST /api/auth/login { username, password, role }
POST /api/auth/refresh { refreshToken }
POST /api/auth/logout { refreshToken }
GET  /api/auth/me
POST /api/auth/validate-token { token }

02 Parent Login /parent-login PAR
POST /api/parent-auth/send-otp { phone }
POST /api/parent-auth/verify-otp { phone, otp }
POST /api/parent-auth/login { email, password }
POST /api/parent-auth/refresh { refreshToken }
POST /api/parent-auth/logout
GET  /api/parent-auth/me

03 Forgot Password /forgot-password ALL
POST /api/auth/forgot-password { email, role }
POST /api/auth/verify-reset-code { email, code }
POST /api/auth/reset-password { resetToken, newPassword }
GET  /api/auth/validate-reset-token?token=
```

---

## SUPER ADMIN SCREENS

```
04 Root Dashboard /root/dashboard SA
GET  /api/root/dashboard/stats
GET  /api/root/dashboard/school-health
GET  /api/root/dashboard/alerts
GET  /api/root/dashboard/recent-logins
GET  /api/root/dashboard/user-activity?days=7
POST /api/root/dashboard/alerts/:id/acknowledge
GET  /api/root/dashboard/service-status

05 School Management List /root/schools SA
GET  /api/root/schools?status=&plan=&board=&city=&search=&page=&size=
GET  /api/root/schools/:id
POST /api/root/schools/:id/impersonate
PUT  /api/root/schools/:id/suspend { reason, notify }
PUT  /api/root/schools/:id/activate
PUT  /api/root/schools/:id/suspend
DELETE /api/root/schools/:id
POST /api/root/schools/bulk-export { ids[] }
GET  /api/root/schools/export?format=csv|excel

06 Add/Edit School Wizard /root/schools/new SA
POST /api/root/schools/validate-step { step, data }
GET  /api/root/schools/check-code?code=
GET  /api/root/plans
GET  /api/root/modules
POST /api/root/schools { basic, branding, plan, modules, admin }
GET  /api/root/schools/:id
PUT  /api/root/schools/:id { basic, branding, plan, modules, admin }
POST /api/root/schools/:id/logo { file }
GET  /api/root/teachers?search= (for admin assignment dropdown)

07 Role & Permission Manager /root/roles SA
GET  /api/root/roles
GET  /api/root/roles/:id
GET  /api/root/roles/:id/permissions
POST /api/root/roles { name, icon, color, description }
PUT  /api/root/roles/:id { name, icon, color, description }
PUT  /api/root/roles/:id/permissions { permissions[] }
POST /api/root/roles/:id/duplicate
DELETE /api/root/roles/:id
GET  /api/root/roles/:id/users?page=&size=

08 System Health Monitor /root/system-health SA
GET  /api/root/health/services
GET  /api/root/health/metrics?range=15m|1h|6h|24h
GET  /api/root/health/incidents
GET  /api/root/health/incidents/:id
GET  /api/root/health/services/:name/details
GET  /api/root/health/services/:name/logs?page=
GET  /api/root/health/db-queries?threshold=100&range=1h
GET  /api/root/health/school-load
POST /api/root/health/services/:name/restart
POST /api/root/health/incidents/:id/acknowledge
POST /api/root/health/incidents/:id/resolve { resolution }
GET  /api/root/health/uptime?days=30

09 Audit Log Viewer /root/audit-logs SA
GET  /api/root/audit-logs?search=&action=&role=&school=&from=&to=&page=&size=
GET  /api/root/audit-logs/:id
GET  /api/root/audit-logs/:id/related
POST /api/root/audit-logs/:id/flag { reason }
POST /api/root/audit-logs/export { dateFrom, dateTo, format, fields, scope }
GET  /api/root/audit-logs/stats?date=
GET  /api/root/audit-logs/actions (enum list for filter dropdown)

10 Backup & Restore /root/backup SA
GET  /api/root/backups?page=&size=&type=&status=
GET  /api/root/backups/:id
GET  /api/root/backups/:id/status
POST /api/root/backups/run { type, scope, notify }
POST /api/root/backups/:id/cancel
POST /api/root/backups/:id/restore { scope, confirm }
GET  /api/root/backups/:id/download
DELETE /api/root/backups/:id
GET  /api/root/backups/schedule
PUT  /api/root/backups/schedule { schedules[] }
GET  /api/root/backups/storage-info
POST /api/root/backups/cleanup { olderThanDays }

11 Session Manager /root/sessions SA
GET  /api/root/sessions?role=&school=&status=&search=&page=&size=
GET  /api/root/sessions/history?from=&to=&user=&result=&page=&size=
GET  /api/root/sessions/flagged?page=&size=
GET  /api/root/sessions/stats
DELETE /api/root/sessions/:id { reason }
DELETE /api/root/sessions/bulk { ids[], reason }
DELETE /api/root/sessions/all { exclude[], reason }
POST /api/root/sessions/block-ip { ip, reason, duration }
GET  /api/root/sessions/blocked-ips
DELETE /api/root/sessions/blocked-ips/:ip
GET  /api/root/sessions/export?from=&to=&format=
```

---

## ADMIN CORE SCREENS

```
12 Admin Dashboard /admin/dashboard ADM
GET  /api/admin/dashboard/stats
GET  /api/admin/dashboard/alerts
GET  /api/admin/dashboard/attendance-summary?date=
GET  /api/admin/dashboard/fee-chart?months=6
GET  /api/admin/dashboard/events?upcoming=true&limit=5
GET  /api/admin/dashboard/recent-activity?limit=10
GET  /api/admin/dashboard/quick-stats
POST /api/admin/dashboard/alerts/:id/dismiss

13 Student List /admin/students ADM
GET  /api/admin/students?class=&section=&status=&search=&page=&size=&sort=
GET  /api/admin/students/count?class=&section=&status=
POST /api/admin/students/bulk-action { action, ids[] }
GET  /api/admin/students/export?class=&section=&format=csv|excel|pdf
POST /api/admin/students/generate-id-cards { ids[] }
POST /api/admin/students/send-sms { ids[], message }
GET  /api/admin/classes (for filter dropdown)
GET  /api/admin/sections?class= (for filter dropdown)

14 Student Profile/Detail /admin/students/:id ADM
GET  /api/admin/students/:id
GET  /api/admin/students/:id/attendance?month=&year=
GET  /api/admin/students/:id/fees
GET  /api/admin/students/:id/ledger
GET  /api/admin/students/:id/exams
GET  /api/admin/students/:id/marks?exam=
GET  /api/admin/students/:id/homework
GET  /api/admin/students/:id/hostel
GET  /api/admin/students/:id/transport
GET  /api/admin/students/:id/documents
GET  /api/admin/students/:id/activity-log
DELETE /api/admin/students/:id
PUT  /api/admin/students/:id/status { status, reason }

15 Add/Edit Student Wizard /admin/students/new ADM
POST /api/admin/students/validate-step { step, data }
GET  /api/admin/students/check-admission-number?number=
GET  /api/admin/academic-years
GET  /api/admin/classes
GET  /api/admin/sections?class=
GET  /api/admin/transport/routes
GET  /api/admin/transport/routes/:id/stops
GET  /api/admin/hostel/blocks
GET  /api/admin/hostel/rooms?block=
GET  /api/admin/hostel/beds?room=
POST /api/admin/students { personal, academic, parent, transport, hostel }
PUT  /api/admin/students/:id { personal, academic, parent, transport, hostel }
POST /api/admin/students/:id/documents { files[] }
DELETE /api/admin/students/:id/documents/:docId
GET  /api/admin/students/:id/documents/:docId/download

16 Teacher List /admin/teachers ADM
GET  /api/admin/teachers?department=&status=&search=&page=&size=&sort=
GET  /api/admin/teachers/count?department=&status=
GET  /api/admin/teachers/export?format=csv|excel
GET  /api/admin/departments (for filter dropdown)
POST /api/admin/teachers/bulk-action { action, ids[] }
POST /api/admin/teachers/send-sms { ids[], message }

17 Teacher Profile/Detail /admin/teachers/:id ADM
GET  /api/admin/teachers/:id
GET  /api/admin/teachers/:id/classes-assigned
GET  /api/admin/teachers/:id/subjects
GET  /api/admin/teachers/:id/attendance?month=&year=
GET  /api/admin/teachers/:id/payroll?month=&year=
GET  /api/admin/teachers/:id/performance
GET  /api/admin/teachers/:id/documents
GET  /api/admin/teachers/:id/leave-history
PUT  /api/admin/teachers/:id/status { status, reason }
DELETE /api/admin/teachers/:id

18 Class & Section Manager /admin/academics/classes ADM
GET  /api/admin/classes?year=
GET  /api/admin/classes/:id
GET  /api/admin/classes/:id/sections
GET  /api/admin/sections/:id
GET  /api/admin/sections/:id/students
GET  /api/admin/sections/:id/subjects
GET  /api/admin/academic-years
POST /api/admin/classes { name, level, year, sections }
PUT  /api/admin/classes/:id
DELETE /api/admin/classes/:id
POST /api/admin/classes/:id/sections { name, teacher, room, capacity }
PUT  /api/admin/sections/:id { name, teacher, room, capacity }
DELETE /api/admin/sections/:id
GET  /api/admin/teachers?search= (for class teacher dropdown)

19 Subject Manager /admin/academics/subjects ADM
GET  /api/admin/subjects?class=&type=&search=&page=&size=
GET  /api/admin/subjects/:id
GET  /api/admin/subjects/:id/teacher-assignments
POST /api/admin/subjects { name, code, type, icon, classes[], periods, maxMarks }
PUT  /api/admin/subjects/:id
DELETE /api/admin/subjects/:id
PUT  /api/admin/subjects/:id/assign-teacher { classId, teacherId }
GET  /api/admin/subjects/check-code?code=
GET  /api/admin/teachers?subject= (for teacher assignment)

20 Timetable Manager /admin/academics/timetable ADM
GET  /api/admin/timetable?class=&week=
GET  /api/admin/timetable/teacher/:id?week=
GET  /api/admin/timetable/conflicts?class=&week=
PUT  /api/admin/timetable/period/:id { subjectId, teacherId, startTime, endTime, type }
POST /api/admin/timetable/swap { periodId1, periodId2 }
POST /api/admin/timetable/generate { scope, preferences, workingDays }
DELETE /api/admin/timetable/period/:id
GET  /api/admin/timetable/export?format=pdf|excel&class=&week=
GET  /api/admin/timetable/teacher-availability?teacherId=&day=&time=
POST /api/admin/timetable/break { day, startTime, endTime, label }

21 Attendance Management /admin/attendance ADM
GET  /api/admin/attendance?date=&class=&period=&status=
GET  /api/admin/attendance/summary?date=
GET  /api/admin/attendance/absent?date=&class=
GET  /api/admin/attendance/trend?days=30&class=
GET  /api/admin/attendance/heatmap?month=&year=&class=
GET  /api/admin/attendance/pending?date=
PUT  /api/admin/attendance/override { studentId, date, periods[], status, reason }
POST /api/admin/attendance/notify-parents { date, studentIds[], channels[], message }
POST /api/admin/attendance/remind-teacher { classId, date }
GET  /api/admin/attendance/export?date=&format=pdf|excel&class=
GET  /api/admin/attendance/class-wise?date=

22 Exam Manager /admin/exams ADM
GET  /api/admin/exams?year=&status=&search=&page=&size=
GET  /api/admin/exams/:id
GET  /api/admin/exams/:id/subjects
GET  /api/admin/exams/:id/schedule
GET  /api/admin/exams/:id/marks?class=&subject=
GET  /api/admin/exams/:id/results?class=
GET  /api/admin/exams/:id/hall-tickets?class=
POST /api/admin/exams { name, year, type, startDate, endDate }
PUT  /api/admin/exams/:id
DELETE /api/admin/exams/:id
POST /api/admin/exams/:id/subjects { subjectId, date, time, maxMarks, teacherId }
PUT  /api/admin/exams/:id/subjects/:subjectId
DELETE /api/admin/exams/:id/subjects/:subjectId
PUT  /api/admin/exams/:id/publish
PUT  /api/admin/exams/:id/marks { marks[] }
POST /api/admin/exams/:id/marks/upload { file }
GET  /api/admin/exams/:id/marks/template?format=excel
POST /api/admin/exams/:id/hall-tickets/generate { classes[] }
GET  /api/admin/exams/:id/hall-tickets/download?class=

23 Report Card Generator /admin/exams/:id/report-cards ADM
GET  /api/admin/exams/:id/report-cards?class=&student=
GET  /api/admin/exams/:id/report-cards/preview?studentId=&template=
GET  /api/admin/report-card-templates
POST /api/admin/exams/:id/report-cards/generate { classes[], template }
GET  /api/admin/exams/:id/report-cards/download?class=&format=pdf
GET  /api/admin/exams/:id/report-cards/bulk-download?classes[]
POST /api/admin/exams/:id/report-cards/send-sms { studentIds[] }
GET  /api/admin/exams/:id/rankings?class=

24 Promotion Workflow /admin/academics/promotion ADM
GET  /api/admin/promotion/years
GET  /api/admin/promotion/class-mapping?fromYear=&toYear=
GET  /api/admin/promotion/eligible-students?fromYear=&class=
GET  /api/admin/promotion/preview { fromYear, toYear, mappings[] }
POST /api/admin/promotion/run { fromYear, toYear, mappings[], confirm }
GET  /api/admin/promotion/history
GET  /api/admin/promotion/status/:jobId

25 Homework Manager /admin/homework ADM
GET  /api/admin/homework?class=&subject=&status=&from=&to=&page=&size=
GET  /api/admin/homework/:id
GET  /api/admin/homework/:id/submissions
POST /api/admin/homework { classId, subjectId, title, description, dueDate, attachments[] }
PUT  /api/admin/homework/:id
DELETE /api/admin/homework/:id
POST /api/admin/homework/:id/remind { studentIds[] }
GET  /api/admin/homework/export?class=&format=

26 Admission CRM /admin/admissions ADM
GET  /api/admin/admissions?status=&class=&source=&search=&page=&size=
GET  /api/admin/admissions/:id
POST /api/admin/admissions { studentName, parentName, classApplied, phone, email, source, notes }
PUT  /api/admin/admissions/:id
PUT  /api/admin/admissions/:id/status { status, reason }
PUT  /api/admin/admissions/:id/move { stage }
DELETE /api/admin/admissions/:id
POST /api/admin/admissions/:id/convert-to-student
POST /api/admin/admissions/:id/schedule-interview { date, time, interviewer }
POST /api/admin/admissions/:id/notes { note }
GET  /api/admin/admissions/sources (enum for filter)
GET  /api/admin/admissions/stats?year=
GET  /api/admin/admissions/export?format=csv|excel

27 ID Card Generator /admin/id-cards ADM
GET  /api/admin/id-cards/students?class=&section=&status=&page=&size=
GET  /api/admin/id-cards/templates
GET  /api/admin/id-cards/templates/:id/preview
POST /api/admin/id-cards/generate { studentIds[], templateId }
GET  /api/admin/id-cards/download?studentIds[]&template=&format=pdf
POST /api/admin/id-cards/bulk-generate { class=&section=&templateId }
GET  /api/admin/id-cards/bulk-download?jobId=

28 Circulars & Notices /admin/circulars ADM
GET  /api/admin/circulars?status=&category=&audience=&from=&to=&page=&size=
GET  /api/admin/circulars/:id
POST /api/admin/circulars { title, category, content, audience, attachments[], publishAt, notify }
PUT  /api/admin/circulars/:id
DELETE /api/admin/circulars/:id
PUT  /api/admin/circulars/:id/publish
PUT  /api/admin/circulars/:id/unpublish
POST /api/admin/circulars/:id/send-notification { channels[] }
GET  /api/admin/circulars/:id/read-receipts
GET  /api/admin/circulars/categories

29 Global Search /admin/search ADM
GET  /api/admin/search?q=&entities=&limit=
GET  /api/admin/search/students?q=&limit=
GET  /api/admin/search/teachers?q=&limit=
GET  /api/admin/search/transactions?q=&limit=
GET  /api/admin/search/recent
DELETE /api/admin/search/recent

30 Scheduled Reports /admin/reports/scheduled ADM
GET  /api/admin/reports/scheduled?page=&size=
GET  /api/admin/reports/scheduled/:id
GET  /api/admin/reports/types
POST /api/admin/reports/scheduled { name, type, schedule, format, recipients[] }
PUT  /api/admin/reports/scheduled/:id
DELETE /api/admin/reports/scheduled/:id
PUT  /api/admin/reports/scheduled/:id/toggle { enabled }
POST /api/admin/reports/scheduled/:id/run-now
GET  /api/admin/reports/scheduled/:id/history
GET  /api/admin/reports/scheduled/:id/history/:runId/download
```

---

## ADMIN FINANCE SCREENS

```
31 Finance Dashboard /admin/finance ADM
GET  /api/admin/finance/dashboard/stats?month=&year=
GET  /api/admin/finance/dashboard/collection-trend?months=6
GET  /api/admin/finance/dashboard/fee-breakdown?month=&year=
GET  /api/admin/finance/dashboard/overdue?page=&size=
GET  /api/admin/finance/dashboard/expense-chart?months=6
GET  /api/admin/finance/dashboard/alerts
GET  /api/admin/finance/dashboard/recent-transactions?limit=10

32 Fee Collection Screen /admin/finance/fee-collection ADM
GET  /api/admin/finance/students/:id/dues
GET  /api/admin/finance/students/:id/ledger
GET  /api/admin/finance/students/search?q=
POST /api/admin/finance/collect { studentId, amount, mode, reference, feeHeads[] }
GET  /api/admin/finance/receipts/:id
GET  /api/admin/finance/receipts/:id/download
POST /api/admin/finance/receipts/:id/send { channel }
GET  /api/admin/finance/payment-modes
GET  /api/admin/finance/collection-summary?date=
GET  /api/admin/finance/razorpay/create-order { studentId, amount }
POST /api/admin/finance/razorpay/verify { orderId, paymentId, signature }

33 Fee Structure Manager /admin/finance/fee-structure ADM
GET  /api/admin/finance/fee-structure?year=&class=
GET  /api/admin/finance/fee-structure/:id
GET  /api/admin/finance/fee-heads
POST /api/admin/finance/fee-structure { year, class, feeHeads[] }
PUT  /api/admin/finance/fee-structure/:id
DELETE /api/admin/finance/fee-structure/:id
POST /api/admin/finance/fee-structure/copy { fromYear, toYear, classes[] }
GET  /api/admin/finance/fee-structure/export?year=&format=

34 Late Fee Config /admin/finance/late-fee ADM
GET  /api/admin/finance/late-fee/rules
GET  /api/admin/finance/late-fee/rules/:id
POST /api/admin/finance/late-fee/rules { afterDays, type, amount, appliedTo }
PUT  /api/admin/finance/late-fee/rules/:id
DELETE /api/admin/finance/late-fee/rules/:id
POST /api/admin/finance/late-fee/apply-now { month, year, dryRun }
GET  /api/admin/finance/late-fee/preview?month=&year=

35 Discount & Scholarship /admin/finance/discounts ADM
GET  /api/admin/finance/discounts?type=&status=&page=&size=
GET  /api/admin/finance/discounts/:id
GET  /api/admin/finance/discount-types
POST /api/admin/finance/discounts { type, name, amount, percent, studentId, validFrom, validTo, proof }
PUT  /api/admin/finance/discounts/:id
DELETE /api/admin/finance/discounts/:id
PUT  /api/admin/finance/discounts/:id/approve { approvedBy }
PUT  /api/admin/finance/discounts/:id/reject { reason }
GET  /api/admin/finance/discounts/export?format=

36 Expense Manager /admin/finance/expenses ADM
GET  /api/admin/finance/expenses?month=&year=&category=&vendor=&page=&size=
GET  /api/admin/finance/expenses/:id
GET  /api/admin/finance/expense-categories
GET  /api/admin/finance/expenses/summary?month=&year=
GET  /api/admin/finance/expenses/chart?months=6
POST /api/admin/finance/expenses { category, vendor, amount, date, mode, description, attachments[] }
PUT  /api/admin/finance/expenses/:id
DELETE /api/admin/finance/expenses/:id
PUT  /api/admin/finance/expenses/:id/approve
GET  /api/admin/finance/expenses/export?month=&year=&format=

37 Vendor Manager /admin/finance/vendors ADM
GET  /api/admin/finance/vendors?category=&status=&search=&page=&size=
GET  /api/admin/finance/vendors/:id
GET  /api/admin/finance/vendors/:id/transactions
GET  /api/admin/finance/vendors/:id/outstanding
POST /api/admin/finance/vendors { name, category, phone, email, gstin, bank, ifsc, upi }
PUT  /api/admin/finance/vendors/:id
DELETE /api/admin/finance/vendors/:id
GET  /api/admin/finance/vendor-categories

38 Journal Entry UI /admin/finance/journal ADM
GET  /api/admin/finance/journal?from=&to=&status=&page=&size=
GET  /api/admin/finance/journal/:id
POST /api/admin/finance/journal { date, narration, lines[] }
PUT  /api/admin/finance/journal/:id
DELETE /api/admin/finance/journal/:id
PUT  /api/admin/finance/journal/:id/post
PUT  /api/admin/finance/journal/:id/reverse { reason }
GET  /api/admin/finance/journal/:id/pdf
GET  /api/admin/finance/journal/validate { lines[] }

39 Chart of Accounts /admin/finance/chart-of-accounts ADM
GET  /api/admin/finance/accounts
GET  /api/admin/finance/accounts/:id
GET  /api/admin/finance/accounts/:id/ledger?from=&to=
GET  /api/admin/finance/account-types
POST /api/admin/finance/accounts { name, code, type, parent, taxApplicable, description }
PUT  /api/admin/finance/accounts/:id
DELETE /api/admin/finance/accounts/:id
GET  /api/admin/finance/accounts/check-code?code=
GET  /api/admin/finance/accounts/tree

40 Financial Reports /admin/finance/reports ADM
GET  /api/admin/finance/reports/trial-balance?from=&to=
GET  /api/admin/finance/reports/profit-loss?from=&to=
GET  /api/admin/finance/reports/balance-sheet?asOf=
GET  /api/admin/finance/reports/fee-collection?from=&to=&class=&mode=
GET  /api/admin/finance/reports/student-ledger?studentId=&from=&to=
GET  /api/admin/finance/reports/defaulters?month=&year=&class=
GET  /api/admin/finance/reports/cash-flow?from=&to=
GET  /api/admin/finance/reports/expense-summary?from=&to=&category=
GET  /api/admin/finance/reports/export { reportType, params, format }

41 Tally Export UI /admin/finance/tally-export ADM
GET  /api/admin/finance/tally/preview?from=&to=&type=
GET  /api/admin/finance/tally/export?from=&to=&type= (downloads XML)
GET  /api/admin/finance/tally/history
GET  /api/admin/finance/tally/history/:id/download
POST /api/admin/finance/tally/export { from, to, type }

42 Salary Payouts /admin/finance/salary-payouts ADM
GET  /api/admin/finance/salary?month=&year=&department=&status=
GET  /api/admin/finance/salary/:staffId?month=&year=
POST /api/admin/finance/salary/generate { month, year }
PUT  /api/admin/finance/salary/approve { month, year, staffIds[] }
POST /api/admin/finance/salary/process { month, year, staffIds[] }
POST /api/admin/finance/salary/payslips/send { month, year, staffIds[] }
GET  /api/admin/finance/salary/payslip/:staffId?month=&year= (download)
GET  /api/admin/finance/salary/bank-file?month=&year= (download)
GET  /api/admin/finance/salary/summary?month=&year=

43 Vendor Payments /admin/finance/vendor-payments ADM
GET  /api/admin/finance/vendor-payments?status=&vendor=&from=&to=&page=&size=
GET  /api/admin/finance/vendor-payments/pending
GET  /api/admin/finance/vendor-payments/:id
POST /api/admin/finance/vendor-payments { vendorId, invoiceId, amount, mode, reference, date }
PUT  /api/admin/finance/vendor-payments/:id/mark-paid { utr, date }
GET  /api/admin/finance/vendor-payments/:id/receipt

44 Transport & Hostel Fee /admin/finance/transport-hostel-fees ADM
GET  /api/admin/finance/transport-fees?class=&route=&status=&page=&size=
GET  /api/admin/finance/hostel-fees?block=&status=&page=&size=
GET  /api/admin/finance/mess-bills?month=&year=&status=&page=&size=
POST /api/admin/finance/transport-fees/collect { studentId, amount, mode }
POST /api/admin/finance/hostel-fees/collect { studentId, amount, mode }
POST /api/admin/finance/mess-bills/collect { studentId, amount, mode }
GET  /api/admin/finance/transport-fees/summary?month=&year=
GET  /api/admin/finance/hostel-fees/summary?month=&year=
```

---

## ADMIN HOSTEL SCREENS

```
45 Warden Dashboard /admin/hostel ADM
GET  /api/admin/hostel/dashboard/stats
GET  /api/admin/hostel/dashboard/occupancy-by-block
GET  /api/admin/hostel/dashboard/alerts
GET  /api/admin/hostel/dashboard/attendance-summary?date=
GET  /api/admin/hostel/dashboard/recent-events?limit=10
GET  /api/admin/hostel/dashboard/leave-summary?date=

46 Hostel Infrastructure /admin/hostel/infrastructure ADM
GET  /api/admin/hostel/blocks
GET  /api/admin/hostel/blocks/:id
GET  /api/admin/hostel/blocks/:id/floors
GET  /api/admin/hostel/blocks/:id/rooms
GET  /api/admin/hostel/rooms/:id
GET  /api/admin/hostel/rooms/:id/beds
POST /api/admin/hostel/blocks { name, type, capacity, amenities[] }
PUT  /api/admin/hostel/blocks/:id
DELETE /api/admin/hostel/blocks/:id
POST /api/admin/hostel/blocks/:id/rooms { number, floor, type, capacity, amenities[] }
PUT  /api/admin/hostel/rooms/:id
DELETE /api/admin/hostel/rooms/:id
POST /api/admin/hostel/rooms/:id/beds { bedNumber, type }
PUT  /api/admin/hostel/beds/:id
GET  /api/admin/hostel/rooms/available?block=&type=
GET  /api/admin/hostel/infrastructure/stats

47 Room Allocation /admin/hostel/allocation ADM
GET  /api/admin/hostel/allocations?block=&status=&class=&search=&page=&size=
GET  /api/admin/hostel/allocations/:id
GET  /api/admin/hostel/students/:id/allocation
POST /api/admin/hostel/allocations { studentId, bedId, checkIn, fees, emergencyContact }
PUT  /api/admin/hostel/allocations/:id
PUT  /api/admin/hostel/allocations/:id/transfer { newBedId, reason, date }
PUT  /api/admin/hostel/allocations/:id/vacate { date, reason, clearance[] }
GET  /api/admin/hostel/allocations/:id/no-due-certificate
GET  /api/admin/hostel/allocations/:id/allotment-letter
GET  /api/admin/hostel/beds/available?block=&floor=&type=

48 Hostel Attendance /admin/hostel/attendance ADM
GET  /api/admin/hostel/attendance?date=&block=&floor=
GET  /api/admin/hostel/attendance/summary?date=&block=
GET  /api/admin/hostel/attendance/absent?date=&block=
POST /api/admin/hostel/attendance { date, session, records[] }
PUT  /api/admin/hostel/attendance/override { studentId, date, status, reason }
POST /api/admin/hostel/attendance/notify-parents { date, studentIds[] }
GET  /api/admin/hostel/attendance/history?studentId=&from=&to=
GET  /api/admin/hostel/attendance/export?date=&format=
GET  /api/admin/hostel/leave-requests?status=&date=
PUT  /api/admin/hostel/leave-requests/:id/approve
PUT  /api/admin/hostel/leave-requests/:id/reject { reason }

49 Mess Management /admin/hostel/mess ADM
GET  /api/admin/hostel/mess/dashboard?month=&year=
GET  /api/admin/hostel/mess/plans
GET  /api/admin/hostel/mess/plans/:id
POST /api/admin/hostel/mess/plans { name, mealTypes[], amount, description }
PUT  /api/admin/hostel/mess/plans/:id
DELETE /api/admin/hostel/mess/plans/:id
POST /api/admin/hostel/mess/plans/:id/assign { studentIds[] }
GET  /api/admin/hostel/mess/billing?month=&year=&status=
POST /api/admin/hostel/mess/billing/generate { month, year }
GET  /api/admin/hostel/mess/billing/:id
POST /api/admin/hostel/mess/payments/collect { studentId, amount, mode, month, year }
GET  /api/admin/hostel/mess/menu?week=
POST /api/admin/hostel/mess/menu { week, days[] }
GET  /api/admin/hostel/mess/attendance?date= (meal count)
```

---

## ADMIN TRANSPORT SCREENS

```
50 Fleet Dashboard /admin/transport ADM
GET  /api/admin/transport/dashboard/stats
GET  /api/admin/transport/dashboard/bus-status
GET  /api/admin/transport/dashboard/today-trips
GET  /api/admin/transport/dashboard/alerts
GET  /api/admin/transport/dashboard/student-count-by-route

51 Vehicle Manager /admin/transport/vehicles ADM
GET  /api/admin/transport/vehicles?status=&search=&page=&size=
GET  /api/admin/transport/vehicles/:id
GET  /api/admin/transport/vehicles/:id/maintenance-history
POST /api/admin/transport/vehicles { regNo, make, model, year, capacity, fuelType, insurance, puc }
PUT  /api/admin/transport/vehicles/:id
DELETE /api/admin/transport/vehicles/:id
POST /api/admin/transport/vehicles/:id/documents { files[] }
GET  /api/admin/transport/vehicles/expiring?days=30 (insurance/PUC alerts)
POST /api/admin/transport/vehicles/:id/maintenance { date, type, cost, notes }

52 Driver Manager /admin/transport/drivers ADM
GET  /api/admin/transport/drivers?status=&search=&page=&size=
GET  /api/admin/transport/drivers/:id
GET  /api/admin/transport/drivers/:id/attendance?month=&year=
POST /api/admin/transport/drivers { name, license, expiry, phone, address, emergency, experience }
PUT  /api/admin/transport/drivers/:id
DELETE /api/admin/transport/drivers/:id
POST /api/admin/transport/drivers/:id/documents { files[] }
PUT  /api/admin/transport/drivers/:id/assign-vehicle { vehicleId }
GET  /api/admin/transport/drivers/license-expiring?days=30

53 Route Manager /admin/transport/routes ADM
GET  /api/admin/transport/routes?search=&page=&size=
GET  /api/admin/transport/routes/:id
GET  /api/admin/transport/routes/:id/stops
GET  /api/admin/transport/routes/:id/students
POST /api/admin/transport/routes { name, vehicleId, driverId, stops[] }
PUT  /api/admin/transport/routes/:id
DELETE /api/admin/transport/routes/:id
POST /api/admin/transport/routes/:id/stops { name, lat, lng, arrivalTime, studentCount }
PUT  /api/admin/transport/routes/:id/stops/:stopId
DELETE /api/admin/transport/routes/:id/stops/:stopId
POST /api/admin/transport/routes/:id/stops/reorder { stopIds[] }

54 Student Transport Mapping /admin/transport/students ADM
GET  /api/admin/transport/assignments?route=&class=&search=&page=&size=
GET  /api/admin/transport/assignments/:studentId
PUT  /api/admin/transport/assignments/:studentId { routeId, stopId }
DELETE /api/admin/transport/assignments/:studentId
POST /api/admin/transport/assignments/bulk-import { file }
GET  /api/admin/transport/assignments/template?format=excel
GET  /api/admin/transport/assignments/unassigned?class=

55 Live Tracking Map /admin/transport/live ADM
GET  /api/admin/transport/live/buses
GET  /api/admin/transport/live/buses/:vehicleId
GET  /api/admin/transport/live/buses/:vehicleId/students
GET  /api/admin/transport/live/trips?date=
GET  /api/admin/transport/live/eta?vehicleId=&destination=
WS   /ws/transport/live (WebSocket for real-time GPS updates)

56 Trip Playback Map /admin/transport/playback ADM
GET  /api/admin/transport/trips?vehicleId=&date=
GET  /api/admin/transport/trips/:tripId
GET  /api/admin/transport/trips/:tripId/path
GET  /api/admin/transport/trips/:tripId/events (boarding/deboarding)
GET  /api/admin/transport/trips/:tripId/speed-log
GET  /api/admin/transport/vehicles?status= (for selector dropdown)

57 RFID Boarding Logs /admin/transport/rfid ADM
GET  /api/admin/transport/rfid?date=&bus=&route=&event=&page=&size=
GET  /api/admin/transport/rfid/:id
GET  /api/admin/transport/rfid/student/:studentId?from=&to=
GET  /api/admin/transport/rfid/unmatched?date= (unknown tags)
POST /api/admin/transport/rfid/tags { studentId, tagId }
PUT  /api/admin/transport/rfid/tags/:tagId { studentId }
DELETE /api/admin/transport/rfid/tags/:tagId
GET  /api/admin/transport/rfid/export?date=&format=
WS   /ws/transport/rfid (live boarding event feed)
```

---

## ADMIN HRMS SCREENS

```
58 HRMS Dashboard /admin/hrms ADM
GET  /api/admin/hrms/dashboard/stats
GET  /api/admin/hrms/dashboard/attendance-summary?date=
GET  /api/admin/hrms/dashboard/leave-summary?month=&year=
GET  /api/admin/hrms/dashboard/dept-headcount
GET  /api/admin/hrms/dashboard/payroll-summary?month=&year=
GET  /api/admin/hrms/dashboard/alerts
GET  /api/admin/hrms/dashboard/new-joiners?limit=5

59 Staff Onboarding Wizard /admin/hrms/staff/new ADM
POST /api/admin/hrms/staff/validate-step { step, data }
GET  /api/admin/hrms/departments
GET  /api/admin/hrms/designations?department=
GET  /api/admin/hrms/salary-components
GET  /api/admin/hrms/roles (for system role assignment)
GET  /api/admin/hrms/staff/check-employee-id?id=
POST /api/admin/hrms/staff { personal, employment, qualifications, salary, bank, documents, role }
PUT  /api/admin/hrms/staff/:id { personal, employment, qualifications, salary, bank, documents, role }
POST /api/admin/hrms/staff/:id/documents { files[] }
GET  /api/admin/hrms/staff/:id/documents/:docId/download

60 Staff List /admin/hrms/staff ADM
GET  /api/admin/hrms/staff?type=teaching|non-teaching&dept=&status=&search=&page=&size=
GET  /api/admin/hrms/staff/count?type=&dept=&status=
GET  /api/admin/hrms/staff/export?type=&dept=&format=
POST /api/admin/hrms/staff/bulk-action { action, ids[] }
POST /api/admin/hrms/staff/send-communication { ids[], subject, message, channels[] }
GET  /api/admin/hrms/departments (for filter)

61 Staff Attendance Logs /admin/hrms/attendance ADM
GET  /api/admin/hrms/attendance?date=&dept=&status=&search=&page=&size=
GET  /api/admin/hrms/attendance/summary?date=&dept=
GET  /api/admin/hrms/attendance/monthly?staffId=&month=&year=
GET  /api/admin/hrms/attendance/heatmap?staffId=&month=&year=
POST /api/admin/hrms/attendance/mark { staffId, date, inTime, outTime, reason }
PUT  /api/admin/hrms/attendance/:id { inTime, outTime, status, reason }
GET  /api/admin/hrms/attendance/export?month=&year=&dept=&format=
GET  /api/admin/hrms/attendance/late-report?month=&year=

62 Leave Approval Center /admin/hrms/leaves ADM
GET  /api/admin/hrms/leaves?status=pending|approved|rejected&dept=&from=&to=&page=&size=
GET  /api/admin/hrms/leaves/:id
GET  /api/admin/hrms/leaves/balances?staffId=&year=
GET  /api/admin/hrms/leave-types
PUT  /api/admin/hrms/leaves/:id/approve { comment }
PUT  /api/admin/hrms/leaves/:id/reject { reason }
PUT  /api/admin/hrms/leaves/:id/cancel { reason }
POST /api/admin/hrms/leaves/credit { staffId, type, days, reason }
GET  /api/admin/hrms/leaves/export?month=&year=&format=
GET  /api/admin/hrms/leaves/calendar?month=&year= (who is on leave)

63 Payroll Dashboard /admin/hrms/payroll ADM
GET  /api/admin/hrms/payroll?month=&year=&dept=&status=&page=&size=
GET  /api/admin/hrms/payroll/summary?month=&year=
GET  /api/admin/hrms/payroll/:staffId?month=&year=
GET  /api/admin/hrms/payroll/payslip/:staffId?month=&year= (download)
POST /api/admin/hrms/payroll/generate { month, year, dept }
PUT  /api/admin/hrms/payroll/approve { month, year, staffIds[] }
POST /api/admin/hrms/payroll/process { month, year, staffIds[] }
POST /api/admin/hrms/payroll/send-payslips { month, year, staffIds[] }
GET  /api/admin/hrms/payroll/bank-file?month=&year= (download)
POST /api/admin/hrms/payroll/advance { staffId, amount, reason, repaymentMonths }
GET  /api/admin/hrms/salary-structures?staffId=
PUT  /api/admin/hrms/salary-structures/:id { components[] }

64 Performance Review Board /admin/hrms/performance ADM
GET  /api/admin/hrms/performance/cycles
GET  /api/admin/hrms/performance/cycles/:id
GET  /api/admin/hrms/performance/cycles/:id/appraisals
GET  /api/admin/hrms/performance/appraisals/:id
POST /api/admin/hrms/performance/cycles { name, period, reviewers[], kpis[] }
PUT  /api/admin/hrms/performance/cycles/:id
DELETE /api/admin/hrms/performance/cycles/:id
PUT  /api/admin/hrms/performance/cycles/:id/launch
POST /api/admin/hrms/performance/appraisals/:id/submit { scores[], comments, goals[] }
PUT  /api/admin/hrms/performance/appraisals/:id/finalize { finalGrade, comments }
GET  /api/admin/hrms/performance/cycles/:id/export?format=

65 Compliance Dashboard /admin/hrms/compliance ADM
GET  /api/admin/hrms/compliance/summary?month=&year=
GET  /api/admin/hrms/compliance/pf?month=&year=
GET  /api/admin/hrms/compliance/esi?month=&year=
GET  /api/admin/hrms/compliance/tds?month=&year=
GET  /api/admin/hrms/compliance/pt?month=&year=
POST /api/admin/hrms/compliance/pf/generate-ecr { month, year }
POST /api/admin/hrms/compliance/esi/generate-return { month, year }
GET  /api/admin/hrms/compliance/pf/challan?month=&year= (download)
GET  /api/admin/hrms/compliance/esi/challan?month=&year= (download)
GET  /api/admin/hrms/compliance/tds/form16?year= (download)
GET  /api/admin/hrms/compliance/filing-history?year=
```

---

## TEACHER SCREENS

```
66 Teacher Dashboard /teacher/dashboard TCH
GET  /api/teacher/dashboard/stats
GET  /api/teacher/dashboard/today-schedule
GET  /api/teacher/dashboard/pending-actions
GET  /api/teacher/dashboard/recent-activity?limit=10
GET  /api/teacher/dashboard/alerts
GET  /api/teacher/dashboard/class-performance?class=
WS   /ws/teacher/dashboard (real-time notifications)

67 Quick Attendance /teacher/attendance/quick TCH
GET  /api/teacher/attendance/classes?date=
GET  /api/teacher/attendance/students?classId=&date=&period=
GET  /api/teacher/attendance/draft?classId=&date=&period=
POST /api/teacher/attendance/submit { classId, date, period, records[] }
PUT  /api/teacher/attendance/draft { classId, date, period, records[] }
GET  /api/teacher/attendance/status?classId=&date=
POST /api/teacher/attendance/submit-offline { records[], syncedAt }

68 Attendance Period View /teacher/attendance TCH
GET  /api/teacher/attendance/periods?date=
GET  /api/teacher/attendance/periods/:periodId/records
GET  /api/teacher/attendance/history?classId=&from=&to=
PUT  /api/teacher/attendance/periods/:periodId/records/:studentId { status, note }
GET  /api/teacher/attendance/export?classId=&month=&year=&format=

69 Teacher Timetable /teacher/timetable TCH
GET  /api/teacher/timetable?week=
GET  /api/teacher/timetable/today
GET  /api/teacher/timetable/class/:classId?week=
GET  /api/teacher/timetable/export?week=&format=pdf

70 My Students /teacher/students TCH
GET  /api/teacher/students?class=&search=&page=&size=
GET  /api/teacher/students/:id
GET  /api/teacher/students/:id/attendance?month=&year=
GET  /api/teacher/students/:id/marks?exam=
GET  /api/teacher/students/:id/homework-status
GET  /api/teacher/classes (classes assigned to this teacher)
POST /api/teacher/students/:id/contact-parent { message, channel }

71 Homework Management /teacher/homework TCH
GET  /api/teacher/homework?class=&subject=&status=&page=&size=
GET  /api/teacher/homework/:id
GET  /api/teacher/homework/:id/submissions
POST /api/teacher/homework { classId, subjectId, title, description, dueDate, attachments[] }
PUT  /api/teacher/homework/:id
DELETE /api/teacher/homework/:id
POST /api/teacher/homework/:id/remind { studentIds[] }
GET  /api/teacher/homework/:id/attachments/:fileId/download

72 Exam Papers & Marks Entry /teacher/exams TCH
GET  /api/teacher/exams?status=&year=
GET  /api/teacher/exams/:id
GET  /api/teacher/exams/:id/my-subjects
GET  /api/teacher/exams/:id/marks?classId=&subjectId=
PUT  /api/teacher/exams/:id/marks { classId, subjectId, marks[] }
POST /api/teacher/exams/:id/marks/save-draft { classId, subjectId, marks[] }
POST /api/teacher/exams/:id/marks/upload { classId, subjectId, file }
GET  /api/teacher/exams/:id/marks/template?format=excel
POST /api/teacher/exams/:id/papers { subjectId, file, description }
GET  /api/teacher/exams/:id/papers

73 Lesson Planner /teacher/lesson-planner TCH
GET  /api/teacher/lesson-plans?subject=&class=&status=
GET  /api/teacher/lesson-plans/:id
GET  /api/teacher/lesson-plans/chapters?subject=&class=
POST /api/teacher/lesson-plans { subject, class, chapter, lessons[] }
PUT  /api/teacher/lesson-plans/:id
DELETE /api/teacher/lesson-plans/:id
POST /api/teacher/lesson-plans/lessons { planId, title, objective, duration, content, resources[], method }
PUT  /api/teacher/lesson-plans/lessons/:id
PUT  /api/teacher/lesson-plans/lessons/:id/complete
GET  /api/teacher/lesson-plans/progress?subject=&class=

74 Teacher Diary /teacher/diary TCH
GET  /api/teacher/diary?from=&to=&class=
GET  /api/teacher/diary/:id
POST /api/teacher/diary { date, classId, note, visibility }
PUT  /api/teacher/diary/:id
DELETE /api/teacher/diary/:id
GET  /api/teacher/diary/calendar?month=&year=

75 Teacher Resources /teacher/resources TCH
GET  /api/teacher/resources?subject=&type=&search=&page=&size=
GET  /api/teacher/resources/school-shared?subject=&type=&page=&size=
GET  /api/teacher/resources/:id
POST /api/teacher/resources { title, subject, type, files[], description }
PUT  /api/teacher/resources/:id
DELETE /api/teacher/resources/:id
GET  /api/teacher/resources/:id/download
GET  /api/teacher/resources/file-types (enum)

76 Teacher Reports & Analytics /teacher/reports TCH
GET  /api/teacher/reports/attendance?classId=&month=&year=
GET  /api/teacher/reports/attendance/student-wise?classId=&month=&year=
GET  /api/teacher/reports/marks?examId=&subjectId=&classId=
GET  /api/teacher/reports/marks/distribution?examId=&subjectId=&classId=
GET  /api/teacher/reports/homework?classId=&from=&to=
GET  /api/teacher/reports/class-performance?classId=&term=
GET  /api/teacher/reports/export { type, params, format }

77 Substitute Management /teacher/substitute TCH
GET  /api/teacher/substitute/my-requests?status=&page=&size=
GET  /api/teacher/substitute/available-teachers?date=&period=
POST /api/teacher/substitute/request { dates[], periods[], reason, preferredSubstitute }
PUT  /api/teacher/substitute/requests/:id/cancel
GET  /api/teacher/substitute/availability
PUT  /api/teacher/substitute/availability { available }
GET  /api/teacher/substitute/pending-for-me (requests where I am substitute)
PUT  /api/teacher/substitute/requests/:id/accept
PUT  /api/teacher/substitute/requests/:id/decline { reason }

78 Teacher Profile & Settings /teacher/profile TCH
GET  /api/teacher/profile
PUT  /api/teacher/profile { name, phone, qualifications, specialization }
POST /api/teacher/profile/photo { file }
PUT  /api/teacher/settings/notifications { email, sms, push }
PUT  /api/teacher/settings/language { language }
PUT  /api/teacher/settings/theme { theme }
PUT  /api/teacher/settings/password { current, newPassword }
GET  /api/teacher/profile/sessions
DELETE /api/teacher/profile/sessions/:id
```

---

## STUDENT SCREENS

```
79 Student Dashboard /student/dashboard STU
GET  /api/student/dashboard/stats
GET  /api/student/dashboard/today-timetable
GET  /api/student/dashboard/pending-homework
GET  /api/student/dashboard/upcoming-exams?limit=5
GET  /api/student/dashboard/fee-status
GET  /api/student/dashboard/notices?limit=5
GET  /api/student/dashboard/alerts

80 My Attendance /student/attendance STU
GET  /api/student/attendance/summary?month=&year=
GET  /api/student/attendance/calendar?month=&year=
GET  /api/student/attendance/subject-wise?month=&year=
GET  /api/student/attendance/history?from=&to=

81 My Exams & Marks /student/exams STU
GET  /api/student/exams?status=upcoming|past
GET  /api/student/exams/:id
GET  /api/student/exams/:id/marks
GET  /api/student/exams/:id/hall-ticket
GET  /api/student/marks/subject-wise?year=
GET  /api/student/marks/trend?subject=&exams=

82 Report Card /student/report-card STU
GET  /api/student/report-cards?year=
GET  /api/student/report-cards/:examId
GET  /api/student/report-cards/:examId/download
GET  /api/student/report-cards/:examId/rank

83 My Fees /student/fees STU
GET  /api/student/fees/dues
GET  /api/student/fees/breakdown?month=&year=
GET  /api/student/fees/history?from=&to=&page=&size=
GET  /api/student/fees/receipts/:id/download
POST /api/student/fees/pay/initiate { amount, feeHeads[] }
POST /api/student/fees/pay/verify { orderId, paymentId, signature }

84 Student Profile /student/profile STU
GET  /api/student/profile
GET  /api/student/profile/documents
GET  /api/student/profile/documents/:id/download
PUT  /api/student/profile/password { current, newPassword }
GET  /api/student/profile/id-card/download
GET  /api/student/profile/sessions
DELETE /api/student/profile/sessions/:id
```

---

## PARENT SCREENS

```
85 Parent Dashboard /parent/dashboard PAR
GET  /api/parent/children
GET  /api/parent/dashboard/stats?childId=
GET  /api/parent/dashboard/alerts?childId=
GET  /api/parent/dashboard/notices?limit=5
GET  /api/parent/dashboard/homework?childId=&limit=5
GET  /api/parent/dashboard/upcoming-exams?childId=&limit=5
GET  /api/parent/dashboard/fee-status?childId=
GET  /api/parent/dashboard/bus-status?childId=

86 Parent Attendance View /parent/attendance PAR
GET  /api/parent/attendance/summary?childId=&month=&year=
GET  /api/parent/attendance/calendar?childId=&month=&year=
GET  /api/parent/attendance/subject-wise?childId=&month=&year=
GET  /api/parent/attendance/absences?childId=&from=&to=

87 Parent Results/Marks /parent/results PAR
GET  /api/parent/results/exams?childId=
GET  /api/parent/results/:examId?childId=
GET  /api/parent/results/:examId/download?childId=
GET  /api/parent/results/marks/subject-wise?childId=&year=

88 Parent Fee Portal /parent/fees PAR
GET  /api/parent/fees/dues?childId=
GET  /api/parent/fees/breakdown?childId=&month=&year=
GET  /api/parent/fees/history?childId=&from=&to=&page=&size=
GET  /api/parent/fees/receipts/:id/download
POST /api/parent/fees/pay/initiate { childId, amount, feeHeads[] }
POST /api/parent/fees/pay/verify { orderId, paymentId, signature }
GET  /api/parent/fees/pay/status?orderId=

89 Parent Homework View /parent/homework PAR
GET  /api/parent/homework?childId=&status=&subject=&page=&size=
GET  /api/parent/homework/:id?childId=
GET  /api/parent/homework/:id/attachments/:fileId/download

90 Circulars & Notices /parent/circulars PAR
GET  /api/parent/circulars?category=&from=&to=&page=&size=
GET  /api/parent/circulars/:id
POST /api/parent/circulars/:id/acknowledge
GET  /api/parent/circulars/unread-count

91 Parent Diary /parent/diary PAR
GET  /api/parent/diary?childId=&from=&to=&page=&size=
GET  /api/parent/diary/:id
POST /api/parent/diary/:id/acknowledge
GET  /api/parent/diary/unread-count?childId=

92 Parent Downloads /parent/downloads PAR
GET  /api/parent/downloads?category=&childId=&page=&size=
GET  /api/parent/downloads/categories
GET  /api/parent/downloads/:id/download
GET  /api/parent/downloads/report-cards?childId=
GET  /api/parent/downloads/syllabus?class=
GET  /api/parent/downloads/id-card?childId=

93 PTM Scheduler /parent/ptm PAR
GET  /api/parent/ptm/events?upcoming=true
GET  /api/parent/ptm/events/:id
GET  /api/parent/ptm/events/:id/slots?teacher=
POST /api/parent/ptm/bookings { eventId, teacherId, slotId, childId }
DELETE /api/parent/ptm/bookings/:id
GET  /api/parent/ptm/my-bookings?eventId=
GET  /api/parent/ptm/teachers?eventId= (available teachers)

94 Complaints / Grievance /parent/complaints PAR
GET  /api/parent/complaints?status=&category=&page=&size=
GET  /api/parent/complaints/:id
GET  /api/parent/complaints/categories
POST /api/parent/complaints { category, subject, description, attachments[], childId }
GET  /api/parent/complaints/:id/timeline
POST /api/parent/complaints/:id/reply { message }
PUT  /api/parent/complaints/:id/close
GET  /api/parent/complaints/:id/attachments/:fileId/download

95 Consent Form /parent/consent PAR
GET  /api/parent/consent?status=pending|signed&childId=
GET  /api/parent/consent/:id
POST /api/parent/consent/:id/sign { childId, response, signature, name }
GET  /api/parent/consent/signed?childId=

96 Leave Application /parent/leave PAR
GET  /api/parent/leave?childId=&status=&page=&size=
GET  /api/parent/leave/:id
POST /api/parent/leave { childId, from, to, type, reason, attachments[] }
DELETE /api/parent/leave/:id (cancel pending)
GET  /api/parent/leave/types
GET  /api/parent/leave/:id/attachments/:fileId/download

97 Bus Live Tracking /parent/transport PAR
GET  /api/parent/transport/my-bus?childId=
GET  /api/parent/transport/live?vehicleId=
GET  /api/parent/transport/route?childId=
GET  /api/parent/transport/eta?vehicleId=&destination=school
GET  /api/parent/transport/today-events?childId=&date=
GET  /api/parent/transport/history?childId=&from=&to=
WS   /ws/parent/transport?vehicleId= (real-time location)

98 Parent Profile /parent/profile PAR
GET  /api/parent/profile
PUT  /api/parent/profile { name, email, phone, address }
POST /api/parent/profile/photo { file }
GET  /api/parent/children
PUT  /api/parent/settings/notifications { sms, push, whatsapp }
PUT  /api/parent/settings/language { language }
PUT  /api/parent/profile/password { current, newPassword }
GET  /api/parent/profile/sessions
DELETE /api/parent/profile/sessions/:id
```

---

## SHARED UTILITY SCREENS

```
99 Notification Center /notifications ALL
GET  /api/notifications?read=&type=&page=&size=
GET  /api/notifications/unread-count
PUT  /api/notifications/:id/read
PUT  /api/notifications/mark-all-read
DELETE /api/notifications/:id
DELETE /api/notifications/clear-all
GET  /api/notifications/preferences
PUT  /api/notifications/preferences { email, sms, push, whatsapp }
WS   /ws/notifications (real-time notification stream)

100 File Uploader (component) ALL
POST /api/files/upload { file, context, entityType, entityId }
POST /api/files/upload/multiple { files[], context }
DELETE /api/files/:id
GET  /api/files/:id/download
GET  /api/files/:id/preview
GET  /api/files/presigned-url { fileName, fileType } (S3 direct upload)

101 Settings Page /settings ALL
GET  /api/settings/profile
PUT  /api/settings/profile { name, phone, email }
POST /api/settings/profile/photo { file }
PUT  /api/settings/password { current, newPassword }
GET  /api/settings/sessions
DELETE /api/settings/sessions/:id
DELETE /api/settings/sessions/others
GET  /api/settings/notifications
PUT  /api/settings/notifications { email, sms, push, whatsapp }
GET  /api/settings/appearance
PUT  /api/settings/appearance { theme, language, fontSize }
POST /api/settings/two-factor/enable
POST /api/settings/two-factor/verify { code }
DELETE /api/settings/two-factor/disable { code }

102 404 / 403 Error Pages ALL
GET  /api/auth/me (to verify session still valid on error pages)

103 Empty & Loading States (component) ALL
(No dedicated API — uses parent screen APIs with empty response handling)

104 Modal & Toast Patterns (component) ALL
(No dedicated API — event-driven UI layer, hooks into all screen APIs)
```

---

## SHARED APIS USED ACROSS MULTIPLE SCREENS

```
ACADEMIC YEAR (used everywhere)
GET  /api/admin/academic-years
GET  /api/admin/academic-years/current
POST /api/admin/academic-years { name, from, to, isCurrent }
PUT  /api/admin/academic-years/:id
PUT  /api/admin/academic-years/:id/set-current

CLASSES & SECTIONS (dropdowns)
GET  /api/admin/classes?year=
GET  /api/admin/sections?class=&year=

TEACHERS (dropdowns)
GET  /api/admin/teachers?search=&subject=&status=active

STUDENTS (dropdowns / search)
GET  /api/admin/students/search?q=&class=&limit=

GLOBAL FILE DOWNLOAD (all roles)
GET  /api/files/:id/download?token=

REAL-TIME WEBSOCKET CHANNELS
WS   /ws/dashboard          (admin/root stats refresh)
WS   /ws/notifications      (all roles — push events)
WS   /ws/transport/live     (GPS coordinates)
WS   /ws/transport/rfid     (boarding events)
WS   /ws/teacher/dashboard  (teacher alerts)

HEALTH / PING
GET  /api/health
GET  /api/health/ping
```