import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Master from './Layout/Master'
import Home from './User/Home'
import AboutUS from './User/AboutUs'
import Services from './User/Notes'
import ContactUs from './User/ContactUs'
import AdminLogin from './Authentication/AdminLogin'
import ManagerLogin from './Authentication/ManagerLogin'
import UserLogin from './User/UserLogin'
import Tasks from './User/Tasks'
import Notes from './User/Notes'
import AdminMaster from './Admin/AdminMaster'
import Register from './Authentication/Register'
import Dashboard from './Admin/Dashboard'
import AssignTasks from './Admin/AssignTasks'
import Users from './Admin/Users'
import ChatBot from './User/ChatBot'
import Profile from './User/Profile'
import AccountSettings from './User/AccountSettings'
import Chat from './User/Chat'
import Projects from '../../src/Admin/Projects'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Master />}>
            <Route path='/' element={<Home />} />
            <Route path='/aboutus' element={<AboutUS />} />
            <Route path='/notes' element={<Notes />} />
            <Route path='/tasks' element={<Tasks />} />
            <Route path='/contactus' element={<ContactUs />} />
            <Route path='/adminlog' element={<AdminLogin />} />
            <Route path='/managerlog' element={<ManagerLogin />} />
            <Route path='/userlog' element={<UserLogin />} />
            <Route path='/register' element={<Register />} />
            <Route path='/chatbot' element={<ChatBot />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/account-settings' element={<AccountSettings />} />
            <Route path='/chat' element={<Chat />} />
          </Route>

          <Route path='/admin' element={<AdminMaster />}>
            <Route path='/admin' element={<Dashboard />} />
            <Route path='/admin/assigntasks' element={<AssignTasks />} />
            <Route path='/admin/users' element={<Users />} />
            <Route path="/admin/projects" element={<Projects />} />
            <Route path="/admin/create-project" element={<CreateProjecs />} />
            <Route path="/admin/project/:id" element={<ProjectDetails />} />
            {/* <Route path='/' element={<Home/>}/> */}
            {/* <Route path='/' element={<Home/>}/> */}


          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
