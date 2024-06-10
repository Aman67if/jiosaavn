import React, { useContext } from 'react'
import musicContext from '../context/context';
import { Link } from 'react-router-dom';


const Songlist = ({ id, name, artists, image, downloadUrl, duration }) => {
  const { SecToMin } = useContext(musicContext);
  const { playAndPause, encodeId } = useContext(musicContext);

  return (
    <Link to={`/${name}/${encodeId(id)}`} onClick={() => { playAndPause(id, name, artists, image, downloadUrl, duration) }} className='bg-gray-200 mt-4 w-[94%] flex items-center justify-between px-4 py-2 border-[2px] border-black rounded-2xl cursor-pointer'>
      <img src={`${image[0].url}`} alt="logo" className='h-14 rounded-full' />
      <h4 className='w-[75%] text-sm font-medium'>{name.length > 40 ? name.replace(/&quot;/g, '').slice(0, 40) + '...' : name.replace(/&quot;/g, '')}</h4>
      <h6 className='text-base'>{SecToMin(duration)}</h6>
    </Link>
  )
}

export default Songlist
