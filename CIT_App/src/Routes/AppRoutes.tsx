import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from '../Components/Dashboard Comp/Dashboard'
import UserDetailPanel from '../Components/Dashboard Comp/UserDetailPanel'
import Leaves from '../Components/Leaves Comp/Leaves'


const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/leaves' element={<Leaves />} />
                <Route path='/userDetailPanel' element={<UserDetailPanel />} />
            </Routes>
        </>
    )
}

export default AppRoutes