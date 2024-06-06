import React, { useEffect, useRef, useState } from 'react'
import musicContext from '../context/context'

const GetAccessToken = ({searchQuery}) => {
    const [songUrl, setSongUrl] = useState(null)
    useEffect(() => {
        const fetchToken = async () => {
            const response = await fetch(`https://saavn.dev/api/search/songs?query=${searchQuery}`);
            const data = await response.json();
            console.log(data)
            setSongUrl(data.data.results[0].downloadUrl[4].url)
        };

        fetchToken();
    }, [searchQuery]);
 
    // Audio playing code below

    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(songUrl);
        }else{
            audioRef.current.src = songUrl
        }
        return () => {  
            audioRef.current.pause();
            audioRef.current = null;
        }
    }, [songUrl]);


    const handlePlay = () => {
        if (audioRef.current) {
            console.log(audioRef.current.src)
            console.log('started')
            audioRef.current.play().then(() => { setIsPlaying(true) }).catch(error => { console.error("Error Playing", error) });
        }
    }

    const handlePause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }

    return (
        <musicContext.Provider value={{
            songUrl, 
            setSongUrl,
            }}>
        <div>
            <button onClick={handlePlay} disabled={isPlaying}>play</button>
            <button onClick={handlePause} disabled={!isPlaying}>pause</button>
        </div>
        </musicContext.Provider>

    )
}

export default GetAccessToken
