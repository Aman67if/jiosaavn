import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import musicContext from '../context/context'

const SearchedSong = ({ id, name, artists, image }) => {
    const { encodeId, setSearchInput, setSearchedSong } = useContext(musicContext);

    return (
        <Link to={`/search/${name}/${encodeId(id)}`} onClick={() => { setSearchInput(''), setSearchedSong([]) }} className='flex items-center gap-4 bg-[#1FCCB3] w-[46%] h-[6rem] p-2 overflow-hidden border-black border-[2px] rounded-lg cursor-pointer'>
            <img src={`${image[1].url}`} alt="song-image" className='h-20 w-20 rounded-2xl' />
            <div>
                <h3 className='w-[35vw] text-xl'>{name.length > 26 ? name.slice(0, 26) + '...' : name}</h3>
                <p className='w-[35vw]'>
                    {artists.all.map((artist) => artist.name).join(",").length > 15 ?
                        artists.all.map((artist) => artist.name).join(",").slice(0, 15) + "..." :
                        artists.all.map((artist) => artist.name).join(",")}
                </p>
            </div>
        </Link>
    )
}

export default SearchedSong
