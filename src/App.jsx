import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Songdetails from './pages/Songdetails';
import SearchedSongDetails from './pages/SearchedSongDetails';
import Home from './pages/Home';
import musicContext from './context/context';
import { useEffect, useRef, useState } from 'react';
import { Buffer } from 'buffer';

export default function App() {
  const [songDets, setSongDets] = useState([]);
  const [searchedSong, setSearchedSong] = useState([])
  const [suggestions, setSuggestions] = useState([]);
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false);
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

  const getSongSuggestions = async (id) => {
    const limit = 60;
    const offset = 0;
    const suggestedSongs = await fetch(`https://saavn.dev/api/songs/${id}/suggestions?limit=${limit}&offset=${offset}`);
    const { data } = await suggestedSongs.json();
    setSuggestions(data);
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
    });

    audio.addEventListener('waiting', () => {
      setIsBuffering(true);
      handleStall(audio);
    });

    audio.addEventListener('playing', () => {
      setIsBuffering(false);
      clearRetryInterval();
    });

    audio.addEventListener('ended', async () => {
      await nextSong();
    });

    audio.addEventListener('error', () => {
      handleStall(audio);
    });

    audio.addEventListener('canplaythrough', () => {
      if (!isPlaying && currentSong && currentSong.audio.currentTime > 0) {
        currentSong.audio.play();
        setIsPlaying(true);
        clearRetryInterval();
      }
    });
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
  };

  const clearRetryInterval = () => {
    if (retryIntervalRef.current) {
      clearInterval(retryIntervalRef.current);
      retryIntervalRef.current = null;
      setIsPlaying(true)
    }
  };

  const playAndPause = async (id, name, artists, image, song, duration) => {
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
      const newAudio = new Audio(song[4].url);
      setCurrentSong({ id, name, artists, image, audio: newAudio, duration })
      setIsPlaying(true);
      fetchSongById(id);
      setupAudioEvents(newAudio);
      await newAudio.play();
    }
  };

  const toggleVolume = () => {
    if (currentSong) {
      currentSong.audio.volume = volume ? 0 : 1;
    }
    setVolume(!volume);
  };

  const fetchSongById = async (id) => {
    const song = await fetch(`https://saavn.dev/api/songs/${id}`);
    const { data } = await song.json();
    setSongDets(data);
  };

  const prevSong = async () => {
    if (currentSong) {
      const index = suggestions.findIndex((song) => song.id === currentSong.id);
      if (index == 0) {
        currentSong.audio.pause();
        const { id, name, artists, image, downloadUrl, duration } = suggestions[suggestions.length - 1];
        await playAndPause(id, name, artists, image, downloadUrl, duration);
      } else if (index >= 0) {
        currentSong.audio.pause();
        const { id, name, artists, image, downloadUrl, duration } = suggestions[index - 1];
        await playAndPause(id, name, artists, image, downloadUrl, duration);
      }
    }
  };

  const nextSong = async () => {
    if (currentSong) {
      const index = suggestions.findIndex((song) => song.id === currentSong.id);
      if (index == suggestions.length - 1 || index == -1) {
        currentSong.audio.pause();
        const { id, name, artists, image, downloadUrl, duration } = suggestions[0];
        await playAndPause(id, name, artists, image, downloadUrl, duration);
      } else if (index >= 0) {
        currentSong.audio.pause();
        const { id, name, artists, image, downloadUrl, duration } = suggestions[index + 1];
        await playAndPause(id, name, artists, image, downloadUrl, duration);
      }
    }
  };


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
      timeUpdate,
      volume,
      setVolume,
      toggleVolume,
      searchedSong,
      setSearchedSong,
      searchInput,
      setSearchInput,
      currentSong,
      suggestions,
      setSuggestions,
      nextSong,
      prevSong,
      getSongSuggestions
    }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/:song/:id' element={<Songdetails />} />
          <Route path='/search/:song/:searchid' element={<SearchedSongDetails />} />
        </Routes>
      </BrowserRouter>
    </musicContext.Provider>
  )
}