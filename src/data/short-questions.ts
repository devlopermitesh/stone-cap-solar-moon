export type ShortQuestion = {
  id: number;
  topic: string;
  question: string;
  answer: string;
};

export const SHORT_QUESTIONS: ShortQuestion[] = [
  {
    id: 1,
    topic: "HTML5",
    question: "What does HTML stand for?",
    answer: "HyperText Markup Language",
  },
  {
    id: 2,
    topic: "CSS3",
    question: "What does CSS stand for?",
    answer: "Cascading Style Sheets",
  },
  {
    id: 3,
    topic: "JavaScript",
    question: "What keyword declares a block-scoped variable that cannot be reassigned?",
    answer: "const",
  },
  {
    id: 4,
    topic: "React",
    question: "Which hook adds local state to a function component?",
    answer: "useState",
  },
  {
    id: 5,
    topic: "Node.js",
    question: "What command initializes a new Node.js project and creates package.json?",
    answer: "npm init",
  },
  {
    id: 6,
    topic: "Git",
    question: "Which Git command stages all current changes for the next commit?",
    answer: "git add .",
  },
  {
    id: 7,
    topic: "SQL",
    question: "Which SQL clause filters rows before grouping is applied?",
    answer: "WHERE",
  },
  {
    id: 8,
    topic: "MongoDB",
    question: "Which MongoDB method inserts a single document into a collection?",
    answer: "insertOne()",
  },
  {
    id: 9,
    topic: "REST APIs",
    question: "Which HTTP status code means Not Found?",
    answer: "404",
  },
  {
    id: 10,
    topic: "DSA",
    question: "Which data structure works on the LIFO (Last In, First Out) principle?",
    answer: "Stack",
  },
];
