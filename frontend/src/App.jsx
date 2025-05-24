import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './components/Home'
import AuthSystem from './components/Auth'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      {/* <Home/> */}
      <AuthSystem/>
    </div>
  )
}

export default App
