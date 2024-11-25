import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { AuthProvider } from './contexts/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Locations from './pages/Locations'
import IndividualLocation from './pages/IndividualLocation'
import Team from './pages/Team'
import Posts from './pages/Posts'
import Billing from './pages/Billing'
import Settings from './pages/Settings'
import Reports from './pages/Reports'
import KeywordReport from './pages/KeywordReport'
import Audit from './pages/Audit'
import AuditReport from './pages/AuditReport'
import Reviews from './pages/Reviews'
import Widget from './pages/Widget'
import GridReports from './pages/GridReports'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Home />} />
          <Route path="locations" element={<Locations />} />
          <Route path="locations/:id" element={<IndividualLocation />} />
          <Route path="team" element={<Team />} />
          <Route path="posts" element={<Posts />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
          <Route path="reports" element={<Reports />} />
          <Route path="keyword-report/:id" element={<KeywordReport />} />
          <Route path="audit" element={<Audit />} />
          <Route path="audit/:id" element={<AuditReport />} />
          <Route path="widget" element={<Widget />} />
          <Route path="grid-reports" element={<GridReports />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App