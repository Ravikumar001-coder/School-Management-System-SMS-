import React, { useState, useEffect } from 'react';
import { Card, Statistic, Table, Button, Select, Tag, Input, Badge, Avatar, Pagination, Dropdown, Form, message } from 'antd';
import { 
  IndianRupee, Download, CheckCircle, Search, Filter, MoreVertical, FileText, Send, Lock, Mail
} from 'lucide-react';
import { hrmsService } from '../../../services/hrmsService';

const { Option } = Select;

const PayrollDashboard = () => {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ gross: 0, deductions: 0, net: 0, count: 0 });

  const fetchPayrollRuns = async () => {
    try {
      setLoading(true);
      const res = await hrmsService.getAllPayrollRuns();
      if (res.success && res.data.content) {
        setRuns(res.data.content);
        // Calculate basic summary from runs for demo
        let g = 0, d = 0, n = 0, c = 0;
        res.data.content.forEach(r => {
          g += r.totalGross || 0;
          d += r.totalDeductions || 0;
          n += r.totalNet || 0;
          c += r.totalStaff || 0;
        });
        setSummary({ gross: g, deductions: d, net: n, count: c });
      }
    } catch (e) {
      console.error(e);
      message.error("Failed to load payroll data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollRuns();
  }, []);

  const handleRunPayroll = async () => {
    try {
      setLoading(true);
      const res = await hrmsService.runPayroll(10, 2024, 1);
      if (res.success) {
        message.success("Payroll run successfully!");
        fetchPayrollRuns();
      } else {
        message.error("Failed to run payroll");
      }
    } catch (e) {
      message.error("Error running payroll");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      title: 'Month / Year', 
      render: (_, record) => (
        <span className="font-semibold text-gray-800 text-sm">{record.payrollMonth} / {record.payrollYear}</span>
      )
    },
    { title: 'Total Staff', dataIndex: 'totalStaff', render: (val) => <span className="text-gray-600 text-sm">{val}</span> },
    { title: 'Gross (₹)', dataIndex: 'totalGross', render: (val) => <span className="text-sm">{val?.toLocaleString()}</span> },
    { title: 'Deductions (₹)', dataIndex: 'totalDeductions', render: (val) => <span className="text-red-500 text-sm">{val?.toLocaleString()}</span> },
    { title: 'Net Pay (₹)', dataIndex: 'totalNet', render: (val) => <span className="font-semibold text-gray-800 text-sm">{val?.toLocaleString()}</span> },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      render: (status) => {
        if (status === 'LOCKED') return <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium border border-green-200">Locked</span>;
        if (status === 'DRAFT') return <span className="text-gray-500 bg-gray-50 px-2 py-1 rounded text-xs font-medium border border-gray-200">Draft</span>;
        return <span className="text-gray-500 bg-gray-50 px-2 py-1 rounded text-xs font-medium border border-gray-200">{status}</span>;
      }
    }
  ];

  return (
    <div className="p-6 bg-[#f4f7fe] min-h-screen">
      
      {/* Top Header & Metrics */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payroll Dashboard</h1>
          <p className="text-sm text-gray-500">Payroll / Dashboard</p>
        </div>
        <div className="flex space-x-3 items-center">
          <Select defaultValue="October 2024" className="w-40">
             <Option value="October 2024">October 2024</Option>
          </Select>
          <Button type="primary" className="bg-indigo-600 flex items-center" onClick={handleRunPayroll} loading={loading}>
            <CheckCircle className="w-4 h-4 mr-2" /> Run Payroll
          </Button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="border-r pr-4">
            <p className="text-xs text-gray-500 mb-1">Gross Payroll</p>
            <h3 className="text-xl font-bold text-gray-800">₹ {summary.gross.toLocaleString()}</h3>
        </div>
        <div className="border-r px-4">
            <p className="text-xs text-gray-500 mb-1">Total Deductions</p>
            <h3 className="text-xl font-bold text-red-500">₹ {summary.deductions.toLocaleString()}</h3>
        </div>
        <div className="border-r px-4">
            <p className="text-xs text-gray-500 mb-1">Net Payable</p>
            <h3 className="text-xl font-bold text-green-600">₹ {summary.net.toLocaleString()}</h3>
        </div>
        <div className="px-4 flex flex-col justify-center items-center">
            <h3 className="text-2xl font-bold text-gray-800">{summary.count}</h3>
            <p className="text-xs text-gray-500">Total Staff Processed</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Center Column: Table */}
        <div className="w-full lg:w-3/4">
            <Card variant="borderless" className="shadow-sm rounded-xl h-full" styles={{ body: { padding: '20px' } }}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Payroll Runs</h2>
                    <div className="flex space-x-2">
                        <Button icon={<Download className="w-4 h-4 mr-1"/>} size="small" className="text-xs text-gray-600">Export Bank Sheet</Button>
                    </div>
                </div>

                <Table 
                    columns={columns} 
                    dataSource={runs} 
                    rowKey="id"
                    pagination={{ size: 'small' }} 
                    rowClassName="hover:bg-gray-50"
                    size="middle"
                    loading={loading}
                />
            </Card>
        </div>

        {/* Right Column: Summaries */}
        <div className="w-full lg:w-1/4 space-y-6">
            <Card title="Quick Actions" variant="borderless" className="shadow-sm rounded-xl" styles={{ header: { borderBottom: 0, paddingBottom: 0, fontWeight: 'bold' } }}>
                <div className="space-y-3 mt-4 text-sm">
                    <div className="flex items-center text-gray-600 cursor-pointer hover:text-blue-600">
                        <Lock className="w-4 h-4 mr-3" /> Lock Payroll
                    </div>
                    <div className="flex items-center text-gray-600 cursor-pointer hover:text-blue-600">
                        <Mail className="w-4 h-4 mr-3" /> Send Payslips (Email)
                    </div>
                    <div className="flex items-center text-gray-600 cursor-pointer hover:text-blue-600">
                        <FileText className="w-4 h-4 mr-3" /> Payroll Audit Log
                    </div>
                </div>
            </Card>
        </div>

      </div>
    </div>
  );
};

export default PayrollDashboard;
