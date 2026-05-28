import React, { useState } from 'react';
import { Card, Table, Button, Tabs, message } from 'antd';
import { Plus } from 'lucide-react';

const { TabPane } = Tabs;

const TransportHostelFeeUI = () => {
  const transportSlabs = [
    { key: 1, min: 0, max: 5, oneWay: 1000, twoWay: 1800 },
    { key: 2, min: 5.1, max: 10, oneWay: 1500, twoWay: 2500 },
    { key: 3, min: 10.1, max: 20, oneWay: 2000, twoWay: 3500 },
  ];

  const hostelRooms = [
    { key: 1, type: '4-Bed Non-AC', monthly: 3000, active: true },
    { key: 2, type: '2-Bed AC', monthly: 7500, active: true },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Transport & Hostel Fees</h1>

      <Tabs defaultActiveKey="1" className="bg-white p-4 shadow-sm rounded-lg">
        <TabPane tab="Transport Distance Slabs" key="1">
          <div className="flex justify-end mb-4">
             <Button type="primary" icon={<Plus className="w-4 h-4 mr-1"/>}>Add Slab</Button>
          </div>
          <Table 
            dataSource={transportSlabs} 
            columns={[
              { title: 'Min Distance (Km)', dataIndex: 'min' },
              { title: 'Max Distance (Km)', dataIndex: 'max' },
              { title: 'One-Way Fee (₹)', dataIndex: 'oneWay' },
              { title: 'Two-Way Fee (₹)', dataIndex: 'twoWay' },
            ]} 
          />
        </TabPane>
        
        <TabPane tab="Hostel Room Pricing" key="2">
          <div className="flex justify-end mb-4">
             <Button type="primary" icon={<Plus className="w-4 h-4 mr-1"/>}>Add Room Type</Button>
          </div>
          <Table 
            dataSource={hostelRooms} 
            columns={[
              { title: 'Room Type', dataIndex: 'type' },
              { title: 'Monthly Fee (₹)', dataIndex: 'monthly' },
              { title: 'Status', dataIndex: 'active', render: (val) => val ? 'Active' : 'Inactive' },
            ]} 
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TransportHostelFeeUI;
