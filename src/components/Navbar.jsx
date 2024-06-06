import React from 'react'
import Search from './Search'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div>
      <header className='bg-[#f5f5f5] border-b-2 text-black py-4 px-3 flex justify-between items-center  w-full h-16'>
        <div className='flex gap-5 items-center'>
          <Link to={'/'}>
            <img src="/saavan.svg" alt="logo" className='h-9 cursor-pointer' />
          </Link>
          <div className='flex gap-4 items-center font-extrabold'>
            <h4>Music</h4>
            <h4>Podcasts</h4>
            <h4>Go Pro</h4>
          </div>
        </div>

        <Search />

        <nav>
          <a className='mr-4 font-extrabold'>Login</a>
          <a className='mr-4 font-extrabold'>Sign Up</a>
        </nav>
      </header>
    </div>
  )
}

export default Header
