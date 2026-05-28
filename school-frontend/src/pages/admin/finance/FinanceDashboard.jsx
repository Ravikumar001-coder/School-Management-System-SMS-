import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Spin } from 'antd';
import { IndianRupee, TrendingUp, AlertCircle } from 'lucide-react';
import { financeApi } from '../../../api/financeApi';

const FinanceDashboard = () => {
  const [stats, setStats] = useState({
    dailyCollection: 0,
    outstandingDues: 0,
    collectionEfficiency: 0,
    defaulterCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await financeApi.getDashboardStats(1);
        if (res.success) {
          setStats(res.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const columns = [
    { title: 'Student', dataIndex: 'studentName', key: 'studentName' },
    { title: 'Class', dataIndex: 'class', key: 'class' },
    { title: 'Amount Due (₹)', dataIndex: 'due', key: 'due' },
    { 
      title: 'Status', 
      key: 'status',
      render: () => <Tag color="error">Defaulter</Tag> 
    },
  ];

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Finance & Fees Dashboard</h1>
      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Daily Collection" 
              value={stats.dailyCollection} 
              prefix={<IndianRupee className="w-5 h-5" />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Outstanding Dues" 
              value={stats.outstandingDues} 
              prefix={<IndianRupee className="w-5 h-5" />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Collection Efficiency" 
              value={stats.collectionEfficiency} 
              suffix="%" 
              prefix={<TrendingUp className="w-5 h-5" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Defaulters" 
              value={stats.defaulterCount} 
              prefix={<AlertCircle className="w-5 h-5" />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Top Defaulters" className="shadow-sm">
        <Table columns={columns} dataSource={[]} pagination={false} />
      </Card>
    </div>
  );
};

export default FinanceDashboard;
