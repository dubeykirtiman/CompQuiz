import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Brain, Database, BarChart as ChartBar, Code2, Network, BookOpen } from 'lucide-react';

const topics = [
  { name: 'Python', icon: Code2 },
  { name: 'Statistics', icon: ChartBar },
  { name: 'SQL', icon: Database },
  { name: 'Machine Learning', icon: Brain },
  { name: 'Deep Learning', icon: Network },
  { name: 'Natural Language Processing', icon: BookOpen },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth()!;

  const startQuiz = (topic: string) => {
    navigate('/quiz', { state: { topic } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quiz Dashboard</h1>
        <div>
          <button
            onClick={() => navigate('/past-quizzes')}
            className="mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Past Quizzes
          </button>
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <div
              key={topic.name}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => startQuiz(topic.name)}
            >
              <div className="flex items-center mb-4">
                <Icon className="w-8 h-8 text-blue-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">{topic.name}</h2>
              </div>
              <p className="text-gray-600">
                Test your knowledge in {topic.name} with a generated quiz!
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}