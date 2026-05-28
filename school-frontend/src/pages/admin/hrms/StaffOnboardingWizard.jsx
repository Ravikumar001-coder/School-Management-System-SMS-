import React, { useState, useEffect } from 'react';
import { Card, Steps, Button, Form, Input, Select, DatePicker, message, Progress, Badge, Divider } from 'antd';
import { User, Clock, CheckCircle, ShieldCheck, Landmark, FileText, Upload as UploadIcon, AlertCircle } from 'lucide-react';
import { hrmsService } from '../../../services/hrmsService';
import api from '../../../api/axios';

const StaffOnboardingWizard = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [onboardedStaff, setOnboardedStaff] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    // Fetch master data
    const fetchMasterData = async () => {
      try {
        const [deptRes, roleRes, branchRes] = await Promise.allSettled([
          api.get('/departments'),
          api.get('/roles'),
          api.get('/branches'),
        ]);
        if (deptRes.status === 'fulfilled' && deptRes.value?.data?.data) {
          setDepartments(deptRes.value.data.data);
        }
        if (roleRes.status === 'fulfilled' && roleRes.value?.data) {
          setRoles(roleRes.value.data.data || roleRes.value.data || []);
        }
        if (branchRes.status === 'fulfilled' && branchRes.value?.data?.data) {
          setBranches(branchRes.value.data.data);
        }
      } catch (e) {
        console.error("Failed to fetch master data", e);
      }
    };
    fetchMasterData();
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Format dates and prepare payload
      const payload = {
        ...values,
        dateOfBirth: values.dob ? values.dob.format('YYYY-MM-DD') : null,
        joiningDate: values.joiningDate ? values.joiningDate.format('YYYY-MM-DD') : null,
      };

      const response = await hrmsService.onboardStaff(payload);
      
      if (response.success) {
        message.success('Staff onboarded successfully!');
        setOnboardedStaff(response.data);
        setCurrent(5); // Go to completion step
      } else {
        message.error(response.message || 'Failed to onboard staff');
      }
    } catch (error) {
      console.error(error);
      message.error('An error occurred during onboarding');
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    form.validateFields().then(() => {
      if (current === 4) { // Final step before submit
        form.submit();
      } else {
        setCurrent(current + 1);
      }
    }).catch(info => console.log('Validate Failed:', info));
  };

  const prev = () => setCurrent(current - 1);

  // Ant Design v5 Steps uses items prop instead of <Step> children
  const stepItems = [
    { title: 'Personal' },
    { title: 'Professional' },
    { title: 'Documents' },
    { title: 'Salary' },
    { title: 'Access' },
    { title: 'Approval' },
  ];

  return (
    <div className="p-6 bg-[#f4f7fe] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Staff Onboarding Center</h1>
          <p className="text-sm text-gray-500">HRMS {'>'} Onboarding</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/4 space-y-6">
          <Card
            title="On-boarding Pipeline"
            variant="borderless"
            className="shadow-sm rounded-xl"
            styles={{ header: { borderBottom: 0, paddingBottom: 0, fontWeight: 'bold' } }}
          >
            <div className="space-y-1 mt-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg text-blue-700 font-medium cursor-pointer border border-blue-100">
                <div className="flex items-center"><User className="w-4 h-4 mr-3" /> New Applicants</div>
                <Badge count={1} style={{ backgroundColor: '#fff', color: '#1d4ed8', boxShadow: '0 0 0 1px #bfdbfe inset' }} />
              </div>
            </div>
          </Card>
        </div>

        <div className="w-full lg:w-2/4">
          <Card variant="borderless" className="shadow-sm rounded-xl h-full">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Onboarding Progress</h2>
            
            <Steps current={current} size="small" className="mb-8" type="inline" items={stepItems} />

            {current === 0 && (
              <Form layout="vertical" form={form} onFinish={onFinish}>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  <Form.Item label="First Name *" name="firstName" rules={[{ required: true, message: 'Required' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Last Name *" name="lastName" rules={[{ required: true, message: 'Required' }]}>
                    <Input />
                  </Form.Item>
                  
                  <Form.Item label="Email *" name="email" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Phone *" name="phone" rules={[{ required: true, message: 'Required' }]}>
                    <Input />
                  </Form.Item>

                  <Form.Item label="Date of Birth *" name="dob" rules={[{ required: true, message: 'Required' }]}>
                    <DatePicker className="w-full" />
                  </Form.Item>
                  <Form.Item label="Gender *" name="gender" rules={[{ required: true, message: 'Required' }]}>
                    <Select
                      options={[
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item label="Aadhar Number *" name="aadhaarNumber" rules={[{ required: true, message: 'Required' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="PAN Number *" name="panNumber" rules={[{ required: true, message: 'Required' }]}>
                    <Input />
                  </Form.Item>

                  <Form.Item label="Joining Date *" name="joiningDate" rules={[{ required: true, message: 'Required' }]}>
                    <DatePicker className="w-full" />
                  </Form.Item>

                  <Form.Item label="Department *" name="departmentId" rules={[{ required: true, message: 'Required' }]}>
                    <Select
                      options={
                        departments.length > 0
                          ? departments.map(d => ({ value: d.id, label: d.name }))
                          : [{ value: 1, label: 'Default Department' }]
                      }
                    />
                  </Form.Item>
                  
                  <Form.Item label="Role *" name="roleId" rules={[{ required: true, message: 'Required' }]}>
                    <Select
                      options={
                        roles.length > 0
                          ? roles.map(r => ({ value: r.id, label: r.name }))
                          : [{ value: 2, label: 'Default Role' }]
                      }
                    />
                  </Form.Item>

                  <Form.Item label="Branch *" name="branchId" rules={[{ required: true, message: 'Required' }]}>
                    <Select
                      options={
                        branches.length > 0
                          ? branches.map(b => ({ value: b.id, label: b.branchName }))
                          : [{ value: 1, label: 'Default Branch' }]
                      }
                    />
                  </Form.Item>

                  <Form.Item label="Employment Type *" name="employmentType" rules={[{ required: true, message: 'Required' }]} initialValue="FULL_TIME">
                    <Select
                      options={[
                        { value: 'FULL_TIME', label: 'Full Time' },
                        { value: 'PART_TIME', label: 'Part Time' },
                        { value: 'CONTRACT', label: 'Contract' },
                      ]}
                    />
                  </Form.Item>
                </div>

                <Divider />
                
                <div className="flex justify-end space-x-3">
                  <Button type="primary" className="bg-blue-600" onClick={() => form.submit()} loading={loading}>Submit for API</Button>
                </div>
              </Form>
            )}

            {current === 5 && onboardedStaff && (
              <div className="text-center py-10">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Onboarding Complete!</h2>
                <p className="text-gray-500 mt-2">Employee Code: <strong>{onboardedStaff.employeeCode}</strong></p>
                <Button type="primary" onClick={() => { setCurrent(0); form.resetFields(); setOnboardedStaff(null); }} className="mt-6 bg-blue-600">Onboard Another</Button>
              </div>
            )}
          </Card>
        </div>

        <div className="w-full lg:w-1/4 space-y-6">
          <Card
            title="Live Summary"
            variant="borderless"
            className="shadow-sm rounded-xl text-center"
            styles={{ header: { borderBottom: 0, paddingBottom: 0, fontWeight: 'bold', textAlign: 'left' } }}
          >
            <div className="mt-4 flex flex-col items-center">
              <Progress type="circle" percent={Math.round((current / 5) * 100)} strokeColor="#10b981" size={120} format={percent => (
                  <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold">{percent}%</span>
                      <span className="text-xs text-gray-500">Completed</span>
                  </div>
              )} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffOnboardingWizard;
