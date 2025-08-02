import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import FunnelRequests from './pages/FunnelRequests'
import CreateFunnelRequest from './pages/CreateFunnelRequest'
import Leads from './pages/Leads'
import EmailTemplates from './pages/EmailTemplates'
import TeamMembers from './pages/TeamMembers'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/funnel-requests" element={<FunnelRequests />} />
        <Route path="/funnel-requests/create" element={<CreateFunnelRequest />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/email-templates" element={<EmailTemplates />} />
        <Route path="/team-members" element={<TeamMembers />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Layout>
  )
}

export default App