import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Songdetails from './pages/Songdetails';
import SearchedSongdetails from './pages/SearchedSongDetails';
import Home from './pages/Home';
import musicContext from './context/context';
import { useRef, useState } from 'react';
import { Buffer } from 'buffer';

export default function App() {
  const [songDets, setSongDets] = useState([]);
  const [searchedSong, setSearchedSong] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerDets, setPlayerDets] = useState(null)
  const [timeUpdate, setTimeUpdate] = useState(null)
  const [volume, setVolume] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const retryIntervalRef = useRef(null)

  const encodeId = (id) => Buffer.from(id.toString()).toString('base64')
  const decodeId = (id) => Buffer.from(id, 'base64').toString('ascii');

  const SecToMin = (seconds) => {
    if (isNaN(seconds) || seconds < 0) {
      return "00:00";
    } else {
      const min = Math.floor(seconds / 60);
      const remainSecs = Math.floor(seconds % 60);
      const formattedMin = String(min).padStart(2, '0');
      const formattedSecs = String(remainSecs).padStart(2, '0');
      return `${formattedMin}:${formattedSecs}`;
    }
  }

  const setupAudioEvents = (audio) => {
    audio.volume = volume ? 1 : 0;

    audio.addEventListener('timeupdate', () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      setTimeUpdate(currentTime);
      if (currentTime == duration) {
        setIsPlaying(false)
      }
    })

    audio.addEventListener('waiting', () => {
      setIsBuffering(true);
      handleStall(audio);
    })

    audio.addEventListener('playing', () => {
      setIsBuffering(false);
      clearRetryInterval();
    })

    audio.addEventListener('error', () => {
      handleStall(audio);
    })

    audio.addEventListener('canplaythrough', () => {
      if (!isPlaying && currentSong && currentSong.audio.currentTime > 0) {
        currentSong.audio.play();
        setIsPlaying(true);
        clearRetryInterval();
      }
    })
  }

  const handleStall = (audio) => {
    if (!retryIntervalRef.current) {
      retryIntervalRef.current = setInterval(() => {
        setIsPlaying(false);
        if (audio.readyState >= 3) {
          audio.play().then(() => {
            setIsPlaying(true)
            clearRetryInterval();
          }).catch((error) => console.log('Retrying to play', error));
        }
      }, 2000);
    }
  }

  const clearRetryInterval = () => {
    if (retryIntervalRef.current) {
      clearInterval(retryIntervalRef.current);
      retryIntervalRef.current = null;
      setIsPlaying(true)
    }
  };

  const playMusic = async (id) => {
    if (currentSong && currentSong.id === id) {
      currentSong.audio.play();
      setIsPlaying(true);
    } else {
      if (currentSong) {
        currentSong.audio.pause();
        setIsPlaying(false);
      }
      const newAudio = new Audio(songDets[0].downloadUrl[4].url);
      setCurrentSong({ id, audio: newAudio })
      setPlayerDets(songDets[0]);
      setupAudioEvents(newAudio);
      setIsPlaying(true);
      await newAudio.play();
    }
  }

  const playAndPause = async (id) => {
    if (!playerDets) {

    } else {
      if (currentSong && currentSong.id === id) {
        if (isPlaying) {
          currentSong.audio.pause();
          setIsPlaying(false);
        } else {
          currentSong.audio.play();
          setIsPlaying(true);
        }
      } else {
        if (currentSong) {
          currentSong.audio.pause();
          setIsPlaying(false);
        }
        const newAudio = new Audio(playerDets?.downloadUrl[4].url);
        setCurrentSong({ id, audio: newAudio })
        setIsPlaying(true);
        await newAudio.play();
      }
    }
  }

  const toggleVolume = () => {
    if (currentSong) {
      currentSong.audio.volume = volume ? 0 : 1;
    }
    setVolume(!volume);
  }

  const fetchSongById = async (id) => {
    const song = await fetch(`https://saavn.dev/api/songs/${id}`);
    const { data } = await song.json();
    setSongDets(data);
  }

  return (
    <musicContext.Provider value={{
      SecToMin,
      fetchSongById,
      songDets,
      setSongDets,
      decodeId,
      encodeId,
      playAndPause,
      isPlaying,
      setIsPlaying,
      playerDets,
      timeUpdate,
      playMusic,
      volume,
      setVolume,
      toggleVolume,
      searchedSong,
      setSearchedSong,
      searchInput,
      setSearchInput
    }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/:song/:id' element={<Songdetails />} />
          <Route path='/search/:song/:searchid' element={<SearchedSongdetails />} />
        </Routes>
      </BrowserRouter>
    </musicContext.Provider>
  )
}