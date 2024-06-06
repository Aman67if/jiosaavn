import React from 'react'

const Library = () => {
  return (
    <div className='mt-8'>
      <h4 className='text-gray-500 font-extrabold text-[12px]'>LIBRARY</h4>
      <div className='mt-5 flex flex-col gap-2  text-black font-semibold text-[16px]'>
        <div className='flex items-center gap-1'>
          <img src="/history.svg" alt="" className='h-5' />
        <h5>History</h5>
        </div>
        <div className='flex items-center gap-1'>
          <img src="/music.svg" alt="" className='h-5' />
        <h5>Liked Songs</h5>
        </div>
        <div className='flex items-center gap-1'>
          <img src="/album.svg" alt="" className='h-5' />
        <h5>Albums</h5>
        </div>
        <div className='flex items-center gap-1'>
          <img src="/podcast.svg" alt="" className='h-5' />
        <h5>Podcasts</h5>
        </div>
        <div className='flex items-center gap-1'>
          <img src="/mic.svg" alt="" className='h-5' />
        <h5>Artists</h5>
        </div>
      </div>
    </div>
  )
}

export default Library
