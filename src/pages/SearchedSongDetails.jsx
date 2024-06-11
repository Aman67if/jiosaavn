
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Songlist from '../components/Songlist';
import musicContext from '../context/context';
import Player from '../components/Player';
import Navbar from '../components/Navbar';
import SearchedSongsContainer from '../components/SearchedSongsContainer';

const Songdetails = () => {
  const {
    SecToMin,
    fetchSongById,
    songDets,
    decodeId,
    suggestions,
    getSongSuggestions } = useContext(musicContext);

  const { searchid } = useParams();

  useEffect(() => {
    fetchSongById(`${decodeId(searchid)}`);
    getSongSuggestions(`${decodeId(searchid)}`);
  }, [searchid])

  return (
    <>
      <Navbar />
      <SearchedSongsContainer />
      <div className='h-[86.5vh] w-full flex items-center justify-center'>
        <div className='h-[86.8vh] w-[50%] flex items-center justify-center'>
          <div className='text-center w-full h-fit grid place-items-center'>
            <img src={`${songDets[0]?.image[2].url}`} alt="song-image" className='h-[17rem] w-auto object-cover' />
            <h4 className='mt-[10px] w-full h-fit text-2xl font-semibold'>{songDets[0]?.name.length > 30 ? songDets[0]?.name.slice(0, 30).replace(/&quot;/g, '') + '...' : songDets[0]?.name.replace(/&quot;/g, '')}</h4>
            <h5 className='mt-[5px] w-full h-fit'>
              {songDets[0]?.artists.all.map((artist) => artist.name).join(",").length > 100 ?
                songDets[0]?.artists.all.map((artist) => artist.name).join(",").slice(0, 100).replace(/&quot;/g, '') + "..." :
                songDets[0]?.artists.all.map((artist) => artist.name).join(",").replace(/&quot;/g, '')}
            </h5>
            <h6 className='mt-[2px] w-full h-fit'>{SecToMin(songDets[0]?.duration)} Minutes</h6>
          </div>
        </div>

        <div className='h-[86.8vh] w-[50%] pl-6 pt-20'>
          <h2 className='text-4xl font-bold pb-4'>Up Next</h2>
          <div className='h-[38rem] overflow-auto'>
            {
              suggestions?.map((song, index) => <Songlist key={index} {...song} />)
            }

          </div>
        </div>
      </div>
      <Player />
    </>
  )
}

export default Songdetails
