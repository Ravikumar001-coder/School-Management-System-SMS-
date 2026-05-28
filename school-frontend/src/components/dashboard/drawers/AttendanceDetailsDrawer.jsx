import React, { useEffect, useState } from 'react';
import { Drawer, Spin, Table, Button } from 'antd';
import { Users, Download, Calendar } from 'lucide-react';
import api from '../../../api/axios';
import { useExport } from '../../../hooks/useExport';

const AttendanceDetailsDrawer = ({ isOpen, onClose, date, branchId }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const { exportData, isExporting } = useExport();

    useEffect(() => {
        if (isOpen && date) {
            fetchData();
        }
    }, [isOpen, date, branchId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let url = `/dashboard/attendance/details?date=${date}`;
            if (branchId) url += `&branchId=${branchId}`;
            const response = await api.get(url);
            setData(response.data.data);
        } catch (error) {
            console.error('Failed to fetch attendance details', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        exportData('csv', 'attendance', branchId);
    };

    const renderContent = () => {
        if (loading || !data) {
            return <div className="flex justify-center items-center h-full"><Spin size="large" /></div>;
        }

        const classData = Object.entries(data.attendanceByClass || {}).map(([key, value]) => ({
            class: key,
            attendance: value
        }));

        return (
            <div className="space-y-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                    <Calendar size={16} className="text-slate-500" />
                    <span className="text-sm font-bold text-slate-700">Detailed Report for {date}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-wider mb-1">Absent Students</p>
                        <p className="text-2xl font-black text-rose-800">{data.absentStudents}</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-wider mb-1">Late Arrivals</p>
                        <p className="text-2xl font-black text-amber-800">{data.lateArrivals}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 col-span-2">
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider mb-1">Leave Requests</p>
                        <p className="text-2xl font-black text-blue-800">{data.leaveRequests}</p>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-black text-slate-800 mb-3">Attendance By Class</h4>
                    <Table 
                        dataSource={classData} 
                        rowKey="class"
                        pagination={false}
                        size="small"
                        columns={[
                            { title: 'Class', dataIndex: 'class', key: 'class' },
                            { title: 'Attendance %', dataIndex: 'attendance', key: 'attendance' }
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
                        <Users size={20} className="text-purple-600" />
                        <span className="font-black text-slate-800">Attendance Report</span>
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

export default AttendanceDetailsDrawer;
