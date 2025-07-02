
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { About, Cart, Category, Contact, Favorite, Home, SingleProduct, UserInformation } from './pages'
import Layout from './UI/Layout'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Search from './pages/Search';
const router=createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Layout/>}>
    <Route index element={<Home/>}/>
    <Route path='about' element={<About/>}/>
    <Route path='search' element={<Search/>}/>
    <Route path='user_details' element={<UserInformation/>}/>
    <Route path='contact' element={<Contact/>}/>
    <Route path='category/:category' element={<Category/>}/>
    <Route path='cart' element={<Cart/>}/>
    <Route path='favorite' element={<Favorite/>}/>
    <Route path='product/:id' element={<SingleProduct/>}/>
  </Route>
))
function App() {
  return (

 <>
    <RouterProvider router={router}/>
     <ToastContainer
  position="top-center"
  autoClose={2000}
  hideProgressBar={true} 
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
 
/>

    
 </>
  )
}

export default App