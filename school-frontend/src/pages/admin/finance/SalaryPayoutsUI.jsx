import React, { useState } from 'react';
import { Card, Table, Button, Tag, message } from 'antd';
import { Download, CreditCard } from 'lucide-react';

const SalaryPayoutsUI = () => {
    // Mocked data for UI as we didn't build a full HRMS->Finance bank transfer API yet.
    // In a real scenario, we'd fetch this from the backend.
    const [payouts, setPayouts] = useState([
        { id: 1, employee: 'Ravi Kumar', netSalary: 42000, bank: 'HDFC Bank', status: 'Pending' },
        { id: 2, employee: 'Neha Sharma', netSalary: 38200, bank: 'SBI', status: 'Transferred' },
        { id: 3, employee: 'Amit Verma', netSalary: 35000, bank: 'PNB', status: 'Failed' }
    ]);
    const [loading, setLoading] = useState(false);

    const handleMarkAsPaid = (id) => {
        setLoading(true);
        setTimeout(() => {
            setPayouts(payouts.map(p => p.id === id ? { ...p, status: 'Transferred' } : p));
            message.success('Salary marked as paid. Journal entry automatically posted.');
            setLoading(false);
        }, 1000);
    };

    const columns = [
        { title: 'Employee Name', dataIndex: 'employee' },
        { title: 'Net Salary (₹)', dataIndex: 'netSalary' },
        { title: 'Bank', dataIndex: 'bank' },
        {
            title: 'Transfer Status',
            dataIndex: 'status',
            render: (s) => (
                <Tag color={s === 'Transferred' ? 'green' : s === 'Failed' ? 'red' : 'orange'}>
                    {s}
                </Tag>
            )
        },
        {
            title: 'Action',
            render: (_, r) => r.status !== 'Transferred' && (
                <Button size="small" type="primary" onClick={() => handleMarkAsPaid(r.id)}>
                    Mark Paid
                </Button>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Salary Payouts</h1>
                <div className="space-x-3">
                    <Button icon={<Download size={16} />}>Bank Export (CSV)</Button>
                    <Button type="primary" icon={<CreditCard size={16} />}>Bulk Transfer</Button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
                <Card className="bg-orange-50 border-orange-200">
                    <div className="text-orange-600 text-sm font-bold">Pending Salary</div>
                    <div className="text-2xl font-bold text-gray-800">₹42,000</div>
                </Card>
                <Card className="bg-green-50 border-green-200">
                    <div className="text-green-600 text-sm font-bold">Transferred</div>
                    <div className="text-2xl font-bold text-gray-800">₹38,200</div>
                </Card>
                <Card className="bg-red-50 border-red-200">
                    <div className="text-red-600 text-sm font-bold">Failed Transfers</div>
                    <div className="text-2xl font-bold text-gray-800">₹35,000</div>
                </Card>
            </div>

            <Card>
                <Table columns={columns} dataSource={payouts} rowKey="id" loading={loading} />
            </Card>
        </div>
    );
};

export default SalaryPayoutsUI;
