import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { createBrowserRouter, Route, RouterProvider, createRoutesFromElements } from 'react-router-dom'
import Home from './Components/Home.jsx'
import About from './Components/About.jsx'
import Certificates from './Components/Certificates.jsx'
import Projects from './Components/Projects.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='about' element={<About />} />
      <Route path='certificates' element={<Certificates />} />
      <Route path='projects' element={<Projects />} />
    </Route>
  )
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
