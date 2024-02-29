// React
import { useState } from 'react';
import { useEffect } from 'react';

// Firebase services
import { onValue, DataSnapshot } from 'firebase/database';
import { database, ref } from '../services/firebase';

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

  type FirebaseQuestions = Record<string, {
    author: {
      name: string;
      avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
  }>

export function useRoom(roomId: string) {
const [questions, setQuestions] = useState<QuestionType[]>([])
const [title, setTitle] = useState('');

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

return {questions,title};
}