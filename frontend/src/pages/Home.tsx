import AlbumCard from "../components/AlbumCard";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import SongCard from "../components/SongCard"; // Uncommented this
import { useSongData } from "../context/SongContext";

const Home = () => {
  const { albums, songs, loading } = useSongData();
  
  // Extract the actual data arrays from the response objects
  const albumsData = albums?.albums || albums || [];
  const songsData = songs?.albums || songs || [];
  
  console.log("Albums:", albums);
  console.log("Songs:", songs);
  
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Layout>
          {/* Albums Section */}
          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
            {albumsData.length > 0 ? (
              <div className="flex overflow-auto">
                {albumsData.map((album, i) => (
                  <AlbumCard
                    key={album.id || i}
                    image={album.thumbnail}
                    name={album.title}
                    desc={album.description}
                    id={album.id}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No albums available</p>
            )}
          </div>

          {/* Songs Section */}
          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>
            {songsData.length > 0 ? (
              <div className="flex overflow-auto">
                {songsData.map((song, i) => (
                  // Use SongCard if available, otherwise AlbumCard
                  <SongCard
                    key={song.id || i}
                    image={song.thumbnail}
                    name={song.title}
                    desc={song.description}
                    id={song.id}
                    
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No songs available</p>
            )}
          </div>
        </Layout>
      )}
    </div>
  );
};

export default Home;