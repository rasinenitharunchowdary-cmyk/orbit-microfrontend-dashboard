import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@mfe/ui/styles.css';
import App from './NotificationsApp';
createRoot(document.getElementById('root')!).render(<React.StrictMode><div className="standalone-banner">Standalone micro-frontend · notifications</div><BrowserRouter><App /></BrowserRouter></React.StrictMode>);
