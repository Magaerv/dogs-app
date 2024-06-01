import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import PrivateRoutes from './components/PrivateRoutes'
import Home from './pages/Home'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { CreateDog } from './pages/CreateDog'
import { UpdateDog } from './pages/UpdateDog'
import { Dog } from './pages/Dog'
import { Search } from './pages/Search'
import Footer from './components/Footer'
import { Magaerv } from './pages/Magaerv'


export default function App() {
  return <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/magaerv' element={<Magaerv />} />
      <Route path='/' element={<Home />} />
      <Route path='/sign-in' element={<SignIn />} />
      <Route path='/sign-up' element={<SignUp />} />
      <Route path='/dog/:id' element={<Dog />} />
      <Route path='/search' element={<Search />} />
      <Route pathelement={PrivateRoutes}>
        <Route path='/profile' element={<Profile />} />
        <Route path='/create-dog' element={<CreateDog />} />
        <Route path='/update-dog/:dogId' element={<UpdateDog />} />
      </Route>
    </Routes>
    <Footer/>
  </BrowserRouter>
}
