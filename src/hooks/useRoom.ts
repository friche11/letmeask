// React
import { useState } from 'react';
import { useEffect } from 'react';

// Firebase services
import { onValue, DataSnapshot } from 'firebase/database';
import { database, ref } from '../services/firebase';

import { useAuth } from './useAuth'

type QuestionType = {
    id: string;
    author: {
      name: string;
      avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
  }

  type FirebaseQuestions = Record<string, {
    author: {
      name: string;
      avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>
  }>

export function useRoom(roomId: string) {
const { user } = useAuth();
const [questions, setQuestions] = useState<QuestionType[]>([])
const [title, setTitle] = useState('');

useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);

    const unsubscribe = onValue(roomRef, (snapshot: DataSnapshot) => { // Defina o tipo para snapshot
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
              likeCount: Object.values(value.likes ?? {}).length,
              likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
            }
          });
          setTitle(title);
          setQuestions(parsedQuestions);
        }
      });
      return() => {
        unsubscribe();
      }
    }, [roomId, user?.id]);

return {questions,title};
}