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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Financial Reports</h1>
                <Button icon={<Download size={16} />}>Export PDF</Button>
            </div>

            <Card className="mb-6">
                <div className="flex items-center space-x-4">
                    <Select value={reportType} onChange={setReportType} style={{ width: 200 }}>
                        <Option value="pnl">Profit & Loss</Option>
                        <Option value="balancesheet">Balance Sheet</Option>
                    </Select>
                    <DatePicker.RangePicker />
                    <Button type="primary" onClick={fetchReport}>Generate</Button>
                </div>
            </Card>

            <Card loading={loading}>
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
