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
                <button className="bg-[#1E40AF] text-white px-4 py-2 rounded-[16px] min-h-[36px] font-bold text-xs shadow-md transition-all hover:bg-[#1E3A8A]" onClick={() => handleMarkAsPaid(r.id)}>
                    Mark Paid
                </button>
            )
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Salary Payouts</h1>
                <div className="flex">
                    <button className="px-6 py-3 min-h-[44px] rounded-[16px] bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-all flex items-center gap-2 mr-2"><Download size={16} /> Bank Export (CSV)</button>
                    <button className="bg-[#1E40AF] text-white px-6 py-3 rounded-[16px] min-h-[44px] font-bold text-sm shadow-md transition-all flex items-center gap-2 hover:bg-[#1E3A8A]"><CreditCard size={16} /> Bulk Transfer</button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
                <Card className="bg-orange-50 border-orange-200 rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)]">
                    <div className="text-orange-600 text-sm font-bold">Pending Salary</div>
                    <div className="text-2xl font-bold text-gray-800">₹42,000</div>
                </Card>
                <Card className="bg-green-50 border-green-200 rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)]">
                    <div className="text-green-600 text-sm font-bold">Transferred</div>
                    <div className="text-2xl font-bold text-gray-800">₹38,200</div>
                </Card>
                <Card className="bg-red-50 border-red-200 rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)]">
                    <div className="text-red-600 text-sm font-bold">Failed Transfers</div>
                    <div className="text-2xl font-bold text-gray-800">₹35,000</div>
                </Card>
            </div>

            <Card className="rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9]">
                <Table columns={columns} dataSource={payouts} rowKey="id" loading={loading} />
            </Card>
        </div>
    );
};

export default SalaryPayoutsUI;
