import { Button, Container, Typography, Box, TextField, Paper } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { Question } from '@/types';
import QuizResults from '@/components/quiz_results';
import LiveQuiz from '@/components/quiz';
import Navbar from '@/components/navbar';
import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [results, setResults] = useState<Array<any> | null>(null);
  const [quizLength, setQuizLength] = useState<number>(3); // Default quiz length

  const handleQuizLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuizLength(Number(event.target.value));
  };

  const handleCreateQuiz = async (type: string) => {
    const response = await axios.post(`/api/quiz/${type}`, { length: quizLength });
    setQuestions(response.data.data.questions);
  };

  return (
    <Container>
      <Navbar />
      <Container maxWidth="sm">
        <Typography variant="h2" align="center" gutterBottom>
          Quiz
        </Typography>
        {!quizCompleted ? (
          !questions ? (
            <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h5" gutterBottom align="center">
                Welcome to the Quiz!
              </Typography>
              <TextField
                label="Number of Questions"
                type="number"
                value={quizLength}
                onChange={handleQuizLengthChange}
                inputProps={{ min: 1 }}
                sx={{ marginBottom: 2, width: '100%' }}
                variant="outlined"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCreateQuiz('')}
                sx={{ marginBottom: 2, width: '100%' }}
              >
                Random Quiz
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCreateQuiz('personalized')}
                sx={{ width: '100%' }}
              >
                Personalized Quiz
              </Button>
            </Paper>
          ) : (
            <LiveQuiz
              questions={questions}
              setQuizCompleted={setQuizCompleted}
              setScore={setScore}
              setResults={setResults}
            />
          )
        ) : (
          results && <QuizResults score={score} results={results} />
        )}
      </Container>
    </Container>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/',
      },
    };
  }
  return {
    props: {},
  };
};

export default Quiz;
