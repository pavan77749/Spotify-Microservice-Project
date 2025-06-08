import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import toast, {Toaster} from "react-hot-toast"

const server = 'http://localhost:5000';

export interface User {
  _id: string,
  name: string,
  email: string,
    role: string,
    playlist: string[],
}

interface UserContextType {
    user: User | null;
    isAuth: boolean;
    loading:boolean;
    btnloading:boolean;
    loginUser:(
        email:string,
        password:string,
        navigate: (path: string) => void
     ) => Promise<void>,
     registerUser:(
        name:string,
        email:string,
        password:string,
        navigate:(path: string) => void
     ) => Promise<void>
    }
     

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [isAuth,setIsAuth] =  React.useState<boolean>(false);
    const [btnloading , setBtnloading] = useState(false)


    async function loginUser(
        email:string,
        password:string,
        navigate: (path: string) => void
    ) {
        setBtnloading(true)
        try {
            const {data} = await axios.post(`${server}/api/v1/user/login`, {
                email,password
            })

            toast.success(data.message)
            localStorage.setItem("token", data.token)
            setUser(data.user)
            setIsAuth(true)
            setBtnloading(false)
            navigate("/")

        } catch (error : any) {
            console.log("Error in Login User", error)
            toast.error(error.response?.data?.message || "An error Occured" )
            setBtnloading(false)
        }
        
    }

    async function registerUser(
        name:string,
        email:string,
        password:string,
        navigate: (path: string) => void
    )
 {
        setBtnloading(true)
        try {
            const {data} = await axios.post(`${server}/api/v1/user/register`, {
                email,password,name
            })

            toast.success(data.message)
            localStorage.setItem("token", data.token)
            setUser(data.user)
            setIsAuth(true)
            setBtnloading(false)
            navigate("/")

        } catch (error : any) {
            console.log("Error in Login User", error)
            toast.error(error.response?.data?.message || "An error Occured" )
            setBtnloading(false)
        }
}

    async function fetchUser() {
        try {
            const {data} = await axios.get(`${server}/api/v1/user/me`, {
                headers: {
                    token: localStorage.getItem('token') || '',
                },
            });
            console.log('User data fetched:', data);
         
            setUser(data);
            setIsAuth(true);
            setLoading(false)
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false)
        }
    }

       useEffect(()=>{
        fetchUser();
       },[])
    

    return (
        <UserContext.Provider value={{user,loading,isAuth,btnloading,loginUser,registerUser}}>
            {children}
            <Toaster/>
        </UserContext.Provider>
    );
}  


export const useUserData  = () => {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error('useUserData must be used within a UserProvider');
    }
    return context;
}


