import './App.css'
import { Header } from './components/Header/Header'
import { SideBar } from './components/SideBar/SideBar'
import { DashboardPage } from './pages/DashboardPage/DashboardPage'
import { Routes,Route, BrowserRouter,Navigate } from 'react-router-dom'
import { Staks } from './pages/Staks/Staks'

function App() {
  
  return (
    <BrowserRouter>
    <main>
      <Header />
      <section className="container">
        <SideBar />

          <section className='content'>
             <Routes>  
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/staks" element={<Staks />} />
            </Routes>
          </section>
         
       
      </section>
      
      
    </main>
    </BrowserRouter>
    
  )
}

export default App
