const algorithmSpecialistQuestions = {
    "fresher": [
      { id: 1, question: "What is an algorithm, and why is it essential?" },
      { id: 2, question: "Explain the difference between brute force and optimized algorithms." },
      { id: 3, question: "What are the fundamental characteristics of a good algorithm?" },
      { id: 4, question: "Define Big O notation and provide examples." },
      { id: 5, question: "Explain the different types of sorting algorithms." },
      { id: 6, question: "What is recursion, and when should it be used?" },
      { id: 7, question: "How does binary search work?" },
      { id: 8, question: "What is a hash table, and how does it function?" },
      { id: 9, question: "Differentiate between stack and queue." },
      { id: 10, question: "What are greedy algorithms? Give an example." },
      { id: 11, question: "Explain dynamic programming with an example." },
      { id: 12, question: "What is a graph, and how is it represented?" },
      { id: 13, question: "Describe depth-first search (DFS) and breadth-first search (BFS)." },
      { id: 14, question: "What is a priority queue, and where is it used?" },
      { id: 15, question: "How do linked lists differ from arrays?" }
    ],
    "medium": [
      { id: 1, question: "How do you analyze the efficiency of an algorithm?" },
      { id: 2, question: "Compare merge sort and quicksort." },
      { id: 3, question: "What are heuristics, and how do they improve algorithm performance?" },
      { id: 4, question: "Explain memoization and its advantages." },
      { id: 5, question: "What are some real-world applications of Dijkstra’s algorithm?" },
      { id: 6, question: "How does backtracking help in algorithm design?" },
      { id: 7, question: "Explain the concept of NP-complete problems." },
      { id: 8, question: "What is a minimum spanning tree?" },
      { id: 9, question: "How do you optimize recursive algorithms?" },
      { id: 10, question: "Describe Floyd-Warshall’s algorithm and its applications." },
      { id: 11, question: "How do you implement topological sorting?" },
      { id: 12, question: "Explain the Bellman-Ford algorithm." },
      { id: 13, question: "What are Monte Carlo algorithms?" },
      { id: 14, question: "Discuss the importance of caching in algorithm optimization." },
      { id: 15, question: "Explain the role of approximation algorithms in NP-hard problems." }
    ],
    "experienced": [
      { id: 1, question: "How do you handle large-scale algorithmic computations?" },
      { id: 2, question: "What techniques can be used for combinatorial optimization?" },
      { id: 3, question: "Explain genetic algorithms and their applications." },
      { id: 4, question: "How does parallel computing improve algorithm performance?" },
      { id: 5, question: "What are self-balancing trees, and why are they important?" },
      { id: 6, question: "Explain the working of A* search algorithm." },
      { id: 7, question: "What is a traveling salesman problem, and how can it be solved?" },
      { id: 8, question: "Discuss dynamic graphs and their applications." },
      { id: 9, question: "How do you design fault-tolerant algorithms?" },
      { id: 10, question: "Explain the impact of hardware constraints on algorithm performance." },
      { id: 11, question: "How do you optimize algorithms for embedded systems?" },
      { id: 12, question: "What is an adversarial algorithm, and where is it used?" },
      { id: 13, question: "Explain the importance of approximation algorithms in AI." },
      { id: 14, question: "How do you manage algorithm scalability in cloud computing?" },
      { id: 15, question: "Discuss the role of machine learning in modern algorithms." }
    ],
    "professional": [
      { id: 1, question: "How do you design algorithms for distributed systems?" },
      { id: 2, question: "What are algorithmic challenges in AI and deep learning?" },
      { id: 3, question: "How do you approach algorithm debugging and validation?" },
      { id: 4, question: "Discuss quantum computing's impact on algorithm design." },
      { id: 5, question: "What are parallel computing techniques for large-scale algorithms?" },
      { id: 6, question: "How do you ensure efficiency in high-performance computing?" },
      { id: 7, question: "What are self-learning algorithms, and how do they function?" },
      { id: 8, question: "Explain algorithm design for blockchain technology." },
      { id: 9, question: "How do you optimize algorithms for cybersecurity applications?" },
      { id: 10, question: "What are advanced techniques for handling high-dimensional data?" },
      { id: 11, question: "How do you balance accuracy and efficiency in large-scale algorithms?" },
      { id: 12, question: "Explain adversarial attacks in machine learning algorithms." },
      { id: 13, question: "How do you design algorithms for streaming data processing?" },
      { id: 14, question: "Discuss reinforcement learning and its role in algorithm design." },
      { id: 15, question: "What are the challenges in designing real-time decision-making algorithms?" }
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
      questionsToDisplay = getRandomQuestions(algorithmSpecialistQuestions[currentLevel], 10);

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
    
    if (questionText.includes("algorithm design")) {
        return ["algorithm design", "algorithm analysis", "complexity", "Big-O", "optimization", "data structures"];
    } else if (questionText.includes("greedy algorithm")) {
        return ["greedy algorithm", "optimization", "local optimum", "global optimum"];
    } else if (questionText.includes("divide and conquer")) {
        return ["divide and conquer", "recursive algorithms", "mergesort", "quicksort", "binary search"];
    } else if (questionText.includes("dynamic programming")) {
        return ["dynamic programming", "DP", "memoization", "tabulation", "subproblem", "overlapping subproblems"];
    } else if (questionText.includes("graph theory")) {
        return ["graph theory", "graph algorithms", "DFS", "BFS", "shortest path", "Dijkstra", "A* algorithm"];
    } else if (questionText.includes("sorting algorithms")) {
        return ["sorting algorithms", "quicksort", "mergesort", "bubblesort", "heapsort", "insertion sort"];
    } else if (questionText.includes("searching algorithms")) {
        return ["searching algorithms", "binary search", "linear search", "depth-first search", "breadth-first search"];
    } else if (questionText.includes("data structures")) {
        return ["data structures", "arrays", "linked lists", "trees", "hash tables", "graphs", "queues", "stacks"];
    } else if (questionText.includes("optimization")) {
        return ["optimization", "global optimization", "local optimization", "constraint optimization", "linear programming"];
    } else if (questionText.includes("computational complexity")) {
        return ["computational complexity", "P vs NP", "NP-complete", "NP-hard", "time complexity", "space complexity"];
    } else if (questionText.includes("probabilistic algorithms")) {
        return ["probabilistic algorithms", "Monte Carlo methods", "Markov chains", "randomized algorithms"];
    } else if (questionText.includes("machine learning algorithms")) {
        return ["machine learning algorithms", "classification", "regression", "SVM", "decision trees", "k-means clustering"];
    } else if (questionText.includes("hashing")) {
        return ["hashing", "hash functions", "hash tables", "collision resolution", "cryptographic hash"];
    } else if (questionText.includes("network flow algorithms")) {
        return ["network flow algorithms", "Ford-Fulkerson", "maximum flow", "minimum cut", "graph algorithms"];
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