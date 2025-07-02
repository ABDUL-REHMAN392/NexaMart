import BestSellingProducts from '../component/BestSellingProducts'
import Category from '../component/Category'
import FlashSales from '../component/FlashSales'
import HeroSection from '../component/HeroSection'
import NewArrival from '../component/NewArvival'
import TrustedPartners from '../component/TrustedPartners'


function Home() {
  return (
    <div>
      <HeroSection/>
      <FlashSales/>
      <Category/>
      <BestSellingProducts/>
       <NewArrival/>
    <TrustedPartners/>
   
    </div>
  )
}

export default Home