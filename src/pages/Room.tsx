import { useEffect } from 'react';
import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database, ref, push } from '../services/firebase';
import { onValue, DataSnapshot } from 'firebase/database';
import { Question } from '../components/Question';

import '../styles/room.scss';

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}>

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}

type RoomParams = {
  id: string;
}

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('');
  const roomId = params.id || '';
  

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);

    onValue(roomRef, (snapshot: DataSnapshot) => { // Defina o tipo para snapshot
        const databaseRoom = snapshot.val(); // Use snapshot.val() para acessar os dados do snapshot
        if (databaseRoom) {
          const title = databaseRoom.title ?? '';
          const questions = databaseRoom.questions ?? {};
          const firebaseQuestions: FirebaseQuestions = questions;
          const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
            return {
              id: key,
              content: value.content,
              author: value.author,
              isHighlighted: value.isHighlighted,
              isAnswered: value.isAnswered,
            }
          });
          setTitle(title);
          setQuestions(parsedQuestions);
        }
      });
    }, [roomId]);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false
    };

    await push(ref(database, `rooms/${roomId}/questions`), question);

    setNewQuestion('');
  }

  return (
    
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            { user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            ) }
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
              
          <div className='question-list'>
          {questions.map(question =>{
            return <Question
            key={question.id}
            content={question.content}
            author={question.author}

          />
          
        })}
        </div>  

      </main>
    </div>
  );
}