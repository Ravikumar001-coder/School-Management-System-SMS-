import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import toast from 'react-hot-toast';

export const useDashboardWebsocket = (onKpiRefresh, onAlertReceived) => {
    const [isConnected, setIsConnected] = useState(false);
    const client = useRef(null);

    useEffect(() => {
        const socketUrl = process.env.REACT_APP_API_URL 
            ? process.env.REACT_APP_API_URL.replace('/api/v1', '/ws-dashboard')
            : 'http://localhost:8080/ws-dashboard';

        client.current = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                setIsConnected(true);
                
                // Subscribe to KPI Refresh events
                client.current.subscribe('/topic/kpi-refresh', (msg) => {
                    if (msg.body) {
                        const payload = JSON.parse(msg.body);
                        toast.success(`Live Update: ${payload.module} modified.`);
                        if (onKpiRefresh) onKpiRefresh(payload.module);
                    }
                });

                // Subscribe to System Alerts
                client.current.subscribe('/topic/alerts', (msg) => {
                    if (msg.body) {
                        const payload = JSON.parse(msg.body);
                        if (onAlertReceived) onAlertReceived(payload);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            onDisconnect: () => {
                setIsConnected(false);
            }
        });

        client.current.activate();

        return () => {
            if (client.current) {
                client.current.deactivate();
            }
        };
    }, [onKpiRefresh, onAlertReceived]);

    return { isConnected };
};
