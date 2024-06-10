import React, { useCallback, useContext } from 'react'
import { Link } from 'react-router-dom'
import musicContext from '../context/context'

const Card = ({ id, image, name, artists, downloadUrl, duration }) => {

  const { encodeId, playAndPause } = useContext(musicContext)

  return (
    <Link to={`/${name}/${encodeId(id)}`} onClick={() => { playAndPause(id, name, artists, image, downloadUrl, duration) }} className='text-center w-fit h-fit'>
      <img src={image[2].url} alt="" className='h-[8vw] w-[8vw] object-cover rounded-lg' />
      <h3 className='mt-[2px] w-full h-fit'>{name.length > 15 ? name.slice(0, 15) + '...' : name}</h3>
      <h5 className='mt-[1px] w-full h-fit'>
        {artists.all.map((artist) => artist.name).join(",").length > 15 ?
          artists.all.map((artist) => artist.name).join(",").slice(0, 15) + "..."
          : artists.all.map((artist) => artist.name).join(",")}
      </h5>
    </Link>
  )
}

export default Card
