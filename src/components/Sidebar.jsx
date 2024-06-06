import React from 'react'
import Browse from './Browse';
import Library from './Library';
import NewPlaylistsButton from './NewPlaylistsButton';

const Sidebar = () => {
  return (
    <div className='bg-[#f4f4f4] h-[93vh] w-64 pt-10 pl-11'>
    <Browse/>
    <Library/>
    <NewPlaylistsButton/>
    </div>
  )
}

export default Sidebar
