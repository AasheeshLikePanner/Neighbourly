import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './components/Home'
import AuthSystem from './components/Auth'
import { getCurrentUser } from './apis/apis'
import useStore from './store/store'

function App() {
  const [count, setCount] = useState(0)
  const { user,setUser} = useStore();


  useEffect(()=>{
    async function fetchCurrentUser (){
      const response = await getCurrentUser();
      console.log(response.data);
      setUser(response.data);
    }
    fetchCurrentUser()
  },[])

  return (
    <div>
      {user ?<Home/>:
      <AuthSystem/>}
    </div>
  )
}

export default App
