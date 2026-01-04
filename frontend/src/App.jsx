// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 1. Layouts
import MainLayout from './components/layout/MainLayout';

// 2. Auth Pages (Các trang bạn vừa làm)
import Intro from './pages/auth/Intro';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyCode from './pages/auth/VerifyCode';
import AuthSuccess from './pages/auth/AuthSuccess';
import ResetPassword from './pages/auth/ResetPassword';

// 3. App Pages (Các trang chức năng bên trong)
import Spaces from './pages/Spaces';
import Rooms from './pages/Rooms';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Devices from './pages/Devices';
import DeviceDetail from './pages/DeviceDetails';
import Members from './pages/Members';

function App() {
  // Trạng thái đăng nhập giả lập. 
  // Để test luồng Login -> Dashboard, bạn có thể thử sửa thành false.
  const isAuthenticated = true; 

  return (
    <BrowserRouter>
      <Routes>
        {/* --- KHU VỰC PUBLIC (AUTHENTICATION) --- */}
        {/* Không dùng MainLayout, full màn hình trắng */}
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* --- KHU VỰC PROTECTED (APP DASHBOARD) --- */}
        {/* Chỉ truy cập được khi đã đăng nhập */}
        <Route 
          path="/app/*" 
          element={
            isAuthenticated ? (
              <MainLayout>
                <Routes>
                  {/* Mặc định vào Spaces */}
                  <Route index element={<Navigate to="spaces" replace />} />
                  
                  <Route path="spaces" element={<Spaces />} />
                  <Route path="rooms" element={<Rooms />} /> 
                  
                  {/* Devices & Detail */}
                  <Route path="devices" element={<Devices />} />
                  <Route path="devices/:deviceId" element={<DeviceDetail />} />

                  {/* Members */}
                  <Route path="members" element={<Members />} /> 

                  {/* Stats & Settings */}
                  <Route path="statistics" element={<Statistics />} />
                  <Route path="settings" element={<Settings />} />

                  {/* Nếu gõ link sai trong /app/... thì về spaces */}
                  <Route path="*" element={<Navigate to="spaces" replace />} />
                </Routes>
              </MainLayout>
            ) : (
              // Nếu chưa đăng nhập mà cố vào /app, đá về Login
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Catch-all: Gõ link bậy ở ngoài root thì về Intro */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;