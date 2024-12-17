import React from 'react'
import Sidebar from './layout/Sidebar'
import HomeNavbar from './layout/HomeNavbar'
import Admin from './Admin'

function AdminDashboard() {
  return (
    <>
    <Sidebar/>
    <HomeNavbar/>
    <Admin/>
    </>
  )
}

export default AdminDashboard