import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Input, Select, message, Tag } from 'antd';
import { FileText, Download, CheckCircle } from 'lucide-react';
import { hrmsApi } from '../../../api/hrmsApi';

const ComplianceDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await hrmsApi.getReports(new Date().getFullYear(), new Date().getMonth() + 1);
      if (res.success) {
        setReports(res.data.map(item => ({
          ...item,
          key: item.id
        })));
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to load compliance reports');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (values) => {
    try {
      setLoading(true);
      const res = await hrmsApi.generateComplianceReport(1, values.year, values.month);
      if (res.success) {
        message.success('Report generated successfully');
        fetchReports();
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitChallan = async (id) => {
    try {
      setLoading(true);
      await hrmsApi.submitChallan(id, 'https://example.com/challan.pdf');
      message.success('Challan submitted successfully');
      fetchReports();
    } catch (error) {
      console.error(error);
      message.error('Failed to submit challan');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Month/Year', render: (_, r) => `${r.reportMonth}/${r.reportYear}` },
    { title: 'Total PF', render: (_, r) => `₹${(r.totalPfEmployee + r.totalPfEmployer).toFixed(2)}` },
    { title: 'Total ESI', render: (_, r) => `₹${(r.totalEsiEmployee + r.totalEsiEmployer).toFixed(2)}` },
    { title: 'Status', dataIndex: 'status', render: (s) => <Tag color={s === 'SUBMITTED' ? 'green' : 'orange'}>{s}</Tag> },
    {
      title: 'Action',
      render: (_, r) => r.status === 'DRAFT' ? (
        <button onClick={() => handleSubmitChallan(r.id)} className="bg-[#1E40AF] text-white px-4 py-2 rounded-[16px] min-h-[44px] font-bold text-sm shadow-md transition-all flex items-center gap-2 hover:bg-[#1E3A8A]">Submit Challan</button>
      ) : (
        <button disabled className="bg-slate-300 text-slate-500 px-4 py-2 rounded-[16px] min-h-[44px] font-bold text-sm shadow-md transition-all flex items-center gap-2"><CheckCircle size={14} /> Submitted</button>
      )
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6 bg-white p-5 rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9]">
        <h1 className="text-2xl font-bold">PF & ESI Compliance</h1>
      </div>
      
      <Card className="mb-6 rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9]">
        <Form form={form} layout="inline" onFinish={handleGenerate}>
          <Form.Item name="year" initialValue={new Date().getFullYear()}>
            <Select style={{ width: 120 }}>
              {[2024, 2025, 2026].map(y => <Select.Option key={y} value={y}>{y}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="month" initialValue={new Date().getMonth() + 1}>
            <Select style={{ width: 120 }}>
              {Array.from({length: 12}, (_, i) => i + 1).map(m => <Select.Option key={m} value={m}>Month {m}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item>
            <button type="submit" disabled={loading} className="bg-[#1E40AF] text-white px-6 py-2 rounded-[16px] min-h-[44px] font-bold text-sm shadow-md transition-all flex items-center gap-2 hover:bg-[#1E3A8A]">
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <FileText size={16} />}
              Generate Report
            </button>
          </Form.Item>
        </Form>
      </Card>

      <div className="bg-white p-5 rounded-[16px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1),0_10px_15px_-3px_rgb(0,0,0,0.05)] border border-[#f1f5f9]">
        <Table columns={columns} dataSource={reports} loading={loading} />
      </div>
    </div>
  );
};

export default ComplianceDashboard;
