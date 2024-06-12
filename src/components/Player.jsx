import React, { useContext, useEffect, useRef, useState } from 'react'
import musicContext from '../context/context'

const Player = () => {
    const { SecToMin, isPlaying, playAndPause, volume, toggleVolume, currentSong, songDets, nextSong, prevSong} = useContext(musicContext)
    const progressRef = useRef(0)
    const [isSeeking, setIsSeeking] = useState(false)

    useEffect(() => {
        if (currentSong) {
            const timeUpdate = () => {
                if (!isSeeking) {
                    const currentTime = currentSong.audio.currentTime;
                    const duration = currentSong.audio.duration;
                    const seekBarValue = (currentTime / duration) * 100;
                    progressRef.current.value = seekBarValue;
                }
            }

            currentSong.audio.addEventListener('timeupdate', timeUpdate);
            currentSong.audio.addEventListener('ended', nextSong);

            return () => {
                currentSong.audio.removeEventListener('timeupdate', timeUpdate);
                currentSong.audio.removeEventListener('ended', nextSong);
            }
        }

    }, [currentSong, isSeeking])

    const startSeeking = () => {
        setIsSeeking(true)
    }

    const continueSeeking = (e) => {
        if (isSeeking) {
            let newTime = (parseFloat(e.target.value) / 100) * currentSong.audio.duration;
            progressRef.current.value = newTime / currentSong.audio.duration * 100;
        }
    }

    const endSeeking = (e) => {
        if (isSeeking) {
            setIsSeeking(false)
            let newTime = (parseFloat(e.target.value) / 100) * currentSong.audio.duration;
            currentSong.audio.currentTime = newTime;
            currentSong.audio.play();
        }
    }

    return (
        <div className='absolute bottom-0 flex items-center h-[7rem] w-full p-4 bg-slate-300'>
            <input type="range" ref={progressRef} onMouseDown={startSeeking} onMouseMove={continueSeeking} onMouseUp={endSeeking} onTouchStart={startSeeking} onTouchMove={continueSeeking} onTouchEnd={endSeeking} min={0} max={100} step={0.1} className='absolute top-[-5px] w-[97%] h-[13px]' />
            <div className='absolute bottom-4 flex items-center gap-4'>
                <img src={`${songDets[0] ? songDets[0]?.image[1].url : "/playerimage.svg"}`} alt="song-image" className='h-20 w-auto object-cover' />
                <div>
                    <span className='block h-fit w-fit'>{songDets[0] ? songDets[0]?.name.length > 25 ? songDets[0]?.name.replace(/&quot;/g, '').slice(0, 25) + '...' : songDets[0]?.name.replace(/&quot;/g, '') : "Play a song...."}</span>
                    <span className='block h-fit w-fit'>{
                        songDets[0] ? songDets[0]?.artists.all.map((artist) => artist.name).join(",").length > 28 ?
                            songDets[0]?.artists.all.map((artist) => artist.name).join(",").replace(/&quot;/g, '').slice(0, 28) + "..." :
                            songDets[0]?.artists.all.map((artist) => artist.name).join(",").replace(/&quot;/g, '') : "Hmm......."
                    }
                    </span>
                </div>
            </div>
            <div className='absolute left-[50%] translate-x-[-50%] flex items-center justify-center h-fit w-fit gap-6'>
                <img src="/previous.svg" onClick={() => { prevSong() }} alt="previous" className='h-12 cursor-pointer' />
                <img src={isPlaying ? "/pause.svg" : "/play.svg"} onClick={() => { playAndPause(songDets[0].id, songDets[0].name, songDets[0].artists, songDets[0].image, songDets[0].downloadUrl, songDets[0].duration) }} alt="play" className='h-12 cursor-pointer' />
                <img src="/next.svg" onClick={() => { nextSong() }} alt="next" className='h-12 cursor-pointer' />
            </div>
            <div className='absolute right-3 flex items-center w-fit h-fit gap-4'>
                <h4>{`${SecToMin(currentSong?.audio.currentTime) + ' / ' + SecToMin(currentSong?.duration)}`}</h4>
                <img src="/download.svg" alt="download" className='h-9 cursor-pointer' />
                <img src={volume ? "/volume.svg" : "/mute.svg"} alt="volume" onClick={() => { toggleVolume() }} className='h-9 cursor-pointer' />
                <input type="range" min="0" max="100" className='hidden' />
            </div>
        </div>
    )
}

export default Player
