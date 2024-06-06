import React, { useEffect, useState } from 'react'
import Card from './Card'

const CardContainer = ({id, title}) => {
  const [songs, setSongs] = useState([])

  const fetchSong = async () => {
    const limit = 14;
    const offset = 0;

    const song = await fetch(`https://saavn.dev/api/songs/${id}/suggestions?limit=${limit}&offset=${offset}`);
    const { data } = await song.json();
    setSongs(data);
  }

  useEffect(() => {
    fetchSong();
  }, [])

  return (
    <>
      <h3 className='font-extrabold text-xl pt-14'>{title}</h3>
      <div className='bg-white w-[68vw] h-fit mt-3 flex flex-wrap overflow-hidden gap-4'>
        {
          songs?.map((song, index) => <Card key={index} {...song} />)
        }
      </div>
    </>
  )
}

export default CardContainer
