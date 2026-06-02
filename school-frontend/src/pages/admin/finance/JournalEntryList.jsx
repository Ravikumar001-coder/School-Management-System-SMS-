// src/pages/admin/finance/JournalEntryList.jsx
import React, { useEffect, useState } from 'react';
import { Table, Tag, Card, Statistic, Row, Col, Button, message } from 'antd';
import { Search } from 'lucide-react';
import { financeApi } from '../../../api/financeApi';

const JournalEntryList = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await financeApi.getAllJournalEntries(1); // branch ID placeholder
      if (res.success) {
        setEntries(res.data.map(item => ({ ...item, key: item.id })));
      }
    } catch (e) {
      message.error('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Voucher No.', dataIndex: 'voucherNumber', key: 'voucherNumber' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: status => <Tag color={status === 'POSTED' ? 'green' : 'orange'}>{status}</Tag> },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6 animate-fade-in">
      <Card className="mb-6 rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9]" title="Journal Entries">
        <Table columns={columns} dataSource={entries} loading={loading} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default JournalEntryList;
