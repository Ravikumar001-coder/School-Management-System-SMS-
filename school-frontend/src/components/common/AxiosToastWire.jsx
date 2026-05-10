// src/components/common/AxiosToastWire.jsx
// This tiny component lives inside <ToastProvider> in App.jsx.
// It passes the toast instance to the axios interceptor once on mount.
import { useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import { setAxiosToast } from '../../api/axios';

const AxiosToastWire = () => {
  const toast = useToast();
  useEffect(() => {
    setAxiosToast(toast);
  }, [toast]);
  return null;
};

export default AxiosToastWire;
