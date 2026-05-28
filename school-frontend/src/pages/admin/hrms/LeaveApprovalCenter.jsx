import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tabs, Progress, message } from 'antd';
import { Check, X, Calendar as CalendarIcon, Clock, AlertTriangle, Lock, UserX, UserCheck, Download } from 'lucide-react';
import { hrmsService } from '../../../services/hrmsService';

const LeaveApprovalCenter = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingLeaves = async () => {
    try {
      setLoading(true);
      const res = await hrmsService.getPendingLeaves();
      if (res.success) {
        setPendingRequests(res.data);
      }
    } catch (e) {
      console.error(e);
      message.error("Failed to load pending leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      const res = await hrmsService.approveLeave(id, 1); // Mock approver ID = 1
      if (res.success) {
        message.success("Leave approved");
        fetchPendingLeaves();
      } else {
        message.error("Failed to approve leave");
      }
    } catch (e) {
      message.error("Error approving leave");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setLoading(true);
      const res = await hrmsService.rejectLeave(id, 1, "Rejected by Admin"); 
      if (res.success) {
        message.success("Leave rejected");
        fetchPendingLeaves();
      } else {
        message.error("Failed to reject leave");
      }
    } catch (e) {
      message.error("Error rejecting leave");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      title: 'Employee', 
      render: (_, record) => (
        <div className="flex items-center">
            <div>
                <p className="font-semibold text-gray-800 text-sm">{record.staff?.firstName} {record.staff?.lastName}</p>
                <p className="text-xs text-gray-500">{record.staff?.employeeCode}</p>
            </div>
        </div>
      )
    },
    { title: 'Leave Type', render: (_, r) => <span className="font-medium text-gray-700 text-sm">{r.leaveType?.leaveCode}</span> },
    { title: 'Date Range', render: (_, r) => <span className="text-xs text-gray-600">{r.startDate} to {r.endDate}</span> },
    { title: 'Days', dataIndex: 'totalDays', render: (val) => <span className="text-sm font-semibold">{val}</span> },
    { title: 'Reason', dataIndex: 'reason', render: (val) => <span className="text-xs text-gray-600 truncate block w-32" title={val}>{val}</span> },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      render: (status) => {
        if (status === 'APPROVED') return <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium border border-green-200">Approved</span>;
        if (status === 'PENDING') return <span className="text-orange-500 bg-orange-50 px-2 py-1 rounded text-xs font-medium border border-orange-200">Pending</span>;
        if (status === 'REJECTED') return <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-medium border border-red-200">Rejected</span>;
      }
    },
    { 
      title: 'Actions', 
      render: (_, record) => (
         <div className="flex space-x-1">
             <Button size="small" shape="circle" icon={<Check className="w-3 h-3 text-green-600" />} className="border-green-200 hover:bg-green-50" onClick={() => handleApprove(record.id)} />
             <Button size="small" shape="circle" icon={<X className="w-3 h-3 text-red-600" />} className="border-red-200 hover:bg-red-50" onClick={() => handleReject(record.id)} />
         </div>
      ) 
    }
  ];

  return (
    <div className="p-6 bg-[#f4f7fe] min-h-screen">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leave Management Center</h1>
          <p className="text-sm text-gray-500">HRMS {'>'} Leave Management</p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card styles={{ body: { padding: '16px' } }} className="shadow-sm border border-blue-100 rounded-xl">
            <div className="flex justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-blue-600 text-center mb-1">{pendingRequests.length}</h3>
                    <p className="text-xs font-semibold text-gray-700 text-center">Pending Approvals</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg h-10"><Clock className="w-5 h-5 text-blue-500" /></div>
            </div>
        </Card>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Left Column: Calendar & Availability */}
        <div className="w-full xl:w-1/4 space-y-6">
            <Card title="Department Availability" variant="borderless" className="shadow-sm rounded-xl" styles={{ header: { borderBottom: 0, paddingBottom: 0, fontWeight: 'bold' } }}>
                <div className="space-y-4 mt-4">
                    <div>
                        <div className="flex justify-between text-xs mb-1"><span>Science</span><span>70%</span></div>
                        <Progress percent={70} showInfo={false} strokeColor="#1d4ed8" size="small" />
                    </div>
                </div>
            </Card>
        </div>

        {/* Center Column: Table */}
        <div className="w-full xl:w-3/4">
            <Card title="Leave Requests" variant="borderless" className="shadow-sm rounded-xl h-full" styles={{ header: { borderBottom: 0, paddingBottom: 0, fontWeight: 'bold' } }}>
                <Tabs
                  defaultActiveKey="1"
                  className="mt-2"
                  items={[
                    {
                      key: '1',
                      label: `Pending (${pendingRequests.length})`,
                      children: (
                        <Table
                          columns={columns}
                          dataSource={pendingRequests}
                          rowKey="id"
                          pagination={false}
                          size="small"
                          className="mt-2"
                          loading={loading}
                        />
                      ),
                    },
                  ]}
                />
            </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaveApprovalCenter;
