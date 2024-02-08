import { createContext, useState} from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from './services/firebase'

type User = {
id: string;
name: string;
avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType);

function App() {
  const [user, setUser] = useState<User>();

 async function signInWithGoogle(){
    const provider = new GoogleAuthProvider(); // Supondo que você já importou GoogleAuthProvider
    const result = await signInWithPopup(auth, provider) // Use signInWithPopup com o provedor
          
              if (result.user) {
                  const { displayName, photoURL, uid} = result.user
                  if(!displayName || !photoURL){
                    throw new Error('Missing information from Google Account!')
                  }
                  setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                  })
                }
  }
  return (
    <BrowserRouter>
      <AuthContext.Provider value={{user, signInWithGoogle}}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms/new" element={<NewRoom />} />
      </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;

