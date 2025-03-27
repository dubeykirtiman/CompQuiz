import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { generateQuiz, Quiz } from '../lib/gemini';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, RefreshCw, CheckCircle } from 'lucide-react';

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth()!;
  const topic = location.state?.topic;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [savingResults, setSavingResults] = useState(false);

  const loadQuiz = async () => {
    setLoading(true);
    setError('');
    try {
      const generatedQuiz = await generateQuiz(topic);
      setQuiz(generatedQuiz);
      setAnswers([]);
      setCurrentQuestion(0);
      setShowResults(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!topic) {
      navigate('/');
      return;
    }
    loadQuiz();
  }, [topic, navigate]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    quiz!.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        score++;
      }
    });
    return score;
  };

  const handleFinishQuiz = () => {
    setShowResults(true);
  };

  const saveQuizResult = async () => {
    if (!quiz || !currentUser) return;

    const score = calculateScore();
    const percentage = (score / quiz.questions.length) * 100;

    setSavingResults(true);
    try {
      await addDoc(collection(db, 'quizResults'), {
        userId: currentUser.uid,
        topic,
        score,
        totalQuestions: quiz.questions.length,
        percentage,
        questions: quiz.questions,
        userAnswers: answers,
        timestamp: serverTimestamp(),
      });
      navigate('/past-quizzes');
    } catch (err) {
      console.error('Error saving quiz results:', err);
      setError('Failed to save quiz results. Please try again.');
      setSavingResults(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <div className="flex gap-4">
          <button
            onClick={loadQuiz}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / quiz.questions.length) * 100;

    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
            <p className="text-xl text-gray-600">
              Your Score: {score}/{quiz.questions.length} ({percentage.toFixed(1)}%)
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {quiz.questions.map((question, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <p className="font-medium text-gray-800 mb-2">
                  {index + 1}. {question.question}
                </p>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-3 rounded ${
                        option === question.correctAnswer
                          ? 'bg-green-100 border-green-500'
                          : option === answers[index]
                          ? 'bg-red-100 border-red-500'
                          : 'bg-gray-50'
                      } ${
                        option === answers[index] || option === question.correctAnswer
                          ? 'border-2'
                          : 'border border-gray-200'
                      }`}
                    >
                      {option}
                      {option === question.correctAnswer && (
                        <span className="ml-2 text-green-600 text-sm">
                          (Correct Answer)
                        </span>
                      )}
                      {option === answers[index] && option !== question.correctAnswer && (
                        <span className="ml-2 text-red-600 text-sm">
                          (Your Answer)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={saveQuizResult}
              disabled={savingResults}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center"
            >
              {savingResults ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Results'
              )}
            </button>
            <button
              onClick={loadQuiz}
              disabled={savingResults}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Try Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const hasAnsweredAll = answers.length === quiz.questions.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{topic} Quiz</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {question.question}
          </h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`w-full p-4 text-left rounded-lg border ${
                  answers[currentQuestion] === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Previous
          </button>
          
          {isLastQuestion && hasAnsweredAll ? (
            <button
              onClick={handleFinishQuiz}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Finish Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
              disabled={!answers[currentQuestion] || isLastQuestion}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}