import React, { useState } from 'react';
import { Card, Button, Table, Tag, message } from 'antd';
import { IndianRupee, Download } from 'lucide-react';

const ParentFeePortal = () => {
  const [loading, setLoading] = useState(false);

  // MOCK Data
  const invoices = [
    { key: 1, month: 'April 2024', amount: 5000, status: 'PAID', dueDate: '2024-04-10' },
    { key: 2, month: 'May 2024', amount: 5000, status: 'PENDING', dueDate: '2024-05-10' },
  ];

  const handlePayment = () => {
    setLoading(true);
    // Mock Razorpay integration flow
    setTimeout(() => {
      setLoading(false);
      message.success('Redirecting to Razorpay Secure Gateway...');
    }, 1000);
  };

  const columns = [
    { title: 'Billing Month', dataIndex: 'month', key: 'month' },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
    { 
      title: 'Amount', 
      dataIndex: 'amount', 
      key: 'amount',
      render: (val) => `₹${val}`
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'PAID' ? 'green' : 'volcano'}>{status}</Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        record.status === 'PENDING' ? (
          <Button type="primary" onClick={handlePayment} loading={loading}>
            Pay Now
          </Button>
        ) : (
          <Button icon={<Download className="w-4 h-4 mr-1"/>} type="link">
            Receipt
          </Button>
        )
      )
    }
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Card title="Fee Payment Portal" className="shadow-sm max-w-4xl mx-auto">
        <div className="mb-6 p-4 bg-blue-50 rounded-lg flex justify-between items-center border border-blue-100">
          <div>
            <p className="text-gray-500 text-sm">Total Outstanding</p>
            <h2 className="text-3xl font-bold text-blue-700 flex items-center">
              <IndianRupee className="w-6 h-6 mr-1" /> 5,000
            </h2>
          </div>
          <Button type="primary" size="large" onClick={handlePayment}>
            Pay Full Amount
          </Button>
        </div>

        <h3 className="text-lg font-semibold mb-4 text-gray-700">Invoice History</h3>
        <Table columns={columns} dataSource={invoices} pagination={false} />
      </Card>
    </div>
  );
};

export default ParentFeePortal;
