import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserData } from '../context/UserContext'
import { useSongData } from '../context/SongContext';
import { Link } from 'react-router-dom'
import { MdDelete, MdAdd, MdImage, MdMusicNote, MdAlbum, MdHome, MdCloudUpload } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';

const server = "http://localhost:7000";

const Admin = () => {
    const [title, setTitle] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [file, setFile] = React.useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null);
    const [album, setAlbum] = React.useState<string>("");
    const [btnloading, setBtnloading] = React.useState<boolean>(false);
    const [thumbnailLoading, setThumbnailLoading] = React.useState<string>("");
    const [activeTab, setActiveTab] = React.useState<'album' | 'song'>('album');
    const {albums, songs, fetchAlbums, fetchSongs} = useSongData();

    const navigate = useNavigate();
    const { user } = useUserData();

    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
    }

    const thumbnailChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setThumbnailFile(selectedFile);
    }

    const addAlbumHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !file) {
            toast.error("Please fill all fields");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('file', file);

        setBtnloading(true);
        try {
            const { data } = await axios.post(`${server}/api/v1/album/new`, formData, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });

            toast.success(data.message);
            fetchAlbums();
            setTitle("");
            setDescription("");
            setFile(null);
            // Reset file input
            const fileInput = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (error: any) {
            console.error('Error adding album:', error);
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setBtnloading(false);
        }
    }

    const addSongHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !file || !album) {
            toast.error("Please fill all fields");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('file', file);
        formData.append('album', album);

        setBtnloading(true);
        try {
            const { data } = await axios.post(`${server}/api/v1/song/new`, formData, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });

            toast.success(data.message);
            fetchSongs();
            fetchAlbums();
            setTitle("");
            setDescription("");
            setFile(null);
            setAlbum("");
            // Reset file input
            const fileInput = document.querySelector('input[type="file"][accept="audio/*"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (error: any) {
            console.error('Error adding song:', error);
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setBtnloading(false);
        }
    }

    const addThumbnailHandler = async (id: string) => {
        if (!thumbnailFile) {
            toast.error("Please select a thumbnail file");
            return;
        }

        const formData = new FormData();
        formData.append('file', thumbnailFile);

        setThumbnailLoading(id);
        try {
            const { data } = await axios.post(`${server}/api/v1/song/${id}`, formData, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });

            toast.success(data.message);
            fetchSongs();
            setThumbnailFile(null);
            // Reset the specific file input
            const fileInput = document.querySelector(`#thumbnail-${id}`) as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (error: any) {
            console.error('Error adding thumbnail:', error);
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setThumbnailLoading("");
        }
    }

    const deleteAlbumHandler = async (id: string) => {
        if (confirm("Are you sure you want to delete this album? This action cannot be undone.")) {
            setBtnloading(true);
            try {
                const { data } = await axios.delete(`${server}/api/v1/album/${id}`, {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                });
                toast.success(data.message);
                fetchAlbums();
                fetchSongs();
            } catch (error: any) {
                console.error('Error deleting album:', error);
                toast.error(error.response?.data?.message || "An error occurred");
            } finally {
                setBtnloading(false);
            }
        }
    }

    const deleteSongHandler = async (id: string) => {
        if (confirm("Are you sure you want to delete this song? This action cannot be undone.")) {
            setBtnloading(true);
            try {
                const { data } = await axios.delete(`${server}/api/v1/song/${id}`, {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                });
                toast.success(data.message);
                fetchAlbums();
                fetchSongs();
            } catch (error: any) {
                console.error('Error deleting song:', error);
                toast.error(error.response?.data?.message || "An error occurred");
            } finally {
                setBtnloading(false);
            }
        }
    }

    useEffect(() => {
        if (!user || user?.user?.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'>
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-2xl border-b border-gray-700 sticky top-0 z-50 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                        <Link
                            to="/"
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <MdHome />
                            Go to home page
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Navigation Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="flex gap-4 bg-gray-800 p-2 rounded-2xl shadow-lg">
                        <button
                            onClick={() => setActiveTab('album')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                activeTab === 'album'
                                    ? 'bg-green-500 text-white shadow-lg transform scale-105'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                            }`}
                        >
                            <MdAlbum />
                            Add Album
                        </button>
                        <button
                            onClick={() => setActiveTab('song')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                activeTab === 'song'
                                    ? 'bg-green-500 text-white shadow-lg transform scale-105'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                            }`}
                        >
                            <MdMusicNote />
                            Add Song
                        </button>
                    </div>
                </div>

                {/* Add Album Form */}
                {activeTab === 'album' && (
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700">
                            <h2 className="text-3xl font-bold mb-8 text-center text-white flex items-center justify-center gap-3">
                                <MdAlbum className="text-green-400" />
                                Add New Album
                            </h2>
                            <form className='flex flex-col items-center justify-center gap-6' onSubmit={addAlbumHandler}>
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Album Title</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Album Title"
                                        required
                                        className="w-full px-4 py-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Album Description</label>
                                    <textarea
                                        placeholder="Enter Album Description"
                                        required
                                        rows={3}
                                        className="w-full px-4 py-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Album Thumbnail</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            required
                                            className="w-full px-4 py-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
                                            onChange={fileChangeHandler}
                                            accept='image/*'
                                        />
                                        <MdCloudUpload className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                                    </div>
                                </div>
                                <button 
                                    type="submit"
                                    className='w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2' 
                                    disabled={btnloading}
                                >
                                    {btnloading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Creating Album...
                                        </>
                                    ) : (
                                        <>
                                            <MdAdd />
                                            Create Album
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Add Song Form */}
                {activeTab === 'song' && (
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700">
                            <h2 className="text-3xl font-bold mb-8 text-center text-white flex items-center justify-center gap-3">
                                <MdMusicNote className="text-green-400" />
                                Add New Song
                            </h2>
                            <form className='flex flex-col items-center justify-center gap-6' onSubmit={addSongHandler}>
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Song Title</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Song Title"
                                        required
                                        className="w-full px-4 py-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Song Description</label>
                                    <textarea
                                        placeholder="Enter Song Description"
                                        required
                                        rows={3}
                                        className="w-full px-4 py-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Select Album</label>
                                    <select
                                        className="w-full px-4 py-4 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        value={album}
                                        onChange={(e) => setAlbum(e.target.value)}
                                        required
                                    >
                                        <option value="">Choose an Album</option>
                                        {albums?.albums?.map((e: any, i: number) => {
                                            return <option key={i} value={e.id}>
                                                {e.title}
                                            </option>
                                        })}
                                    </select>
                                </div>
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Audio File</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            required
                                            className="w-full px-4 py-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
                                            onChange={fileChangeHandler}
                                            accept='audio/*'
                                        />
                                        <MdMusicNote className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                                    </div>
                                </div>
                                <button 
                                    type="submit"
                                    className='w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2' 
                                    disabled={btnloading}
                                >
                                    {btnloading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Uploading Song...
                                        </>
                                    ) : (
                                        <>
                                            <MdAdd />
                                            Upload Song
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Albums Section */}
                <div className="mb-12">
                    <h3 className='text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent'>
                        Manage Albums ({albums?.albums?.length || 0})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {albums?.albums?.map((e: any, i: number) => {
                            return (
                                <div key={i} className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-green-500 transition-all duration-300 hover:transform hover:scale-105 group">
                                    <div className="relative overflow-hidden rounded-xl mb-4">
                                        <img src={e.thumbnail} alt={e.title} className='w-full h-48 object-cover shadow-md group-hover:scale-110 transition-transform duration-300' />
                                        
                                    </div>
                                    <h4 className='text-xl font-bold text-white mb-2 truncate' title={e.title}>
                                        {e.title}
                                    </h4>
                                    <p className='text-gray-400 text-sm mb-4 line-clamp-2' title={e.description}>
                                        {e.description}
                                    </p>
                                    <button 
                                        className='w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105' 
                                        onClick={() => deleteAlbumHandler(e.id)}
                                        disabled={btnloading}
                                    >
                                        <MdDelete />
                                        { 'Delete Album'}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                    {(!albums?.albums || albums.albums.length === 0) && (
                        <div className="text-center py-16 bg-gray-800 rounded-2xl border border-gray-700">
                            <MdAlbum className="text-8xl text-gray-500 mx-auto mb-6" />
                            <p className="text-gray-400 text-xl mb-2">No albums created yet</p>
                            <p className="text-gray-500 text-sm">Create your first album to get started</p>
                        </div>
                    )}
                </div>

                {/* Songs Section */}
                <div>
                    <h3 className='text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent'>
                        Manage Songs ({songs?.albums?.length || 0})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {songs?.albums?.map((e: any, i: number) => {
                            return (
                                <div key={i} className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-green-500 transition-all duration-300 hover:transform hover:scale-105 group">
                                    {e.thumbnail ? (
                                        <div className="relative overflow-hidden rounded-xl mb-4">
                                            <img src={e.thumbnail} alt={e.title} className='w-full h-48 object-cover shadow-md group-hover:scale-110 transition-transform duration-300' />
                                         
                                        </div>
                                    ) : (
                                        <div className="flex flex-col justify-center items-center gap-3 mb-4 p-4 bg-gray-700 rounded-xl border-2 border-dashed border-gray-600">
                                            <div className="w-full h-32 bg-gray-600 rounded-xl flex items-center justify-center">
                                                <MdImage className="text-5xl text-gray-400" />
                                            </div>
                                            <div className="w-full">
                                                <label className="block text-xs font-medium text-gray-300 mb-1">Add Thumbnail</label>
                                                <input 
                                                    id={`thumbnail-${e.id}`}
                                                    type="file" 
                                                    onChange={thumbnailChangeHandler}
                                                    accept="image/*"
                                                    className="w-full text-xs text-gray-400 bg-gray-600 border border-gray-500 rounded-lg px-2 py-1 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
                                                />
                                            </div>
                                            <button 
                                                className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105'
                                                disabled={thumbnailLoading === e.id} 
                                                onClick={() => addThumbnailHandler(e.id)}
                                            >
                                                {thumbnailLoading === e.id ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <MdCloudUpload />
                                                        Upload Thumbnail
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                    <h4 className='text-xl font-bold text-white mb-2 truncate' title={e.title}>
                                        {e.title}
                                    </h4>
                                    <p className='text-gray-400 text-sm mb-4 line-clamp-2' title={e.description}>
                                        {e.description}
                                    </p>
                                    <button 
                                        className='w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105' 
                                        onClick={() => deleteSongHandler(e.id)}
                                        disabled={btnloading}
                                    >
                                        <MdDelete />
                                        { 'Delete Song'}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                    {(!songs?.albums || songs.albums.length === 0) && (
                        <div className="text-center py-16 bg-gray-800 rounded-2xl border border-gray-700">
                            <MdMusicNote className="text-8xl text-gray-500 mx-auto mb-6" />
                            <p className="text-gray-400 text-xl mb-2">No songs uploaded yet</p>
                            <p className="text-gray-500 text-sm">Upload your first song to get started</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Admin