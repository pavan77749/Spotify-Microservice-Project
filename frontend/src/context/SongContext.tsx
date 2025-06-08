import axios from 'axios';
import React, {createContext,useCallback,useContext,useEffect,useState} from 'react';
import type { ReactNode } from 'react';


const server = "http://localhost:8000";

export interface Song {
    id: string,
    title: string,
    description: string,
    thumbnail: string,
    audio: string,
    album: string,
}

interface SongContextType {
    songs: Song[],
    song: Song | null,
    IsPlaying: boolean,
    setIsPlaying: (value: boolean) => void,
    loading: boolean,
    selectedSong: string | null,
    setSelectedSong: (id: string) => void,
    albums: Album[],
    fetchSingleSong: () => Promise<void>,
     nextSong: () => void;
  prevSong: () => void;
}

export interface Album {
    id: string,
    title: string,
    description: string,
    thumbnail: string
}

const SongContext = createContext<SongContextType | undefined>(undefined)

interface SongProviderProps {
    children: ReactNode,
}

export const SongProvider : React.FC<SongProviderProps> = ({children}) => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedSong, setSelectedSong] = useState<string | null>(null);
    const [IsPlaying,setIsPlaying] = useState<boolean>(false);
    const [albums, setAlbums] = useState<Album[]>([]);


    const fetchSongs = useCallback(async () => {
        console.log("Fetching songs from server...");
        setLoading(true);
        try {
            const {data} = await axios.get<Song[]>(`${server}/api/v1/song/all`);
            setSongs(data);
            console.log("Songs fetched successfully:", data);
            if (data.length > 1) {
                setSelectedSong(data[0].id.toString()); 
                setIsPlaying(false); 
            }
        } catch (error) {
            console.error("Error fetching songs:", error);
        } finally {
            setLoading(false);
        }
    }, []);


     const [song,setSong] = useState<Song | null>(null);

    const fetchSingleSong = useCallback(async () => {
    if (!selectedSong) return;
    try {
      const { data } = await axios.get<Song>(
        `${server}/api/v1/song/${selectedSong}`
      );
      setSong(data.song);
      console.log("Fetched single song:", data);
    } catch (error) {
      console.log(error);
    }
  }, [selectedSong]);
    

    const fetchAlbums = useCallback(async () => {
        console.log("Fetching albums from server...");
        setLoading(true);
        try {
            const {data} = await axios.get<Album[]>(`${server}/api/v1/album/all`);
            setAlbums(data);
            console.log("Albums fetched successfully:", data);
        } catch (error) {
            console.error("Error fetching albums:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const [index, setIndex] = useState<number>(0);

  const nextSong = useCallback(() => {
    if (index === songs.length - 1) {
      setIndex(0);
      setSelectedSong(songs[0]?.id.toString());
    } else {
      setIndex((prevIndex) => prevIndex + 1);
      setSelectedSong(songs[index + 1]?.id.toString());
    }
  }, [index, songs]);

  const prevSong = useCallback(() => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
      setSelectedSong(songs[index - 1]?.id.toString());
    }
  }, [index, songs]);

    useEffect(() => {
    if (!selectedSong && songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      const randomSong = songs[randomIndex];
      setSelectedSong(randomSong.id); // Use randomSong.id if your field is named differently
      setIsPlaying(true); // Optional: play automatically
      console.log("Auto-selected Random Song:", randomSong.title);
    }
  }, [songs]);
  
    useEffect(() => {
        fetchSongs();
        fetchAlbums();

    }, []);

    return (
        <SongContext.Provider value={{songs ,selectedSong,setIsPlaying,setSelectedSong,IsPlaying,loading,albums,song, fetchSingleSong, nextSong,
        prevSong,}}>
            {children}
        </SongContext.Provider>
    )
}



export const useSongData = () : SongContextType => {
    const context = useContext(SongContext);
    if (!context) {
        throw new Error("useSongData must be used within a SongProvider");
    }
    return context;
}

