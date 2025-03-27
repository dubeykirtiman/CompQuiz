import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';

interface QuizResult {
  id: string;
  topic: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
  userAnswers: string[];
  timestamp: any;
}

export default function PastQuizzes() {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const { currentUser } = useAuth()!;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizResults = async () => {
      const q = query(
        collection(db, 'quizResults'),
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const results: QuizResult[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as QuizResult);
      });
      setQuizResults(results);
    };

    fetchQuizResults();
  }, [currentUser]);

  const toggleQuizExpansion = (quizId: string) => {
    setExpandedQuiz(expandedQuiz === quizId ? null : quizId);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Past Quiz Results</h1>

      {quizResults.length === 0 ? (
        <p className="text-gray-600">No quiz results found. Take a quiz to see your results here!</p>
      ) : (
        <div className="space-y-4">
          {quizResults.map((result) => (
            <div key={result.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div
                className="p-6 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleQuizExpansion(result.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {result.topic}
                    </h2>
                    <p className="text-gray-600">
                      Score: {result.score}/{result.totalQuestions} ({result.percentage.toFixed(1)}%)
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(result.timestamp.seconds * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  {expandedQuiz === result.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>

              {expandedQuiz === result.id && (
                <div className="border-t border-gray-200 p-6">
                  {result.questions.map((question, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <p className="font-medium text-gray-800 mb-2">
                        {index + 1}. {question.question}
                      </p>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded ${
                              option === question.correctAnswer
                                ? 'bg-green-100'
                                : option === result.userAnswers[index]
                                ? 'bg-red-100'
                                : 'bg-gray-50'
                            }`}
                          >
                            {option}
                            {option === question.correctAnswer && (
                              <span className="ml-2 text-green-600 text-sm">
                                (Correct Answer)
                              </span>
                            )}
                            {option === result.userAnswers[index] &&
                              option !== question.correctAnswer && (
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
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}