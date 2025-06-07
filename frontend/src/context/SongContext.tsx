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
    IsPlaying: boolean,
    setIsPlaying: (value: boolean) => void,
    loading: boolean,
    selectedSong: string | null,
    setSelectedSong: (id: string) => void,
    albums: Album[],
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

    useEffect(() => {
        fetchSongs();
        fetchAlbums();
    }, []);

    return (
        <SongContext.Provider value={{songs ,selectedSong,setIsPlaying,setSelectedSong,IsPlaying,loading,albums}}>
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
