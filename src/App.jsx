import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AA_Greeting from './pages/AA_Greeting';
import AB_Business from './pages/AB_Business';
import AD_Location from './pages/AD_Location';
import Soon from './pages/Soon';
import Notice from './pages/Notice';
import BF_Info from './pages/BF_Info';
import BF_Process from './pages/BF_Process';
import BF_Fee from './pages/BF_Fee';
import BF_Files from './pages/BF_Files';
import LoginPage from './pages/LoginPage';
import BoardDetail from './pages/BoardDetail';

function App() {
  return (
    <Routes>
      {/* "/" 경로일 때 Home 컴포넌트를 보여줌 */}
      <Route path="/" element={<Home />} />
      <Route path="/greeting" element={<AA_Greeting />} /> 
      <Route path="/business" element={<AB_Business />} />
      <Route path="/location" element={<AD_Location />} />
      <Route path="/Soon" element={<Soon />} />
      <Route path="/bf-info" element={<BF_Info />} />
      <Route path="/bf-process" element={<BF_Process />} />
      <Route path="/bf-fee" element={<BF_Fee />} />
      <Route path="/bf-files" element={<BF_Files />} />
      <Route path="/board/:category" element={<Notice />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/board/:category/:id" element={<BoardDetail />} />
    </Routes>
  );
}

export default App;