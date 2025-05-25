import { useEffect, useState } from 'react'
import './App.css'
import Home from './components/Home'
import AuthSystem from './components/Auth'
import { getCurrentUser } from './apis/apis'
import useStore from './store/store'

function App() {
  const { user, setUser } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await getCurrentUser()
        console.log(response.data)
        setUser(response.data)
      } catch (error) {
        console.error("Error fetching user:", error)
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
    <div>
      {user ? <Home /> : <AuthSystem />}
    </div>
  )
}

export default App
