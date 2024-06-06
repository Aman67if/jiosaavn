import React, { useContext } from 'react'
import SearchedSong from './SearchedSong'
import musicContext from '../context/context'

const SearchedSongsContainer = () => {
    const { searchedSong } = useContext(musicContext);
    return (
        <div className={`h-[82.4vh] mt-[1.4vh] w-[99.9%] p-10 flex flex-wrap gap-12 backdrop-blur-md absolute top-11 translate-x-0 translate-y-0 ${searchedSong.length === 0 ? "hidden" : ""}`}>
            {
            searchedSong?.map((song) => <SearchedSong key={song.id} {...song} />)
            }
        </div>
    )
}

export default SearchedSongsContainer
