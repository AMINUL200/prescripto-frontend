import React from 'react'
import Header from '../component/Header'
import SpecialtyMenu from '../component/SpecialtyMenu'
import TopDoctors from '../component/TopDoctors'
import Banner from '../component/Banner'

const Home = () => {
  return (
    <div>
      <Header/>
      <SpecialtyMenu/>
      <TopDoctors/>
      <Banner/>
    </div>
  )
}

export default Home
