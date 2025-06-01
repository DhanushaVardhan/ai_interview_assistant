const dataScientistQuestions = {
    "fresher": [
      { id: 1, question: "What is data science, and how does it differ from data analytics?" },
      { id: 2, question: "What are the key steps in a data science project?" },
      { id: 3, question: "Explain the difference between classification and regression." },
      { id: 4, question: "What are the different types of probability distributions?" },
      { id: 5, question: "What is the Central Limit Theorem, and why is it important?" },
      { id: 6, question: "What is the bias-variance tradeoff in machine learning?" },
      { id: 7, question: "How do you handle missing data in a dataset?" },
      { id: 8, question: "What is a p-value, and how is it used in hypothesis testing?" },
      { id: 9, question: "Explain the difference between mean, median, and mode." },
      { id: 10, question: "What are some common libraries used in Python for data science?" }
    ],
    "medium": [
      { id: 1, question: "What is feature selection, and why is it important?" },
      { id: 2, question: "Explain the concept of dimensionality reduction." },
      { id: 3, question: "What is Principal Component Analysis (PCA), and how does it work?" },
      { id: 4, question: "How do you handle outliers in a dataset?" },
      { id: 5, question: "What are the assumptions of linear regression?" },
      { id: 6, question: "What is the difference between batch and online learning?" },
      { id: 7, question: "Explain the concept of time series forecasting." },
      { id: 8, question: "How do you evaluate the performance of a clustering algorithm?" },
      { id: 9, question: "What is survival analysis, and where is it used?" },
      { id: 10, question: "How do you perform A/B testing, and what metrics do you consider?" }
    ],
    "experienced": [
      { id: 1, question: "How do you handle imbalanced datasets in classification problems?" },
      { id: 2, question: "Explain the concept of ensemble learning." },
      { id: 3, question: "What are recommendation systems, and how do they work?" },
      { id: 4, question: "How do you ensure reproducibility in data science experiments?" },
      { id: 5, question: "What is deep learning, and how does it relate to data science?" },
      { id: 6, question: "Explain how you would build a fraud detection system." },
      { id: 7, question: "How do you measure the effectiveness of a predictive model?" },
      { id: 8, question: "What are the challenges of working with unstructured data?" },
      { id: 9, question: "Explain the concept of reinforcement learning in data science." },
      { id: 10, question: "How do you design an efficient data pipeline for a data science project?" }
    ],
    "professional": [
      { id: 1, question: "What are the ethical considerations in data science?" },
      { id: 2, question: "How do you optimize big data processing in a distributed environment?" },
      { id: 3, question: "What are some best practices for deploying machine learning models?" },
      { id: 4, question: "How do you handle adversarial attacks in machine learning models?" },
      { id: 5, question: "What are some key differences between on-premise and cloud-based data science platforms?" },
      { id: 6, question: "How do you implement real-time analytics for large-scale applications?" },
      { id: 7, question: "What techniques do you use for feature extraction in text analysis?" },
      { id: 8, question: "How do you ensure data privacy in machine learning models?" },
      { id: 9, question: "What strategies do you use to handle data drift in production models?" },
      { id: 10, question: "How do you scale a data science workflow for enterprise applications?" }
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
      questionsToDisplay = getRandomQuestions(dataScientistQuestions[currentLevel], 10);

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
    
    if (questionText.includes("data exploration") || questionText.includes("data analysis")) {
        return ["data exploration", "data analysis", "EDA", "data visualization", "hypothesis testing"];
    } else if (questionText.includes("statistics")) {
        return ["statistics", "probability", "distributions", "mean", "variance", "statistical inference"];
    } else if (questionText.includes("machine learning")) {
        return ["machine learning", "supervised learning", "unsupervised learning", "classification", "regression"];
    } else if (questionText.includes("model evaluation")) {
        return ["model evaluation", "cross-validation", "accuracy", "precision", "recall", "AUC", "ROC curve"];
    } else if (questionText.includes("data preprocessing")) {
        return ["data preprocessing", "data cleaning", "imputation", "outlier detection", "feature scaling"];
    } else if (questionText.includes("data visualization")) {
        return ["data visualization", "matplotlib", "seaborn", "ggplot", "Tableau", "Power BI"];
    } else if (questionText.includes("python")) {
        return ["Python", "pandas", "NumPy", "scikit-learn", "matplotlib", "seaborn", "Jupyter"];
    } else if (questionText.includes("sql")) {
        return ["SQL", "Structured Query Language", "queries", "joins", "subqueries", "data extraction"];
    } else if (questionText.includes("deep learning")) {
        return ["deep learning", "neural networks", "CNN", "RNN", "LSTM", "TensorFlow", "Keras"];
    } else if (questionText.includes("feature engineering")) {
        return ["feature engineering", "feature selection", "feature extraction", "dimensionality reduction"];
    } else if (questionText.includes("big data")) {
        return ["big data", "Hadoop", "Spark", "data lakes", "distributed computing"];
    } else if (questionText.includes("natural language processing")) {
        return ["NLP", "text mining", "word embeddings", "sentiment analysis", "tokenization"];
    } else if (questionText.includes("time series")) {
        return ["time series", "forecasting", "ARIMA", "seasonality", "trend", "LSTM"];
    } else if (questionText.includes("recommender system")) {
        return ["recommender systems", "collaborative filtering", "content-based filtering", "matrix factorization"];
    } else if (questionText.includes("data wrangling")) {
        return ["data wrangling", "data cleaning", "data transformation", "data reshaping"];
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