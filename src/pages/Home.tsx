import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../services/firebase'

export function Home(){
    const navigate = useNavigate();

    function handleCreateRoom(){
        const provider = new GoogleAuthProvider(); // Supondo que você já importou GoogleAuthProvider
    
        signInWithPopup(auth, provider) // Use signInWithPopup com o provedor
            .then((result) => {
                console.log(result);
                // Navega para a rota '/rooms/new' apenas após o usuário ter sido autenticado com sucesso
                navigate('/rooms/new');
            })
            .catch((error) => {
                console.error('Error signing in:', error);
            });
    }


    return(
    <div id='page-auth'>
        <aside> 
            <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
            <strong>Crie salas de Q&A ao-vivo</strong>
            <p>Tire as dúvidas de sua audiência em tempo real</p>
        </aside>
        <main>
            <div className='main-content'>
                <img src={logoImg} alt="Letmeask" />
                <button onClick={handleCreateRoom} className='create-room'>
                    <img src={googleIconImg} alt="Logo do Google" />
                    Crie sua sala com o Google
                </button>
                <div className='separator'> 
                    Ou entre em uma sala  
                </div>
                    <form>
                        <input 
                        type="text" 
                        placeholder='Digite o código da sala'
                        />
                        <Button type='submit'>
                            Entrar na sala
                        </Button>
                    </form>
               
            </div>
        </main>
    </div>
    )

}