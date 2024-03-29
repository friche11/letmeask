import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react'; 
import {database, ref, get} from '../services/firebase'


export function Home(){
    const navigate = useNavigate();
    const {user, signInWithGoogle} = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom(){
        if(!user){
            await signInWithGoogle();
        }else{
        navigate('/rooms/new');
        }
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();
    
        if (roomCode.trim() === '') {
          return;
        }

        const roomRef = ref(database, `rooms/${roomCode}`);

        const roomSnapshot = await get(roomRef);

        if (!roomSnapshot.exists()) {
            alert('Sala não encontrada.');
            return;
        }

        const roomData = roomSnapshot.val();
        
        if (roomData.endedAt) {
            alert('Sala já foi encerrada.');
            return;
        }
    
        navigate(`/rooms/${roomCode}`);
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
                    <form onSubmit={handleJoinRoom}>
                        <input 
                        type="text" 
                        placeholder='Digite o código da sala'
                        onChange={event =>{setRoomCode(event.target.value)}}
                        value={roomCode}
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