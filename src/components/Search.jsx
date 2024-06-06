import { useContext, useEffect, useState } from 'react'
import musicContext from '../context/context';

const Search = () => {
  const { setSearchedSong, searchInput, setSearchInput } = useContext(musicContext)

  const SearchSong = async (e) => {
    const response = await fetch(`https://saavn.dev/api/search/songs?query=${searchInput}`);
    const { data } = await response.json();
    setSearchInput(e.target.value);
    if (data.results.length === 0 || e.target.value == '' || e.target.value.length == 0) {
      setSearchedSong([])
    } else {
      setSearchedSong(data.results)
    }
  };

  return (
    <div className='p-4'>
      <input onChange={SearchSong} type="text" placeholder='Search' className='border border-gray-300 rounded-full px-4 py-2 w-[23rem] bg-white flex items-center justify-center mr-44 center' />
    </div>
  )
}

export default Search
