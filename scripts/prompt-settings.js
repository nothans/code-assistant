const DEFAULT_CODE_LANGUAGE = "python";

const SYSTEM_PROMPT_EXPLAIN =
  "You are a Python expert. Reply with a detailed explanation of the function or code that you are asked about. When you reply, always suggest 3 follow English prompts to keep the conversation going with each prompt wrapped in the HTML tag: <button>.";

const USER_PROMPT_DEFAULT =
  "Start by asking me what I would like to try in Python";

const DEFAULT_CODE_ACTIONS = ["explain", "copy-to-clipboard"];

const DEFAULT_MODEL = "gpt-4o";

// create array of additional system prompt instructions
const SYSTEM_PROMPT_INSTRUCTIONS = [
  "Provide code when appropriate. When you provide code, wrap the code in the HTML tags: <pre> and <code>.",
  "In each response, include 3 additional creative follow-up prompts, enclosed within the HTML tag: <button>.",
  "When you provide a flashcard, wrap each side of the flashcard in the HTML tags: div with class flashcard-front and div with class flashcard-back.",
];

const prompt_mode_settings = {
  default: {
    system_prompt:
    "You are a Python expert assisting a new user.",
    default_prompt: "How do I plot a sine wave?",
    default_assistant_message: "Hello, what would you like to try in Python?",
    user_prompt_format: "Format lists as HTML.",
    user_prompts: [
      "What is the syntax for creating a matrix?",
      "How can I perform element-wise multiplication?",
      "How do I create a for loop?",
      "How do I create and use functions?",
      "What are the different data types?",
      "How can I read and write data to a file?",
      "How do I generate random numbers?",
      "What is the difference between a script and a function?",
      "How can I create a 3D plot?",
      "How do I solve a system of linear equations?",
      "How can I perform numerical integration?",
      "How do I find the roots of a polynomial?",
      "What are the different types of loops?",
      "How can I create a histogram?",
      "How do I use conditional statements?",
      "How do I work with complex numbers?",
      "What are the best practices for optimizing code?",
      "How can I create and manipulate strings?",
      "How do I use built-in functions?",
    ],
    temperature: 0.0,
  },  
  math: {
    system_prompt:
      "You are a math expert and teaching a new person linear algebra, calculus, and other math for engineering.",
    default_prompt: "What is a matrix?",
    default_assistant_message:
      "Hello, let me help you with your math questions.",
    user_prompt_format: "",
    user_prompts: [
      "How do I solve a system of linear equations?",
      "How do I find the inverse of a matrix?",
      "How do I find the determinant of a matrix?",
      "How do I find the eigenvalues and eigenvectors of a matrix?",
      "What are some applications of matrices in engineering?",
      "What is an integral?",
      "What is a derivative?",
      "What is a limit?",
      "What are some real-world examples of using matrices to solve systems of linear equations?",
      "What is a Fourier series?",
      "What is a Laplace transform?",
    ],
    temperature: 0.0,
  },
  flashcard: {
    system_prompt:
      "You are a Python expert assisting a new user. Create a flashcard to help the user learn the python code with a question on the front and the answer on the back.",
    default_prompt: "Start teaching me Python with a flashcard",
    default_assistant_message: "Hello, let me help you learn Python.",
    user_prompt_format: "",
    user_prompts: ["Start teaching me Python with a flashcard"],
    temperature: 0.0,
  },
  custom_defaults: {
    system_prompt: "You are a Python expert assisting a new user.",
    default_prompt: "Create a scatter plot",
    default_assistant_message: "Hello, what would you like to try in Python?",
    user_prompt_format: "",
    user_prompts: [
      "Create a bar graph with custom colors",
      "Plot a histogram with specified bins",
    ],
    temperature: 0.5,
  },
};