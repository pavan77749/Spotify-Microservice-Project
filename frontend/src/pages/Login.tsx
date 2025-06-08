import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserContext';
import { FaSpotify, FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [focusedInput, setFocusedInput] = React.useState('');

    const navigate = useNavigate();
    const { loginUser, btnloading } = useUserData()

    async function submitHandler(e: any) {
        e.preventDefault()
        loginUser(email, password, navigate)
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-green-900 p-4'>
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
            </div>

            <div className="relative bg-black/40 backdrop-blur-xl border border-gray-800/50 text-white p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ">
                {/* Spotify Logo */}
                <div className="flex items-center justify-center mb-4">
                    <FaSpotify className="text-green-500 text-4xl mr-3" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        MusicStream
                    </h1>
                </div>

                <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Welcome Back
                </h2>
                <p className="text-gray-400 text-center mb-8">Login to continue your music journey</p>

                <form className='space-y-6' onSubmit={submitHandler}>
                    {/* Email Input */}
                    <div className="relative">
                        <label className='block text-sm font-medium mb-2 text-gray-300'>
                            Email or Username
                        </label>
                        <div className="relative">
                            <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                                focusedInput === 'email' ? 'text-green-500' : 'text-gray-500'
                            }`} />
                            <input 
                                type="email" 
                                placeholder='Enter your email or username' 
                                className={`w-full pl-12 pr-4 py-4 bg-gray-900/50 border-2 rounded-xl text-white placeholder-gray-500 
                                transition-all duration-300 focus:outline-none focus:ring-0 backdrop-blur-sm
                                ${focusedInput === 'email' 
                                    ? 'border-green-500 bg-gray-900/70 shadow-lg shadow-green-500/20' 
                                    : 'border-gray-700 hover:border-gray-600'
                                }`}
                                value={email} 
                                onChange={e => setEmail(e.target.value)}
                                onFocus={() => setFocusedInput('email')}
                                onBlur={() => setFocusedInput('')}
                                required  
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <label className='block text-sm font-medium mb-2 text-gray-300'>
                            Password
                        </label>
                        <div className="relative">
                            <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                                focusedInput === 'password' ? 'text-green-500' : 'text-gray-500'
                            }`} />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder='Enter your password' 
                                className={`w-full pl-12 pr-12 py-4 bg-gray-900/50 border-2 rounded-xl text-white placeholder-gray-500 
                                transition-all duration-300 focus:outline-none focus:ring-0 backdrop-blur-sm
                                ${focusedInput === 'password' 
                                    ? 'border-green-500 bg-gray-900/70 shadow-lg shadow-green-500/20' 
                                    : 'border-gray-700 hover:border-gray-600'
                                }`}
                                value={password} 
                                onChange={e => setPassword(e.target.value)}
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput('')}
                                required 
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-500 transition-colors duration-200"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                  

                    {/* Login Button */}
                    <button 
                        type='submit' 
                        disabled={btnloading || !email || !password} 
                        className='w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl
                        transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                        focus:outline-none focus:ring-4 focus:ring-green-500/30 relative overflow-hidden group'
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative flex items-center justify-center">
                            {btnloading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing In...
                                </>
                            ) : (
                                "Login"
                            )}
                        </span>
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-700"></div>
                    <span className="px-4 text-gray-500 text-sm">or</span>
                    <div className="flex-1 border-t border-gray-700"></div>
                </div>

             
                {/* Sign Up Link */}
                <div className="text-center mt-8">
                    <p className="text-gray-400">
                        Don't have an account?{' '}
                        <button 
                            type="button"
                            onClick={() => navigate('/register')}
                            className="auth-btn"
                        >
                            Register
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login