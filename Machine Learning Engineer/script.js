const machineLearningEngineerQuestions = {
    "fresher": [
      { id: 1, question: "What is machine learning, and how does it differ from traditional programming?" },
      { id: 2, question: "What are the different types of machine learning?" },
      { id: 3, question: "Explain the concept of overfitting in machine learning." },
      { id: 4, question: "What is the difference between supervised and unsupervised learning?" },
      { id: 5, question: "What are some common applications of machine learning?" },
      { id: 6, question: "What is a confusion matrix, and why is it important?" },
      { id: 7, question: "Explain the difference between precision and recall." },
      { id: 8, question: "What is cross-validation, and why is it used?" },
      { id: 9, question: "What are hyperparameters in machine learning models?" },
      { id: 10, question: "What is feature engineering, and why is it important?" }
    ],
    "medium": [
      { id: 1, question: "What is a support vector machine (SVM), and how does it work?" },
      { id: 2, question: "Explain the concept of gradient descent in machine learning." },
      { id: 3, question: "What are different activation functions used in neural networks?" },
      { id: 4, question: "What is regularization, and why is it necessary in machine learning?" },
      { id: 5, question: "How does a decision tree algorithm work?" },
      { id: 6, question: "What is the difference between bagging and boosting?" },
      { id: 7, question: "How do you evaluate the performance of a regression model?" },
      { id: 8, question: "What is an autoencoder, and where is it used?" },
      { id: 9, question: "Explain the working of k-means clustering." },
      { id: 10, question: "How do you deal with imbalanced datasets in classification problems?" }
    ],
    "experienced": [
      { id: 1, question: "What are generative adversarial networks (GANs), and how do they work?" },
      { id: 2, question: "Explain the role of the learning rate in training deep learning models." },
      { id: 3, question: "How does transfer learning work in deep learning?" },
      { id: 4, question: "What are long short-term memory (LSTM) networks used for?" },
      { id: 5, question: "How do you handle missing or incomplete data in machine learning?" },
      { id: 6, question: "What are the benefits and challenges of using reinforcement learning?" },
      { id: 7, question: "Explain the concept of attention mechanisms in deep learning." },
      { id: 8, question: "What are embeddings, and how are they used in NLP?" },
      { id: 9, question: "How do you optimize hyperparameters in machine learning models?" },
      { id: 10, question: "What is an ensemble learning approach, and when should it be used?" }
    ],
    "professional": [
      { id: 1, question: "How do you design and deploy a scalable machine learning system?" },
      { id: 2, question: "What are the ethical considerations in machine learning applications?" },
      { id: 3, question: "How do you handle model drift in production machine learning models?" },
      { id: 4, question: "What is federated learning, and how does it work?" },
      { id: 5, question: "Explain the challenges of deploying deep learning models in real-time applications." },
      { id: 6, question: "How do you ensure the reproducibility of machine learning experiments?" },
      { id: 7, question: "What are the trade-offs between explainability and model performance?" },
      { id: 8, question: "How do you select the right evaluation metric for a given problem?" },
      { id: 9, question: "What are some best practices for monitoring and maintaining machine learning models?" },
      { id: 10, question: "How do you handle large-scale distributed training for deep learning models?" }
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
      questionsToDisplay = getRandomQuestions(machineLearningEngineerQuestions[currentLevel], 10);

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
    
    if (questionText.includes("supervised learning")) {
        return ["supervised learning", "classification", "regression", "labeled data"];
    } else if (questionText.includes("unsupervised learning")) {
        return ["unsupervised learning", "clustering", "dimensionality reduction", "k-means", "PCA"];
    } else if (questionText.includes("reinforcement learning")) {
        return ["reinforcement learning", "Q-learning", "policy optimization", "reward signals"];
    } else if (questionText.includes("deep learning")) {
        return ["deep learning", "neural networks", "CNN", "RNN", "LSTMs", "backpropagation"];
    } else if (questionText.includes("model evaluation")) {
        return ["model evaluation", "cross-validation", "precision", "recall", "accuracy", "F1-score"];
    } else if (questionText.includes("overfitting")) {
        return ["overfitting", "underfitting", "regularization", "bias-variance tradeoff"];
    } else if (questionText.includes("feature engineering")) {
        return ["feature engineering", "feature selection", "feature extraction", "data preprocessing"];
    } else if (questionText.includes("gradient descent")) {
        return ["gradient descent", "stochastic gradient descent", "learning rate", "optimization"];
    } else if (questionText.includes("ensemble methods")) {
        return ["ensemble methods", "random forest", "boosting", "bagging", "XGBoost", "AdaBoost"];
    } else if (questionText.includes("model deployment")) {
        return ["model deployment", "model serving", "Docker", "Kubernetes", "cloud deployment", "REST APIs"];
    } else if (questionText.includes("model tuning")) {
        return ["model tuning", "hyperparameter optimization", "grid search", "random search", "Bayesian optimization"];
    } else if (questionText.includes("tensorflow") || questionText.includes("pytorch")) {
        return ["TensorFlow", "PyTorch", "deep learning frameworks", "neural networks", "GPU acceleration"];
    } else if (questionText.includes("transfer learning")) {
        return ["transfer learning", "pre-trained models", "fine-tuning", "feature extraction"];
    } else if (questionText.includes("time series")) {
        return ["time series", "ARIMA", "forecasting", "seasonality", "trend"];
    } else if (questionText.includes("natural language processing")) {
        return ["NLP", "text mining", "word embeddings", "tokenization", "sequence modeling"];
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