import React, { useEffect, useState } from 'react';
import { Drawer, Spin, Table, Button } from 'antd';
import { Landmark, Download, IndianRupee } from 'lucide-react';
import api from '../../../api/axios';
import { useExport } from '../../../hooks/useExport';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const FinanceAnalyticsDrawer = ({ isOpen, onClose, branchId }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const { exportData, isExporting } = useExport();

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, branchId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const url = branchId ? `/dashboard/finance/analytics?branchId=${branchId}` : `/dashboard/finance/analytics`;
            const response = await api.get(url);
            setData(response.data.data);
        } catch (error) {
            console.error('Failed to fetch finance analytics', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        exportData('csv', 'finance', branchId);
    };

    const renderContent = () => {
        if (loading || !data) {
            return <div className="flex justify-center items-center h-full"><Spin size="large" /></div>;
        }

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-wider mb-1">Fees Collected (Today)</p>
                        <p className="text-xl font-black text-emerald-800">₹ {data.feesCollectedToday?.toLocaleString()}</p>
                    </div>
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-wider mb-1">Pending Dues</p>
                        <p className="text-xl font-black text-rose-800">₹ {data.pendingDues?.toLocaleString()}</p>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
                        <IndianRupee size={16} className="text-slate-500" />
                        Collection Trend (Last 7 Days)
                    </h4>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.collectionTrend} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                                <YAxis tick={{fontSize: 10}} tickFormatter={(v) => `₹${v/1000}k`} tickLine={false} axisLine={false} />
                                <Tooltip formatter={(val) => `₹ ${val}`} labelStyle={{color: 'black'}} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorAmount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-black text-slate-800 mb-3">Top Outstanding Classes</h4>
                    <Table 
                        dataSource={data.topOutstandingClasses} 
                        rowKey="class"
                        pagination={false}
                        size="small"
                        columns={[
                            { title: 'Class', dataIndex: 'class', key: 'class' },
                            { title: 'Pending Amount (₹)', dataIndex: 'amount', key: 'amount', render: (val) => val.toLocaleString() }
                        ]}
                    />
                </div>
            </div>
        );
    };

    return (
        <Drawer
            title={
                <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-2">
                        <Landmark size={20} className="text-emerald-600" />
                        <span className="font-black text-slate-800">Financial Analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button 
                            icon={<Download size={14} />} 
                            size="small" 
                            onClick={handleExport}
                            loading={isExporting}
                            className="text-xs font-bold"
                        >
                            Export
                        </Button>
                    </div>
                </div>
            }
            placement="right"
            width={450}
            onClose={onClose}
            open={isOpen}
            bodyStyle={{ padding: '24px' }}
        >
            {renderContent()}
        </Drawer>
    );
};

export default FinanceAnalyticsDrawer;
