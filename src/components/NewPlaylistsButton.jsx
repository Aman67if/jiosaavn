import React from 'react'

const NewPlaylistsButton = () => {
  return  (
  <button className='mt-9 px-5 py-3 rounded-full border border-[#1FCCB3] flex items-center gap-2'>
    <img src="./add.svg" alt="" className='h-4'/>
    <h5 className='text-[#1FCCB3] font-extrabold text-[13px]'>New Playlists</h5>
  </button>
  )
}

export default NewPlaylistsButton
