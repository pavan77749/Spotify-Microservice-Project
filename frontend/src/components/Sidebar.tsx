import {  useNavigate } from "react-router-dom"
import PlaylistCard from "./PlaylistCard"


const Sidebar = () => {
    const navigate = useNavigate();
  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      <div className="bg-[#121212] h-[15%] rounded flex flex-col justify-around">
        <div className="flex items-center gap-3 pl-8 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/home.png" alt="Logo" className="w-6" />
            <span className="text-xl font-bold">Home</span>
        </div>
          <div className="flex items-center gap-3 pl-8 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/search.png" alt="Logo" className="w-6" />
            <span className="text-xl font-bold">Search</span>
        </div>
         
      </div>
        <div className="bg-[#121212] h-[85%] rounded ">
            <div className="p-4 flex items-center justify-between" onClick={() => navigate("/")}>
               <div className="flex items-center gap-3">
                 <img src="/stack.png" alt="library" className="w-6" />
                <span className="text-xl font-bold"> Your Library</span>
               </div>
               <div className="flex items-center gap-3">
                 <img src="/arrow.png" alt="Logo" className="w-8" />
                <img src="/plus.png" alt="" className="w-8" />
               </div>
            </div>
           
           <div className="" onClick={()=> navigate("/playlist")}>
            <PlaylistCard/>
           </div>

           <div className="p-4 m-2 bg-[#121212] rounded font-semibold flex flex-col items-center gap-1 pl-4 mt-4">
             <h1>Let's findsome podcasts to follow</h1>
             <p className="font-light">We'll keep you update on new episodes</p>
             <button className="px-4 py-1.5 bg-white text-black text-[15px] rounded-full mt-4"> Browse Podcasts</button>
           </div>
    </div>
    </div>
  )
}

export default Sidebar
