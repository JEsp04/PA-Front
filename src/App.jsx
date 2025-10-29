import './App.css'
import { Header } from './components/header'
import { Home } from './pages/Home'

function App() {
  return (
    <div className='min-h-screen bg-white'>
      <Header />
      <main>
        <Home />
      </main>
    </div>
  )
}

export default App