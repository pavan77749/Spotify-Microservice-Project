import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import type { Song } from "../context/SongContext";
import { useSongData } from "../context/SongContext";
import { useUserData } from "../context/UserContext";
import { FaBookmark, FaPlay, FaPause, FaRegHeart, FaClock, FaEllipsisH } from "react-icons/fa";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

const PlayList = () => {
  const { songs, setIsPlaying, setSelectedSong, loading, IsPlaying, selectedSong } = useSongData();
  const { user, addToPlaylist } = useUserData();
  const [myPlayList, setMyPlayList] = useState<Song[]>([]);
  const [hoveredSong, setHoveredSong] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      Array.isArray(songs?.albums) &&
      Array.isArray(user?.user?.playlist)
    ) {
      const filteredSongs = songs.albums.filter((song) =>
        user.user.playlist.includes(song.id.toString())
      );
      setMyPlayList(filteredSongs);
    }
  }, [songs, user]);




  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black">
      <Layout>
        {loading ? (
          <Loading />
        ) : (
          <div className="px-6 pb-6">
            {/* Playlist Header */}
            <div className="flex items-end gap-6 mb-8 pt-16  ">
              <div className="relative group">
                <img 
                  src="/download.png" 
                  className="w-60 h-60 object-cover rounded-lg shadow-2xl transition-transform group-hover:scale-105" 
                  alt="Playlist cover" 
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="flex flex-col justify-end pb-4">
                <p className="text-sm font-medium text-white/70 mb-2">PLAYLIST</p>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                  {user?.user?.name}'s Playlist
                </h1>
                <p className="text-white/70 mb-4">Your favorite songs, all in one place</p>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <img src="/logo.png" className="w-6 h-6 rounded-full" alt="Logo" />
                  <span className="font-medium">{user?.name}</span>
                  <span>•</span>
                  <span>{myPlayList.length} songs</span>
                 
                </div>
              </div>
            </div>

            {/* Playlist Controls */}
            <div className="flex items-center gap-6 mb-8">
              <button 
                className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 hover:scale-105 transition-all duration-200 shadow-lg"
                onClick={() => {
                  if (myPlayList.length > 0) {
                    setSelectedSong(myPlayList[0].id);
                    setIsPlaying(true);
                  }
                }}
              >
                <FaPlay className="text-black text-lg ml-1" />
              </button>
              
             
            </div>

            {/* Songs List */}
            <div className="bg-black/20 rounded-lg">
              {/* Table Header */}
              <div className="grid grid-cols-[16px_1fr_1fr_16px] gap-4 px-4 py-3 text-sm font-medium text-white/60 border-b border-white/10">
                <div className="flex justify-center">
                  <span>#</span>
                </div>
                <div>TITLE</div>
                <div className="hidden md:block">ALBUM</div>
                <div >Actions</div>
              </div>

              {/* Songs */}
              <div className="px-4">
                {myPlayList.map((song, index) => {
                  const isCurrentSong = selectedSong === song.id;
                  const isCurrentlyPlaying = isCurrentSong && IsPlaying;
                  
                  return (
                    <div
                      key={song.id}
                      className="grid grid-cols-[16px_1fr_1fr_16px] gap-4 py-3 group hover:bg-white/5 rounded-md px-2 -mx-2 transition-colors cursor-pointer"
                      onMouseEnter={() => setHoveredSong(index)}
                      onMouseLeave={() => setHoveredSong(null)}
                      onClick={() => {
                        setSelectedSong(song.id);
                        setIsPlaying(true);
                      }}
                    >
                      {/* Track Number / Play Button */}
                      <div className="flex items-center justify-center">
                        {hoveredSong === index || isCurrentSong ? (
                          <button
                            className="text-white hover:scale-110 transition-transform"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isCurrentSong) {
                                setIsPlaying(!IsPlaying);
                              } else {
                                setSelectedSong(song.id);
                                setIsPlaying(true);
                              }
                            }}
                          >
                            {isCurrentlyPlaying ? <FaPause /> : <FaPlay />}
                          </button>
                        ) : (
                          <span className={`text-sm ${isCurrentSong ? 'text-green-500' : 'text-white/60'}`}>
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* Title and Artist */}
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={song.thumbnail || "/download.jpeg"}
                          className="w-10 h-10 object-cover rounded flex-shrink-0"
                          alt={song.title}
                        />
                        <div className="min-w-0">
                          <p className={`font-medium truncate ${isCurrentSong ? 'text-green-500' : 'text-white'}`}>
                            {song.title}
                          </p>
                          
                        </div>
                      </div>

                      {/* Album */}
                      <div className="hidden md:flex items-center">
                        <p className="text-sm text-white/60 truncate">
                          {song.album || song.description?.slice(0, 30) + '...' || 'Unknown Album'}
                        </p>
                      </div>

                      {/* Actions and Duration */}
                      <div className="flex items-center justify-center gap-3">
                        <button
                          className="opacity-0 group-hover:opacity-100 text-white/60 hover:text-white transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToPlaylist(song.id);
                          }}
                        >
                          <FaBookmark />
                        </button>
                       
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Empty State */}
            {myPlayList.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaBookmark className="text-3xl text-white/60" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Your playlist is empty
                </h3>
                <p className="text-white/60 mb-6">
                  Find songs you love and add them to your playlist
                </p>
                <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform" onClick={()=>navigate("/")}>
                  Browse Music
                </button>
              </div>
            )}
          </div>
        )}
      </Layout>
    </div>
  );
};

export default PlayList;