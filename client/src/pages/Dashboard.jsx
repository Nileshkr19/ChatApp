import React from 'react'

import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Dashboard