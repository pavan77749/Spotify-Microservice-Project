import { useParams } from "react-router-dom";
import Layout from "../components/Layout"
import { useSongData } from "../context/SongContext"
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useUserData } from "../context/UserContext";
import { FaBookmark, FaPlay, FaPause } from "react-icons/fa";
import '../index.css'

const Alumb = () => {
    const {fetchAlbumSongs,albumData,albumSong,setIsPlaying,setSelectedSong, loading, selectedSong, IsPlaying} = useSongData();
    const {isAuth,addToPlaylist, } = useUserData();
  

    console.log("Album Data:", albumData);

    const params = useParams<{ id: string }>();

    useEffect(() => {
        if (params.id) {
            fetchAlbumSongs(params.id);
        }
    }, [params.id]);


    return (
        <div>
            <Layout>
                {
                    albumData && (
                        <>
                        {
                            loading ? <Loading/> :<> 
                                <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-center">
                                    {
                                       albumData.thumbnail && (
                                            <div className="relative flex justify-center md:justify-start">
                                                <img 
                                                    src={albumData.thumbnail} 
                                                    alt={albumData.title} 
                                                    className={`w-32 h-32 md:w-48 md:h-48 rounded-full shadow-2xl transition-all duration-500 hover:scale-105 ${
                                                        IsPlaying && selectedSong ? 'scale-110 shadow-green-500/30' : ''
                                                    }`}
                                                    style={{
                                                        animation: IsPlaying && selectedSong ? 'spin 4s linear infinite' : 'none'
                                                    }}
                                                />
                                                {/* CD Center Hole */}
                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 bg-black rounded-full border-2 border-gray-600"></div>
                                                {/* Glowing effect when playing */}
                                                {IsPlaying && selectedSong && (
                                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 animate-pulse"></div>
                                                )}
                                            </div>
                                       )
                                    }
                                    <div className="flex flex-col">
                                        <p className="text-gray-400 text-sm uppercase tracking-wider">Playlist</p>
                                        <h2 className="text-3xl font-bold mb-4 md:text-5xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                            {albumData.title} Playlist
                                        </h2>
                                        <h4 className="text-gray-400 mb-4 max-w-md">{albumData.description}</h4>
                                        <div className="flex items-center gap-2">
                                            <img src="/logo.png" alt="" className="inline-block w-6" />
                                           
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Table Header */}
                                <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 px-4 py-2 text-[#a7a7a7] border-b border-[#ffffff20]">
                                    <p className="flex items-center">
                                        <b className="mr-4">#</b>
                                        <span>Title</span>
                                    </p>
                                    <p className="hidden sm:block">Description</p>
                                    <p className="text-center ">Actions</p>
                                </div>
                                
                                {/* Song List */}
                                {albumSong &&
                                    albumSong.map((song, index) => {
                                        const isCurrentSong = selectedSong === song.id;
                                     
                                        
                                        return (
                                            <div
                                                className={`grid grid-cols-3 sm:grid-cols-4 mt-2 mb-2 px-4 py-3 text-[#a7a7a7] hover:bg-[#ffffff15] rounded-lg cursor-pointer transition-all duration-300 group ${
                                                    isCurrentSong ? 'bg-[#ffffff10] border-l-4 border-green-500' : ''
                                                }`}
                                                key={index}
                                            >
                                                <p className="text-white flex items-center">
                                                    <div className="mr-4 min-w-[20px] flex items-center justify-center">
                                                        {isCurrentSong && IsPlaying ? (
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-1 h-4 bg-green-500 animate-pulse"></div>
                                                                <div className="w-1 h-3 bg-green-500 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                                                <div className="w-1 h-2 bg-green-500 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                                            </div>
                                                        ) : (
                                                            <b className={`text-sm ${isCurrentSong ? 'text-green-500' : 'text-[#a7a7a7]'}`}>
                                                                {index + 1}
                                                            </b>
                                                        )}
                                                    </div>
                                                    <div className="relative">
                                                        <img
                                                            src={song.thumbnail ? song.thumbnail : "/download.jpeg"}
                                                            className="inline w-10 h-10 rounded mr-4 object-cover transition-all duration-300"
                                                            style={{
                                                                animation: isCurrentSong && IsPlaying ? 'spin 3s linear infinite' : 'none',
                                                                transform: isCurrentSong && IsPlaying ? 'scale(1.1)' : 'scale(1)'
                                                            }}
                                                            alt=""
                                                        />
                                                        {/* Mini CD hole effect */}
                                                        {isCurrentSong && IsPlaying && (
                                                            <div className="absolute top-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <span className={`truncate ${isCurrentSong ? 'text-green-400' : 'text-white'}`}>
                                                        {song.title}
                                                    </span>
                                                </p>
                                                
                                                <p className="text-[15px] hidden sm:block text-[#a7a7a7] flex items-center">
                                                    {song.description ? song.description.slice(0, 40) + '...' : 'No description'}
                                                </p>
                                                
                                                <p className="flex justify-center items-center gap-4">
                                                    {isAuth && (
                                                               <button
                              className="text-[15px] text-center cursor-pointer"
                              onClick={() => addToPlaylist(song.id)}
                            >
                              <FaBookmark />
                            </button>
                                                    )}
                                                    <button
                                                        className={`text-[15px] text-center p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
                                                            isCurrentSong 
                                                                ? 'text-white bg-green-500 hover:bg-green-400' 
                                                                : 'text-[#a7a7a7] hover:text-white hover:bg-green-500'
                                                        }`}
                                                        onClick={() => {
                                                            setSelectedSong(song.id);
                                                            setIsPlaying(true);
                                                        }}
                                                    >
                                                        {isCurrentSong && IsPlaying ? <FaPause /> : <FaPlay />}
                                                    </button>
                                                </p>
                                            </div>
                                        );
                                    })
                                }
                            </>
                        }
                        </>
                    )
                }
            </Layout>
            
           
        </div>
    )
}

export default Alumb