import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import FunnelRequests from './pages/FunnelRequests'
import CreateFunnelRequest from './pages/CreateFunnelRequest'
import Leads from './pages/Leads'
import TeamMembers from './pages/TeamMembers'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'
import FunnelViewScreen from './pages/FunnelViewScreen'
import LeadViewScreen from './pages/LeadViewScreen' 
import Editor from './pages/Mailer/Editor'
import EmailPreview from './pages/Mailer/EmailPreview'
import LayoutSelector from './pages/Mailer/LayoutSelector'
import NewTemplateModal from './pages/Mailer/NewTemplateModal'
import TemplateEditor from './pages/Mailer/TemplateEditor'
import EmailTemplates from './pages/Mailer/EmailTemplates'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/funnel-requests" element={<FunnelRequests />} />
        <Route path="/funnel-requests/create" element={<CreateFunnelRequest />} />
        <Route path="/funnels/:id" element={<FunnelViewScreen />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/leads/:id" element={<LeadViewScreen />} />
        <Route path="/email-templates" element={<EmailTemplates />} />
        <Route path="/team-members" element={<TeamMembers />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Mailer */}
        <Route path="/email-templates/preview" element={<EmailPreview content="" subject="" previewMode="desktop" />} />
        <Route
          path="/email-templates/layouts"
          element={
            <LayoutSelector
              onSelectLayout={() => {}}
              onBack={() => {}}
            />
          }
        />
        <Route
          path="/email-templates/new-template"
          element={
            <NewTemplateModal
              isOpen={true}
              onClose={() => {}}
              onCreateTemplate={() => {}}
            />
          }
        />
        <Route
          path="/email-templates/templates/:id"
          element={
            <TemplateEditor
              onSave={() => {}}
              onBack={() => {}}
            />
          }
        />
      </Routes>
    </Layout>
  )
}

export default App