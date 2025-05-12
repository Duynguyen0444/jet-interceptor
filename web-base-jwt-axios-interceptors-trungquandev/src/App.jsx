// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from '~/pages/Login'
import Dashboard from '~/pages/Dashboard'

// Giải pháp Clean Code trong việc xác định các route nào cần đăng nhập tài khoản xong thì mới cho truy cập
// Sủ dụng Outlet của react-router-dom để xác định các Child route
const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if (!user) return <Navigate to="/login" replace={true} />

  return <Outlet />
}

const UnauthorizedRoute = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if (user) return <Navigate to="/dashboard" replace={true} />

  return <Outlet />
}


function App() {
  return (
    <Routes>
      <Route path='/' element={
        <Navigate to="/login" replace={true} />
      } />
      <Route element={<UnauthorizedRoute />}>
        <Route path='/login' element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App
