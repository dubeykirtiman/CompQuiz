import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize with API key directly
const genAI = new GoogleGenerativeAI('AIzaSyB8qBTYRQnMlOX6a2ZWG3423wGsAz9aM5A', {
  headers: {
    'Content-Type': 'application/json',
  }
});

const sampleQuiz = {
  questions: [
    {
      question: "What is the primary purpose of Python's list comprehension?",
      options: [
        "To create new lists based on existing iterables",
        "To sort lists automatically",
        "To delete elements from a list",
        "To merge multiple lists"
      ],
      correctAnswer: "To create new lists based on existing iterables"
    },
    {
      question: "Which of the following is a valid Python list comprehension syntax?",
      options: [
        "[x for x in range(10)]",
        "[loop x in range(10)]",
        "for x in range(10)[]",
        "(x for x in range(10))"
      ],
      correctAnswer: "[x for x in range(10)]"
    },
    {
      question: "What is the time complexity of accessing an element in a Python list by index?",
      options: [
        "O(1)",
        "O(n)",
        "O(log n)",
        "O(n²)"
      ],
      correctAnswer: "O(1)"
    },
    {
      question: "Which Python data structure is mutable and ordered?",
      options: [
        "List",
        "Tuple",
        "String",
        "Set"
      ],
      correctAnswer: "List"
    },
    {
      question: "What is the purpose of the 'self' parameter in Python class methods?",
      options: [
        "To reference the instance of the class",
        "To create a new instance",
        "To delete the instance",
        "To access static methods"
      ],
      correctAnswer: "To reference the instance of the class"
    }
  ]
};

