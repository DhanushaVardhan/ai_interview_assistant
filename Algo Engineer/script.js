const algorithmEngineerQuestions = {
    "fresher": [
      { id: 1, question: "What is an algorithm, and why is it important?" },
      { id: 2, question: "Explain the difference between time complexity and space complexity." },
      { id: 3, question: "What are the basic steps in designing an algorithm?" },
      { id: 4, question: "What is the significance of Big O notation?" },
      { id: 5, question: "Explain the difference between an array and a linked list." },
      { id: 6, question: "What is recursion, and how does it work?" },
      { id: 7, question: "What are the different sorting algorithms, and how do they compare?" },
      { id: 8, question: "Explain the difference between a stack and a queue." },
      { id: 9, question: "What is a greedy algorithm? Provide an example." },
      { id: 10, question: "What is dynamic programming? How does it differ from recursion?" },
      { id: 11, question: "How does a binary search algorithm work?" },
      { id: 12, question: "What is a hash table, and how does it work?" },
      { id: 13, question: "What is a graph, and what are its types?" },
      { id: 14, question: "What is depth-first search (DFS) and breadth-first search (BFS)?" },
      { id: 15, question: "What are common applications of algorithms in real life?" }
    ],
    "medium": [
      { id: 1, question: "How do you analyze the efficiency of an algorithm?" },
      { id: 2, question: "What are the key differences between merge sort and quicksort?" },
      { id: 3, question: "What is a graph traversal algorithm, and why is it important?" },
      { id: 4, question: "What is memoization, and how is it used in algorithm optimization?" },
      { id: 5, question: "Explain the concept of dynamic programming with an example." },
      { id: 6, question: "What are some real-world applications of Dijkstra’s algorithm?" },
      { id: 7, question: "How do you optimize a recursive algorithm to avoid stack overflow?" },
      { id: 8, question: "What is backtracking, and how does it work?" },
      { id: 9, question: "Explain the concept of a minimum spanning tree and its applications." },
      { id: 10, question: "What is the difference between NP-hard and NP-complete problems?" },
      { id: 11, question: "What are heuristics, and how are they used in algorithm design?" },
      { id: 12, question: "What is a priority queue, and how is it implemented?" },
      { id: 13, question: "Explain how hashing can improve search performance." },
      { id: 14, question: "How does Floyd-Warshall's algorithm work for shortest path problems?" },
      { id: 15, question: "What is a balanced tree, and why is it important?" }
    ],
    "experienced": [
      { id: 1, question: "How do you handle large-scale algorithmic computations?" },
      { id: 2, question: "What are some advanced optimization techniques for algorithms?" },
      { id: 3, question: "How would you design an efficient algorithm for large datasets?" },
      { id: 4, question: "Explain the working of the A* search algorithm." },
      { id: 5, question: "What is the Bellman-Ford algorithm, and when should it be used?" },
      { id: 6, question: "How do you parallelize an algorithm for improved performance?" },
      { id: 7, question: "What are Monte Carlo algorithms, and how are they used?" },
      { id: 8, question: "Explain the difference between deterministic and non-deterministic algorithms." },
      { id: 9, question: "What is a genetic algorithm, and how does it work?" },
      { id: 10, question: "How do you design an algorithm for real-time systems?" },
      { id: 11, question: "What is the traveling salesman problem, and how is it solved?" },
      { id: 12, question: "How does an approximate algorithm work for NP-hard problems?" },
      { id: 13, question: "What techniques can be used to handle algorithmic trade-offs?" },
      { id: 14, question: "Explain the role of dynamic graphs in algorithm design." },
      { id: 15, question: "What is the significance of caching in algorithm performance?" }
    ],
    "professional": [
      { id: 1, question: "How do you design algorithms for distributed systems?" },
      { id: 2, question: "What are some algorithmic challenges in AI and machine learning?" },
      { id: 3, question: "How do you optimize algorithms for embedded systems?" },
      { id: 4, question: "What are parallel computing techniques in algorithm design?" },
      { id: 5, question: "Explain how quantum computing can impact algorithm design." },
      { id: 6, question: "How do you ensure algorithm efficiency in real-world applications?" },
      { id: 7, question: "What is the importance of randomized algorithms?" },
      { id: 8, question: "How do you manage algorithm scalability in cloud computing?" },
      { id: 9, question: "What are some advanced techniques for combinatorial optimization?" },
      { id: 10, question: "How do you handle high-dimensional data in algorithms?" },
      { id: 11, question: "Explain the impact of hardware constraints on algorithm performance." },
      { id: 12, question: "What are self-learning algorithms, and how do they function?" },
      { id: 13, question: "How do you approach algorithm debugging and validation?" },
      { id: 14, question: "Explain the role of adversarial algorithms in cybersecurity." },
      { id: 15, question: "How do you design algorithms for blockchain technology?" }
    ]
  };


