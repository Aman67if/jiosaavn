import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Songlist from '../components/Songlist';
import musicContext from '../context/context';
import Player from '../components/Player';
import Navbar from '../components/Navbar';
import SearchedSongsContainer from '../components/SearchedSongsContainer';

const Songdetails = () => {
  const [suggestions, setSuggestions] = useState([]);
  const {
    SecToMin,
    fetchSongById,
    songDets,
    decodeId,
    playMusic } = useContext(musicContext);

  const { id } = useParams();

  const getSongSuggestions = async () => {
    const limit = 14;
    const offset = 0;
    const suggestedSongs = await fetch(`https://saavn.dev/api/songs/${decodeId(id)}/suggestions?limit=${limit}&offset=${offset}`);
    const { data } = await suggestedSongs.json();
    setSuggestions(data);
  }

  useEffect(() => {
    fetchSongById(`${decodeId(id)}`);
    // getSongSuggestions();
  }, [id])

  useEffect(() => {
    getSongSuggestions();
  }, [])


  return (
    <>
      <Navbar />
      <SearchedSongsContainer />
      <div className='h-[86.5vh] w-full flex items-center justify-center'>
        <div className='h-[86.8vh] w-[50%] flex items-center justify-center'>
          <div className='text-center w-full h-fit grid place-items-center'>
            <img src={`${songDets[0]?.image[2].url}`} alt="song-image" className='h-[17rem] w-auto object-cover' />
            <h4 className='mt-[10px] w-full h-fit text-2xl font-semibold'>{songDets[0]?.name.length > 30 ? songDets[0]?.name.slice(0, 30) + '...' : songDets[0]?.name}</h4>
            <h5 className='mt-[5px] w-full h-fit'>
              {songDets[0]?.artists.all.map((artist) => artist.name).join(",").length > 100 ?
                songDets[0]?.artists.all.map((artist) => artist.name).join(",").slice(0, 100) + "..." :
                songDets[0]?.artists.all.map((artist) => artist.name).join(",")}
            </h5>
            <h6 className='mt-[2px] w-full h-fit'>{SecToMin(songDets[0]?.duration)} Minutes</h6>
            <button onClick={() => { playMusic(decodeId(id)) }} className='bg-[#1ECCB0] py-4 px-12 mt-6 rounded-full text-white font-medium text-xl cursor-pointer'>
              Play
            </button>
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
