import { Route, Routes, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import View from "./pages/View"
import Community from "./pages/Community"
import Projects from "./pages/Projects"
import Pricing from "./pages/Pricing"
import Preview from "./pages/Preview"
import LenisScroll from "./components/Lenis-scroll"
import Navbar from "./components/Navbar"
import MyProjects from "./pages/MyProjects"
import Footer from "./components/Footer"
import { Toaster } from 'sonner'
import AuthPage from "./pages/auth/AuthPage"
import Settings from "./pages/Settings"
import Loading from "./pages/Loading"
const App = () => {

  const { pathname } = useLocation()

  const hideLayout = pathname.startsWith('/project/') && pathname !== "/project"  || pathname.startsWith('/view/') || pathname.startsWith('/preview')
  return (
    <div className="min-h-screen">
      <Toaster />
      <LenisScroll />
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view/:projectId" element={<View />} />
        <Route path="/community" element={<Community />} />
        <Route path="/project/:projectId" element={<Projects />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/preview/:projectId" element={<Preview />} />
        <Route path="/preview/:projectId/:versionId" element={<Preview />} />
        <Route path="/myprojects" element={<MyProjects />} />
        <Route path="/auth/:pathname" element={<AuthPage />} />
        <Route path="/account/settings" element={<Settings />} />
        <Route path="/loading" element={<Loading />} />
      </Routes>
      {!hideLayout && <Footer />}
    </div>
  )
}

export default App