let score = 0;
let currentQuestionIndex = 0;
let questionsToDisplay = [];
let currentLevel = null;
let userAnswers = [];
let questionAnswered = false;
let isListening = false;

const levelButtons = document.querySelectorAll('.level-buttons button');
const questionArea = document.getElementById('question-area');
const nextButton = document.getElementById('next-button');
const scoreArea = document.getElementById('score-area');
const finalScoreSpan = document.getElementById('final-score');
const recordButton = document.getElementById('record-button');
const userAnswerDiv = document.getElementById('user-answer');
const feedbackArea = document.getElementById('feedback-area');
const feedbackList = document.getElementById('feedback-list');
const recordContainer = document.getElementById('record-container');

let recognition;

levelButtons.forEach(button => {
  button.addEventListener('click', () => {
      currentLevel = button.id;
      currentQuestionIndex = 0;
      questionsToDisplay = getRandomQuestions(algorithmEngineerQuestions[currentLevel], 10);

      levelButtons.forEach(b => {
          b.style.display = 'none'; // Hide all level buttons
      });

      // Display selected level as h2
      const levelDisplay = document.createElement('h2');
      levelDisplay.textContent = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1); // Capitalize first letter
      document.querySelector('.level-buttons').appendChild(levelDisplay); // Add it where buttons were

      questionArea.style.display = 'block';
      recordContainer.style.display = 'block';
      recordButton.style.display = 'block';
      userAnswerDiv.style.display = 'block';
      nextButton.style.display = 'block';
      scoreArea.style.display = 'none';
      feedbackArea.style.display = 'none';
      displayQuestion();

      initializeSpeechRecognition();
      recordButton.disabled = false;
  });
});

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        console.log("Microphone permission granted.");

        // 2. THEN, Initialize Speech Recognition
        initializeSpeechRecognition();

        // 3. ONLY AFTER BOTH ARE DONE, Enable the Record Button (Initially - for the first question)
        recordButton.disabled = false;  // Enable it here initially

        levelButtons.forEach(button => {
            button.addEventListener('click', () => {
                // ... (rest of level button click handler logic - remains the same)
                displayQuestion();
            });
        });

    })
    .catch(err => {
        console.error("Error accessing microphone:", err);
        alert("Microphone access is required. Please grant permission.");
        recordButton.disabled = true; // Disable the button if permission is denied
    });

recordButton.addEventListener('click', () => {
    if (!isListening) {
        if (recognition) {
            recognition.start();
            recordButton.textContent = "Listening...";
            recordButton.disabled = true;
            recordButton.classList.add('recording');
            isListening = true;
        } else {
            console.error("Speech recognition not initialized. Check browser compatibility.");
        }
    } else {
        if (recognition) {
            recognition.stop();
            recordButton.textContent = "Record";
            recordButton.classList.remove('recording');
            isListening = false;
        }
    }
});

nextButton.addEventListener('click', () => {
    if (!questionAnswered && userAnswerDiv.textContent === "") {
        alert("Please attempt the current question before proceeding.");
        return;
    }

    if (recognition) {
        recognition.stop();
        recordButton.disabled = true;
        recordButton.textContent = "Record";
    }

    const userAnswer = userAnswerDiv.textContent.replace("Listening...", "");
    userAnswers.push(userAnswer);

    const question = questionsToDisplay[currentQuestionIndex];
    const keywords = getKeywordsForQuestion(question);
    const matchCount = countKeywordMatches(userAnswer, keywords);

    // Calculate score based on keyword matches (at least one match needed)
    let questionScore = 0;
    if (matchCount > 0) {
      questionScore = calculateScore(matchCount, keywords.length);
    }

    const remainingScore = 100 - score;
    questionScore = Math.min(questionScore, remainingScore);

    score += questionScore;

    const feedback = generateFeedback(userAnswer, keywords);
    feedbackList.innerHTML += `<li>${feedback}</li>`;

    currentQuestionIndex++;
    userAnswerDiv.textContent = "";
    recordButton.disabled = false; // Enable for the next question
    questionAnswered = false;
    isListening = false;

    if (currentQuestionIndex < questionsToDisplay.length) {
        displayQuestion();
    } else {
        endInterviewSession();
    }
});

function initializeSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.error("Speech recognition not supported in this browser.");
        recordButton.disabled = true;
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userAnswerDiv.textContent = transcript;
    };

    recognition.onend = () => {
        recordButton.textContent = "Record";
        recordButton.classList.remove('recording');
        isListening = false;

        if (userAnswerDiv.textContent.trim() !== "") {
            nextButton.disabled = false;
            questionAnswered = true;
        }

        recordButton.disabled = true; // Disable the record button after one attempt
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        userAnswerDiv.textContent = "Error occurred. Please try again.";
        recordButton.disabled = false;
        recordButton.textContent = "Record";
    };
}

function getRandomQuestions(questions, numQuestions) {
    if (!questions) return [];

    const shuffled = questions.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, numQuestions);
}

function displayQuestion() {
    if (currentQuestionIndex < questionsToDisplay.length && questionsToDisplay[currentQuestionIndex]) {
        questionArea.innerHTML = `<p>${questionsToDisplay[currentQuestionIndex].question}</p>`;
        recordContainer.style.display = 'flex';
        recordButton.style.display = 'block';
        document.getElementById('listening-text').style.display = 'none';
        recordButton.dataset.recording = "false";
        recordButton.disabled = false; // Enable the button for the new question
        nextButton.disabled = true; // Disable the next button initially for the new question
        questionAnswered = false; // Reset the questionAnswered flag
        isListening = false;
    } else {
        console.error("Question is undefined or index is out of bounds.");
    }
}

function getKeywordsForQuestion(question) {
    if (!question || !question.question) return [];

    const questionText = question.question.toLowerCase();

    if (questionText.includes("algorithm")) {
        return ["algorithm", "efficiency", "complexity"];
    } else if (questionText.includes("data structure")) {
        return ["data structure", "array", "linked list", "tree"];
    } else {
        return [];
    }
}

function countKeywordMatches(answer, keywords) {
    let count = 0;
    if (answer && keywords) {
        const lowerAnswer = answer.toLowerCase();
        for (const keyword of keywords) {
            if (lowerAnswer.includes(keyword.toLowerCase())) {
                count++;
            }
        }
    }
    return count;
}

function calculateScore(matchCount, totalKeywords) {
    if (totalKeywords === 0) return 0;
    return (matchCount / totalKeywords) * 100;
}

function generateFeedback(answer, keywords) {
    if (!answer || !keywords) return "No answer or keywords provided.";

    const matchedKeywords = keywords.filter(keyword => answer.toLowerCase().includes(keyword.toLowerCase()));

    if (matchedKeywords.length === 0) {
        return "Try to include some of the key concepts in your answer.";
    } else {
        return `Good job! You mentioned: ${matchedKeywords.join(", ")}.`;
    }
}

function endInterviewSession() {
    finalScoreSpan.textContent = score.toFixed(2);
    scoreArea.style.display = 'block';
    feedbackArea.style.display = 'block';

    const homeButton = document.createElement('button');
    homeButton.textContent = 'Go Home';
    homeButton.id = 'go-home-button';
    homeButton.addEventListener('click', () => {
        const basePath = "../index.html";
        window.location.href = basePath;
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'center';
    buttonContainer.appendChild(homeButton);

    feedbackArea.parentNode.insertBefore(buttonContainer, feedbackArea.nextSibling);

    questionArea.style.display = 'none';
    nextButton.style.display = 'none';
    recordContainer.style.display = 'none';
    recordButton.style.display = 'none';
    userAnswerDiv.style.display = 'none';
    document.querySelector('.home-button').style.display = 'none';
    document.querySelector('h1').style.display = 'none';
}