import { BrowserRouter,Routes , Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import { useUserData } from './context/UserContext'
import Loading from './components/Loading';
import Register from './pages/Register';
import Alumb from './pages/Alumb';
import PlayList from './pages/PlayList';



function App() {

  const {isAuth,loading} = useUserData();

  return (
   <>
  { loading? <Loading/> : <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/> } />
        <Route path="/login" element={isAuth ? <Home/> : <Login/>} />
        <Route path='/register' element={isAuth? <Home/> : <Register/>} />
        <Route path="/album/:id" element={<Alumb/> } />
        <Route path="/playlist" element={isAuth ? <PlayList/> : <Login/>}/>

      </Routes>
    </BrowserRouter>}
   </>
  )
}

export default App
