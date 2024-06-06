import React, { useContext } from 'react'
import musicContext from '../context/context'
import { useParams } from 'react-router-dom'

const Player = () => {
    const { playerDets, SecToMin, timeUpdate, isPlaying, playAndPause, volume, setVolume, toggleVolume } = useContext(musicContext)
    const { id, searchid } = useParams()

    return (
        <div className='absolute bottom-0 flex items-center h-[7rem] w-full p-4 bg-slate-300'>
            <div className='absolute bottom-4 flex items-center gap-4'>
                <img src={`${playerDets ? playerDets?.image[1].url : "../playerimage.svg"}`} alt="song-image" className='h-20 w-auto object-cover' />
                <div>
                    <span className='block h-fit w-fit'>{playerDets ? playerDets?.name.length > 25 ? playerDets?.name.slice(0, 25) + '...' : playerDets?.name : "Play a song...."}</span>
                    <span className='block h-fit w-fit'>{
                        playerDets ? playerDets?.artists.all.map((artist) => artist.name).join(",").length > 28 ?
                            playerDets?.artists.all.map((artist) => artist.name).join(",").slice(0, 28) + "..." :
                            playerDets?.artists.all.map((artist) => artist.name).join(",") : "Hmm......."
                    }
                    </span>
                </div>
            </div>
            <div className='absolute left-[50%] translate-x-[-50%] flex items-center justify-center h-fit w-fit gap-6'>
                <img src="/previous.svg" alt="previous" className='h-12 cursor-pointer' />
                <img src={isPlaying ? "/pause.svg" : "/play.svg"} onClick={() => { playAndPause(playerDets?.id) }} alt="play" className='h-12 cursor-pointer' />
                <img src="/next.svg" alt="next" className='h-12 cursor-pointer' />
            </div>
            <div className='absolute right-3 flex items-center w-fit h-fit gap-4'>
                <h4>{`${SecToMin(timeUpdate) + ' / ' + SecToMin(playerDets?.duration)}`}</h4>
                <img src="/download.svg" alt="download" className='h-9 cursor-pointer' />
                <img src={volume ? "/volume.svg" : "/mute.svg"} alt="volume" onClick={() => { toggleVolume() }} className='h-9 cursor-pointer' />
                <input type="range" min="0" max="100" className='hidden' />
            </div>
        </div>
    )
}

export default Player
