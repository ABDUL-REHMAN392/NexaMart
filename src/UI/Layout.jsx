
import Footer from '../component/Footer'
import Header from '../component/Header'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
        <Header/>
        <main>
          <Outlet/>
        </main>
        <Footer/>
    </div>
  )
}

export default Layout