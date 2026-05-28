import React, { useState, useEffect } from 'react';
import { Card, Table, DatePicker, Button, message, Tag, Space } from 'antd';
import { Clock, RefreshCw } from 'lucide-react';
import { hrmsApi } from '../../../api/hrmsApi';
import dayjs from 'dayjs';

const StaffAttendanceLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    fetchLogs(selectedDate.format('YYYY-MM-DD'));
  }, [selectedDate]);

  const fetchLogs = async (dateStr) => {
    try {
      setLoading(true);
      const res = await hrmsApi.getAttendanceLogs(dateStr);
      if (res.success) {
        setLogs(res.data.map(item => ({ ...item, key: item.id })));
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to load attendance logs');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      // Simulating a sync for a random staff ID for demonstration
      await hrmsApi.syncAttendance(1, selectedDate.format('YYYY-MM-DD'), '08:55:00', '17:10:00');
      message.success('Biometric device synced');
      fetchLogs(selectedDate.format('YYYY-MM-DD'));
    } catch (error) {
      console.error(error);
      message.error('Failed to sync biometric data');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Staff', render: (_, r) => `${r.staff.firstName} ${r.staff.lastName}` },
    { title: 'Check In', dataIndex: 'checkIn' },
    { title: 'Check Out', dataIndex: 'checkOut' },
    { title: 'Total Hours', dataIndex: 'totalHours' },
    { title: 'Late (Min)', dataIndex: 'lateMinutes', render: (v) => v > 0 ? <span className="text-red-500">{v}</span> : v },
    { 
      title: 'Status', 
      dataIndex: 'attendanceStatus',
      render: (s) => (
        <Tag color={s === 'PRESENT' ? 'green' : s === 'ABSENT' ? 'red' : 'orange'}>{s}</Tag>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Biometric Attendance Logs</h1>
        <Space>
          <DatePicker value={selectedDate} onChange={setSelectedDate} />
          <Button type="primary" onClick={handleSync} loading={loading} icon={<RefreshCw size={16} />}>
            Force Sync
          </Button>
        </Space>
      </div>
      
      <Card>
        <Table columns={columns} dataSource={logs} loading={loading} />
      </Card>
    </div>
  );
};

export default StaffAttendanceLogs;
