const algorithmDesignerQuestions = {
    "fresher": [
      { id: 1, question: "What is an algorithm, and why is it important in computer science?" },
      { id: 2, question: "Explain the difference between a greedy algorithm and a dynamic programming algorithm." },
      { id: 3, question: "What is the time complexity of a linear search algorithm?" },
      { id: 4, question: "What is the purpose of recursion in algorithm design?" },
      { id: 5, question: "Can you explain what Big O notation is and why it's important in analyzing algorithms?" },
      { id: 6, question: "What is the difference between a stack and a queue? How are they used in algorithms?" },
      { id: 7, question: "What is the concept of divide and conquer in algorithm design?" },
      { id: 8, question: "Can you explain the working of the bubble sort algorithm?" },
      { id: 9, question: "What is the difference between depth-first search (DFS) and breadth-first search (BFS)?" },
      { id: 10, question: "What are the advantages of using hashing in an algorithm?" },
      { id: 11, question: "What is a heap, and how is it different from a binary tree?" },
      { id: 12, question: "How does a binary search algorithm work, and what is its time complexity?" },
      { id: 13, question: "What is memoization, and how is it used in dynamic programming?" },
      { id: 14, question: "Can you explain the term 'algorithmic complexity' with an example?" },
      { id: 15, question: "What is the importance of data structures in algorithm design?" }
    ],
    "medium": [
      { id: 1, question: "How do you decide which algorithm to use for a given problem?" },
      { id: 2, question: "What is the difference between time complexity and space complexity?" },
      { id: 3, question: "Explain the difference between a greedy algorithm and dynamic programming with an example." },
      { id: 4, question: "How do you approach solving a problem using divide and conquer algorithms?" },
      { id: 5, question: "What is the knapsack problem, and how can dynamic programming be applied to solve it?" },
      { id: 6, question: "Can you explain the Dijkstra algorithm for finding the shortest path?" },
      { id: 7, question: "How do you analyze the efficiency of recursive algorithms?" },
      { id: 8, question: "What is the difference between a linked list and an array in terms of algorithmic performance?" },
      { id: 9, question: "What is a topological sort, and where is it used?" },
      { id: 10, question: "How would you implement a quicksort algorithm?" },
      { id: 11, question: "Explain how a depth-first search can be implemented using a stack." },
      { id: 12, question: "What are greedy algorithms, and can you provide an example where it is not optimal?" },
      { id: 13, question: "How does a hash table improve the performance of algorithms?" },
      { id: 14, question: "What is a tree traversal algorithm? Can you describe pre-order and post-order traversal?" },
      { id: 15, question: "What is the time complexity of a merge sort algorithm, and how does it compare to quicksort?" }
    ],
    "experienced": [
      { id: 1, question: "How would you optimize an algorithm to handle large datasets efficiently?" },
      { id: 2, question: "Can you explain the concept of 'memoization' in depth and when it should be used?" },
      { id: 3, question: "What strategies would you use to handle a graph with millions of nodes and edges?" },
      { id: 4, question: "How would you solve the traveling salesman problem using dynamic programming?" },
      { id: 5, question: "What is the Bellman-Ford algorithm, and how does it compare to Dijkstra's algorithm?" },
      { id: 6, question: "How would you implement an algorithm to detect a cycle in a directed graph?" },
      { id: 7, question: "What is a priority queue, and how does it enhance algorithm performance?" },
      { id: 8, question: "Explain how you would improve the performance of a sorting algorithm when working with large data." },
      { id: 9, question: "How do you design a load-balancing algorithm for a distributed system?" },
      { id: 10, question: "What are the challenges in designing algorithms for real-time systems?" },
      { id: 11, question: "Can you explain the concept of NP-completeness and provide an example of an NP-hard problem?" },
      { id: 12, question: "How would you implement an efficient algorithm for finding the longest increasing subsequence?" },
      { id: 13, question: "What is the A* search algorithm, and how is it used in pathfinding problems?" },
      { id: 14, question: "Explain how parallel computing can be used to optimize the performance of an algorithm." },
      { id: 15, question: "How would you design an algorithm to handle high-frequency updates in a real-time database?" }
    ],
    "professional": [
      { id: 1, question: "How do you approach designing algorithms for systems that need to scale horizontally?" },
      { id: 2, question: "What is the importance of algorithmic trade-offs in large-scale systems, and how do you prioritize them?" },
      { id: 3, question: "How would you handle designing an algorithm to operate efficiently on distributed systems with high latency?" },
      { id: 4, question: "Can you explain how algorithmic design patterns like divide and conquer or dynamic programming help solve complex problems?" },
      { id: 5, question: "How do you ensure that an algorithm performs well in both time and space when working with large data?" },
      { id: 6, question: "Explain your approach to designing algorithms that need to work within strict real-time constraints." },
      { id: 7, question: "How would you go about designing an algorithm to minimize data transmission time in a distributed system?" },
      { id: 8, question: "What strategies do you use to test the correctness and performance of an algorithm under extreme conditions?" },
      { id: 9, question: "How would you design a fault-tolerant algorithm for a mission-critical application?" },
      { id: 10, question: "Explain the importance of designing algorithms with both high performance and low energy consumption for embedded systems." },
      { id: 11, question: "What methods would you use to handle computationally expensive problems in machine learning and AI?" },
      { id: 12, question: "How do you optimize algorithms when working in environments with limited hardware resources?" },
      { id: 13, question: "How would you design a hybrid algorithm that combines different algorithmic paradigms to solve a problem?" },
      { id: 14, question: "What are the challenges in designing algorithms for high-frequency financial systems?" },
      { id: 15, question: "Can you discuss your experience with complex algorithm design in AI or robotics, focusing on optimization?" }
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
      questionsToDisplay = getRandomQuestions(algorithmDesignerQuestions[currentLevel], 10);

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