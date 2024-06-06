import React from 'react'
import Sidebar from '../components/Sidebar'
import SongsLibrary from '../components/SongsLibrary'
import Player from '../components/Player'
import SearchedSongsContainer from '../components/SearchedSongsContainer'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <>
      <Navbar />
      <SearchedSongsContainer />
      <div className='flex'>
        <Sidebar />
        <SongsLibrary />
      </div>
      <Player />
    </>
  )
}

export default Home
