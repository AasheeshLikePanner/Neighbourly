import { useEffect, useState } from 'react'
import './App.css'
import Home from './components/Home'
import AuthSystem from './components/Auth'
import { getCurrentUser } from './apis/apis'
import useStore from './store/store'
import PostDetail from './components/PostDetail'
import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Profile from './components/Profile'

function App() {
  const { user, setUser } = useStore()
  const [loading, setLoading] = useState(true)
  const navigation  = useNavigate()


  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await getCurrentUser()
        setUser(response.data)
      } catch (error) {
        console.error("Error fetching user:", error)
        navigation('/auth')
      } finally {
        setLoading(false)
      }
    }
    fetchCurrentUser()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/auth' element={<AuthSystem/>}/>
      <Route path='/post/:postId' element={<PostDetail/>}/>
      <Route path='/profile/:username' element={<Profile/>}/>
    </Routes>
  )
}

export default App
