import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import '../styles/auth.scss'
import { Button } from '../components/Button'
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import {database, ref, push, child} from '../services/firebase'
import { useNavigate } from 'react-router-dom';


export function NewRoom(){
    const [newRoom, setNewRoom] = useState('');
    const navigate = useNavigate();
    const {user} = useAuth();

    async function handleCreateRoom(event: FormEvent){
        event.preventDefault();

        if (newRoom.trim() === '') {
            return;
          }

          const roomRef = ref(database);
          try {
            // Adiciona um novo nó com os dados da sala
            const firebaseRoom = await push(child(roomRef,'rooms'), {
              title: newRoom,
              authorId: user?.id,
            });
      
            // Obtém a chave gerada para o novo nó
            const roomId = firebaseRoom.key;
      
            // Redireciona para a página da nova sala
            navigate(`/rooms/${roomId}`);
          } catch (error) {
            console.error('Error creating room:', error);
            // Trate o erro aqui, se necessário
          }
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
                <h1>{user?.name}</h1>
                <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                        type="text" 
                        placeholder='Nome da sala'
                        onChange={event =>{setNewRoom(event.target.value)}}
                        value={newRoom}
                        />
                        <Button type='submit'>
                            Criar sala
                        </Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
               
            </div>
        </main>
    </div>
    )

}