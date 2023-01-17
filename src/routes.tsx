import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AboutPage from './pages/About'
import HomePage from './pages/HomePage'
import MyWork from './pages/MyWork'
import SettingPage from './pages/Settings'
import { CustomRoutes } from './customRoutes'
import Signin from './pages/authentication/Signin'
import TaskDetails from './pages/TaskDetails'

const MainRoutes = () => {
  return (
    <>
      <Routes>
        <Route path={CustomRoutes.HomePage.path} element={<HomePage />}>
          <Route path={CustomRoutes.MyWork.path} element={<MyWork />}>
            <Route
              path={CustomRoutes.TaskDetails.path + '/:id'}
              element={<TaskDetails openModal={true} />}
            />
          </Route>
          <Route path={CustomRoutes.Setting.path} element={<SettingPage />} />
          <Route path={CustomRoutes.About.path} element={<AboutPage />} />
        </Route>
        <Route path={CustomRoutes.Signin.path} element={<Signin />}></Route>
      </Routes>
    </>
  )
}

export default MainRoutes
