import React, { useEffect, useState } from 'react';
import { Drawer, Spin, Table, Progress, Button } from 'antd';
import { UserPlus, Download, Users } from 'lucide-react';
import api from '../../../api/axios';
import { useExport } from '../../../hooks/useExport';

const StudentAnalyticsDrawer = ({ isOpen, onClose, branchId }) => {
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
            const url = branchId ? `/dashboard/students/analytics?branchId=${branchId}` : `/dashboard/students/analytics`;
            const response = await api.get(url);
            setData(response.data.data);
        } catch (error) {
            console.error('Failed to fetch student analytics', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        exportData('csv', 'students', branchId);
    };

    const renderContent = () => {
        if (loading || !data) {
            return <div className="flex justify-center items-center h-full"><Spin size="large" /></div>;
        }

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider mb-1">Active Students</p>
                        <p className="text-2xl font-black text-blue-800">{data.activeStudents?.toLocaleString()}</p>
                    </div>
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-wider mb-1">Inactive / Dropped</p>
                        <p className="text-2xl font-black text-rose-800">{data.inactiveStudents}</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-wider mb-1">Transfer Requests</p>
                        <p className="text-2xl font-black text-amber-800">{data.transferRequests}</p>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-black text-slate-800 mb-3">Gender Distribution</h4>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                <span>Boys ({data.genderDistribution?.Male})</span>
                                <span>Girls ({data.genderDistribution?.Female})</span>
                            </div>
                            <Progress 
                                percent={Math.round((data.genderDistribution?.Male / (data.genderDistribution?.Male + data.genderDistribution?.Female)) * 100)} 
                                showInfo={false} 
                                strokeColor="#3b82f6" 
                                trailColor="#ec4899" 
                                className="m-0"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-black text-slate-800 mb-3">Dropout Trends (Last 3 Months)</h4>
                    <Table 
                        dataSource={data.dropoutTrends} 
                        rowKey="month"
                        pagination={false}
                        size="small"
                        columns={[
                            { title: 'Month', dataIndex: 'month', key: 'month' },
                            { title: 'Dropouts', dataIndex: 'dropouts', key: 'dropouts' }
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
                        <Users size={20} className="text-blue-600" />
                        <span className="font-black text-slate-800">Student Analytics</span>
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

export default StudentAnalyticsDrawer;
