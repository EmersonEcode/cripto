import './App.css'
import { Header } from './components/Header/Header'
import { SideBar } from './components/SideBar/SideBar'
import { DashboardPage } from './pages/DashboardPage/DashboardPage'
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom'
import { Staks } from './pages/Staks/Staks'
import { AppRoutes } from './routes/AppRoutes/AppRoutes'

function App() {
  return (
    <HashRouter>
      <main>
        <Header />
        <section className="container">
          <SideBar />
          <section className='content'>
           <AppRoutes/>
          </section>
        </section>
      </main>
    </HashRouter>
  )
}

export default App
