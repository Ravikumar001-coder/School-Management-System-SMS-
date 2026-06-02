import React, { useState, useEffect } from 'react';
import { Card, Table, Button, DatePicker, message, Select } from 'antd';
import { Download } from 'lucide-react';
import { financeApi } from '../../../api/financeApi';
import api from '../../../api/axios';

const { Option } = Select;

const FinancialReportsUI = () => {
    const [reportType, setReportType] = useState('pnl');
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReport();
    }, [reportType]);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const endpoint = reportType === 'pnl' ? '/finance/reports/pnl/1' : '/finance/reports/balancesheet/1';
            const res = await api.get(endpoint);
            if (res.data?.success) {
                setReportData(res.data.data);
            }
        } catch (error) {
            message.error('Failed to load report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Financial Reports</h1>
                <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-[16px] min-h-[44px] font-bold text-sm hover:bg-gray-200 transition-all flex items-center gap-2"><Download size={16} /> Export PDF</button>
            </div>

            <Card className="mb-6 rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9]">
                <div className="flex items-center space-x-4">
                    <Select value={reportType} onChange={setReportType} style={{ width: 200 }}>
                        <Option value="pnl">Profit & Loss</Option>
                        <Option value="balancesheet">Balance Sheet</Option>
                    </Select>
                    <DatePicker.RangePicker />
                    <button className="bg-[#1E40AF] text-white px-6 py-3 rounded-[16px] min-h-[44px] font-bold text-sm shadow-md transition-all hover:bg-[#1E3A8A]" onClick={fetchReport}>Generate</button>
                </div>
            </Card>

            <Card loading={loading} className="rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9]">
                {reportType === 'pnl' && reportData && (
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-bold border-b pb-2 mb-4 text-green-700">Income</h3>
                            {reportData.income?.map(acc => (
                                <div key={acc.id} className="flex justify-between py-1 border-b border-gray-100">
                                    <span>{acc.accountName}</span>
                                    <span>₹{acc.openingBalance}</span>
                                </div>
                            ))}
                            {reportData.income?.length === 0 && <p className="text-gray-400">No income records found</p>}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold border-b pb-2 mb-4 text-red-700">Expenses</h3>
                            {reportData.expense?.map(acc => (
                                <div key={acc.id} className="flex justify-between py-1 border-b border-gray-100">
                                    <span>{acc.accountName}</span>
                                    <span>₹{acc.openingBalance}</span>
                                </div>
                            ))}
                            {reportData.expense?.length === 0 && <p className="text-gray-400">No expense records found</p>}
                        </div>
                    </div>
                )}

                {reportType === 'balancesheet' && reportData && (
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-bold border-b pb-2 mb-4 text-blue-700">Liabilities & Equity</h3>
                            <div className="font-semibold mt-2">Equity</div>
                            {reportData.equity?.map(acc => (
                                <div key={acc.id} className="flex justify-between py-1 ml-4 border-b border-gray-100">
                                    <span>{acc.accountName}</span>
                                    <span>₹{acc.openingBalance}</span>
                                </div>
                            ))}
                            
                            <div className="font-semibold mt-4">Liabilities</div>
                            {reportData.liabilities?.map(acc => (
                                <div key={acc.id} className="flex justify-between py-1 ml-4 border-b border-gray-100">
                                    <span>{acc.accountName}</span>
                                    <span>₹{acc.openingBalance}</span>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold border-b pb-2 mb-4 text-green-700">Assets</h3>
                            {reportData.assets?.map(acc => (
                                <div key={acc.id} className="flex justify-between py-1 border-b border-gray-100">
                                    <span>{acc.accountName}</span>
                                    <span>₹{acc.openingBalance}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default FinancialReportsUI;
