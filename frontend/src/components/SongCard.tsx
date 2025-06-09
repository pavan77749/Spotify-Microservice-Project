import React from 'react'
import { FaBookmark, FaPlay } from 'react-icons/fa';
import { useSongData } from '../context/SongContext';
import { useUserData } from '../context/UserContext';

interface SongCardProps {
    image: string;
    name: string;
    desc: string;
    id: string;
    }

    
    const SongCard : React.FC<SongCardProps> = ({name,image,desc,id}) => {

     const {setSelectedSong, setIsPlaying} = useSongData()
     const {addToPlaylist,user}  = useUserData()

    

    const handleAddToPlaylist = async () => {
        if (!user) {
            console.error("User is not authenticated");
            return;
        }
        try {
            await addToPlaylist(id);
            console.log("Song added to playlist successfully");
        } catch (error) {
            console.error("Error adding song to playlist:", error);
        }

      }

      return (
    <div className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]">
        <div className="relative group">
            <img src={image ? image :"/download.png"} className="rounded mr-1 w-[160px]" alt={name} />
            <div className="flex gap-2">
                <button onClick={() => {
  console.log("Selected Song ID clicked:", id);
  setSelectedSong(id);
  setIsPlaying(true);
}} className='absolute bottom-2 right-14 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer' ><FaPlay/></button>
                  <button className='absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer' onClick={handleAddToPlaylist}><FaBookmark/></button>
            </div>
        </div>
      <p className='font-bold mt-2 mb-1'>{name}</p>
        <p className='text-slate-200 text-sm'>{desc.slice(0, 18)}...</p>
    </div>
  )
}

export default SongCard