const sampleQuizzes = {
  'Python': sampleQuiz,
  'Statistics': {
    questions: [
      {
        question: "What measure represents the middle value in a sorted dataset?",
        options: ["Mean", "Median", "Mode", "Range"],
        correctAnswer: "Median"
      },
      {
        question: "Which measure of spread represents the difference between the largest and smallest values?",
        options: ["Variance", "Standard Deviation", "Range", "Interquartile Range"],
        correctAnswer: "Range"
      },
      {
        question: "What is the probability of getting heads when flipping a fair coin?",
        options: ["0.25", "0.5", "0.75", "1"],
        correctAnswer: "0.5"
      },
      {
        question: "Which test is used to compare means between two independent groups?",
        options: ["t-test", "chi-square test", "ANOVA", "regression"],
        correctAnswer: "t-test"
      },
      {
        question: "What does R² represent in regression analysis?",
        options: [
          "Coefficient of determination",
          "Correlation coefficient",
          "Standard error",
          "P-value"
        ],
        correctAnswer: "Coefficient of determination"
      }
    ]
  },
  'SQL': {
    questions: [
      {
        question: "Which SQL clause is used to filter rows?",
        options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
        correctAnswer: "WHERE"
      },
      {
        question: "What type of JOIN returns all matching records from both tables?",
        options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
        correctAnswer: "INNER JOIN"
      },
      {
        question: "Which SQL function returns the number of rows in a result set?",
        options: ["COUNT()", "SUM()", "AVG()", "MAX()"],
        correctAnswer: "COUNT()"
      },
      {
        question: "What clause is used to group rows that have the same values?",
        options: ["GROUP BY", "ORDER BY", "HAVING", "WHERE"],
        correctAnswer: "GROUP BY"
      },
      {
        question: "Which statement is used to add new rows to a table?",
        options: ["INSERT INTO", "UPDATE", "DELETE", "ALTER"],
        correctAnswer: "INSERT INTO"
      }
    ]
  },
  'Machine Learning': {
    questions: [
      {
        question: "What is the main purpose of cross-validation in machine learning?",
        options: [
          "To assess model performance on unseen data",
          "To train the model faster",
          "To reduce model complexity",
          "To increase model accuracy"
        ],
        correctAnswer: "To assess model performance on unseen data"
      },
      {
        question: "Which algorithm is commonly used for classification problems?",
        options: ["Random Forest", "Linear Regression", "K-means", "PCA"],
        correctAnswer: "Random Forest"
      },
      {
        question: "What is overfitting in machine learning?",
        options: [
          "Model performs well on training data but poorly on new data",
          "Model performs poorly on all data",
          "Model is too simple",
          "Model trains too quickly"
        ],
        correctAnswer: "Model performs well on training data but poorly on new data"
      },
      {
        question: "Which metric is commonly used for regression problems?",
        options: ["RMSE", "Accuracy", "Precision", "Recall"],
        correctAnswer: "RMSE"
      },
      {
        question: "What is feature scaling used for?",
        options: [
          "Normalizing feature values to a similar scale",
          "Reducing number of features",
          "Increasing model complexity",
          "Creating new features"
        ],
        correctAnswer: "Normalizing feature values to a similar scale"
      }
    ]
  },
  'Deep Learning': {
    questions: [
      {
        question: "What is a neural network activation function?",
        options: [
          "A function that introduces non-linearity",
          "A function that reduces dimensionality",
          "A function that normalizes data",
          "A function that optimizes weights"
        ],
        correctAnswer: "A function that introduces non-linearity"
      },
      {
        question: "Which layer type is commonly used for image recognition?",
        options: ["Convolutional", "Recurrent", "Dense", "Dropout"],
        correctAnswer: "Convolutional"
      },
      {
        question: "What is the purpose of dropout in neural networks?",
        options: [
          "Prevent overfitting",
          "Increase training speed",
          "Reduce memory usage",
          "Improve accuracy"
        ],
        correctAnswer: "Prevent overfitting"
      },
      {
        question: "Which optimization algorithm is commonly used in deep learning?",
        options: ["Adam", "Linear Search", "Binary Search", "Bubble Sort"],
        correctAnswer: "Adam"
      },
      {
        question: "What is backpropagation used for?",
        options: [
          "Updating network weights",
          "Data preprocessing",
          "Feature selection",
          "Model evaluation"
        ],
        correctAnswer: "Updating network weights"
      }
    ]
  },
  'Natural Language Processing': {
    questions: [
      {
        question: "What is tokenization in NLP?",
        options: [
          "Breaking text into smaller units",
          "Combining words into sentences",
          "Removing punctuation",
          "Translating text"
        ],
        correctAnswer: "Breaking text into smaller units"
      },
      {
        question: "Which technique is used to convert words into numerical vectors?",
        options: ["Word Embeddings", "Parsing", "Stemming", "Lemmatization"],
        correctAnswer: "Word Embeddings"
      },
      {
        question: "What is the purpose of stop words removal?",
        options: [
          "Remove common words with little meaning",
          "Correct spelling errors",
          "Identify sentence boundaries",
          "Determine word meanings"
        ],
        correctAnswer: "Remove common words with little meaning"
      },
      {
        question: "Which model architecture is commonly used for sequence-to-sequence tasks?",
        options: ["Transformer", "Decision Tree", "Naive Bayes", "K-means"],
        correctAnswer: "Transformer"
      },
      {
        question: "What is named entity recognition used for?",
        options: [
          "Identifying entities like names and locations",
          "Grammar checking",
          "Sentiment analysis",
          "Machine translation"
        ],
        correctAnswer: "Identifying entities like names and locations"
      }
    ]
  }
};

export async function generateQuiz(topic: string): Promise<Quiz> {
  try {
    // For now, return pre-defined quizzes to avoid API issues
    const quiz = sampleQuizzes[topic as keyof typeof sampleQuizzes];
    if (!quiz) {
      throw new Error(`No quiz available for topic: ${topic}`);
    }
    return quiz;
  } catch (error) {
    console.error('Quiz generation error:', error);
    throw new Error('Failed to generate quiz. Please try again.');
  }
}

export interface Quiz {
  questions: Question[];
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}