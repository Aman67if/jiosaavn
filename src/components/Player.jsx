import React, { useContext, useEffect, useRef, useState } from 'react'
import musicContext from '../context/context';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Player = () => {
    const { SecToMin, isPlaying, playAndPause, volume, toggleVolume, changeVolume, currentSong, songDets, nextSong, prevSong, loop, setLoop, shuffle, setShuffle, isBuffering } = useContext(musicContext);
    const progressRef = useRef(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const [timeupdate, setTimeupdate] = useState(null);

    useEffect(() => {
        if (currentSong) {
            const timeUpdate = () => {
                if (!isSeeking) {
                    const currentTime = currentSong.audio.currentTime;
                    const duration = currentSong.audio.duration;
                    setTimeupdate(currentTime);
                    const seekBarValue = (currentTime / duration) * 100;
                    progressRef.current.value = seekBarValue;
                };
            };

            currentSong.audio.addEventListener('timeupdate', timeUpdate);
            currentSong.audio.addEventListener('ended', nextSong);

            return () => {
                currentSong.audio.removeEventListener('timeupdate', timeUpdate);
                currentSong.audio.removeEventListener('ended', nextSong);
            };
        };

    }, [currentSong, isSeeking])

    const startSeeking = () => {
        setIsSeeking(true)
    };

    const continueSeeking = (e) => {
        if (isSeeking) {
            let newTime = (parseFloat(e.target.value) / 100) * currentSong.audio.duration;
            progressRef.current.value = newTime / currentSong.audio.duration * 100;
            setTimeupdate(newTime);
        };
    };

    const endSeeking = (e) => {
        if (isSeeking) {
            setIsSeeking(false)
            let newTime = (parseFloat(e.target.value) / 100) * currentSong.audio.duration;
            currentSong.audio.currentTime = newTime;
            currentSong.audio.play();
        };
    };

    const songDownload = async () => {
        if (currentSong) {
            try {
                toast.success("Your download is starting...");
                const response = await fetch(currentSong.audio.src);
                if (!response.ok) throw new Error('Network response was not ok');

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');

                link.href = url;
                link.download = `${currentSong.name}.mp3`;
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

            } catch (error) {
                console.error("Failed to download the song", error);
            };
        };
    };

    const songLoop = () => {
        setLoop(!loop);
    };

    const songShuffle = () => {
        setShuffle(!shuffle);
    };


    return (
        <div className='absolute bottom-0 flex items-center h-[7rem] w-full p-4 bg-slate-300'>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition:Bounce />
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
                <svg onClick={() => songShuffle()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`h-8 ${shuffle ? "fill-[#1FCCB3]" : "#000"}`}>
                    <path d="M18 17.8832V16L23 19L18 22V19.9095C14.9224 19.4698 12.2513 17.4584 11.0029 14.5453L11 14.5386L10.9971 14.5453C9.57893 17.8544 6.32508 20 2.72483 20H2V18H2.72483C5.52503 18 8.05579 16.3312 9.15885 13.7574L9.91203 12L9.15885 10.2426C8.05579 7.66878 5.52503 6 2.72483 6H2V4H2.72483C6.32508 4 9.57893 6.14557 10.9971 9.45473L11 9.46141L11.0029 9.45473C12.2513 6.5416 14.9224 4.53022 18 4.09051V2L23 5L18 8V6.11684C15.7266 6.53763 13.7737 8.0667 12.8412 10.2426L12.088 12L12.8412 13.7574C13.7737 15.9333 15.7266 17.4624 18 17.8832Z"></path>
                </svg>
                <img src="/previous.svg" onClick={() => { prevSong() }} alt="previous" className='h-12 cursor-pointer' />
                <img src={isPlaying ? "/pause.svg" : "/play.svg"} onClick={() => { playAndPause(songDets[0].id, songDets[0].name, songDets[0].artists, songDets[0].image, songDets[0].downloadUrl, songDets[0].duration) }} alt="play" className='h-12 cursor-pointer' />
                <img src="/loader.svg" alt="loader" className={`${isBuffering ? "visible" : "hidden"} h-[6.5rem] absolute top-[-28px] left-[6.2rem]`} />
                <img src="/next.svg" onClick={() => { nextSong() }} alt="next" className='h-12 cursor-pointer' />
                <svg onClick={() => songLoop()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='h-10' color={`${loop ? "#1FCCB3" : "#000"}`} fill="none">
                    <path d="M16.3884 3L17.3913 3.97574C17.8393 4.41165 18.0633 4.62961 17.9844 4.81481C17.9056 5 17.5888 5 16.9552 5H9.19422C5.22096 5 2 8.13401 2 12C2 13.4872 2.47668 14.8662 3.2895 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7.61156 21L6.60875 20.0243C6.16074 19.5883 5.93673 19.3704 6.01557 19.1852C6.09441 19 6.4112 19 7.04478 19H14.8058C18.779 19 22 15.866 22 12C22 10.5128 21.5233 9.13383 20.7105 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13 15L13 9.31633C13 9.05613 12.7178 8.90761 12.52 9.06373L11 10.2636" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className='absolute right-3 flex items-center w-fit h-fit gap-4'>
                <h4>{`${SecToMin(timeupdate) + ' / ' + SecToMin(currentSong?.duration)}`}</h4>
                <img src="/download.svg" alt="download" onClick={() => songDownload()} className='h-9 cursor-pointer' />
                <img src={volume ? "/volume.svg" : "/mute.svg"} alt="volume" onClick={() => { toggleVolume() }} className='h-9 cursor-pointer' />
                <input onChange={(e) => {changeVolume(e)}} type="range" min={0} max={1} step={0.01} className='h-2 top-[-5rem] right-[-2.5rem] hidden lg:block' />
            </div>
        </div>
    )
}

export default Player
