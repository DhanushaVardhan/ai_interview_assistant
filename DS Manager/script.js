const dataScienceManagerQuestions = {
    "fresher": [
      { id: 1, question: "What is data science, and how does it differ from data analytics?" },
      { id: 2, question: "Can you explain the basic steps of a data science project?" },
      { id: 3, question: "What are some common tools and programming languages used in data science?" },
      { id: 4, question: "What is the difference between supervised and unsupervised learning?" },
      { id: 5, question: "What are some key concepts in statistics that are important for data science?" },
      { id: 6, question: "How would you handle missing data in a dataset?" },
      { id: 7, question: "What is feature engineering, and why is it important?" },
      { id: 8, question: "Can you explain the concept of overfitting in machine learning?" },
      { id: 9, question: "What is cross-validation, and how is it used?" },
      { id: 10, question: "What are some common evaluation metrics for classification models?" }
    ],
    "medium": [
      { id: 1, question: "How do you select the right machine learning model for a given problem?" },
      { id: 2, question: "What are the advantages and disadvantages of decision trees?" },
      { id: 3, question: "How do you handle imbalanced datasets in machine learning?" },
      { id: 4, question: "What is A/B testing, and how is it applied in data science?" },
      { id: 5, question: "How do you assess the performance of a regression model?" },
      { id: 6, question: "Can you explain the differences between precision and recall?" },
      { id: 7, question: "What are some key challenges in deploying machine learning models to production?" },
      { id: 8, question: "What is the role of big data technologies in data science?" },
      { id: 9, question: "How do you choose between a relational and a NoSQL database for a project?" },
      { id: 10, question: "What is the importance of data visualization in data science?" }
    ],
    "experienced": [
      { id: 1, question: "How do you lead a data science team to align with business objectives?" },
      { id: 2, question: "What are the best practices for maintaining reproducibility in data science?" },
      { id: 3, question: "How do you handle bias in machine learning models?" },
      { id: 4, question: "Can you discuss the ethical implications of AI and machine learning?" },
      { id: 5, question: "How do you ensure data quality and consistency across multiple sources?" },
      { id: 6, question: "What strategies do you use for feature selection and dimensionality reduction?" },
      { id: 7, question: "How do you scale machine learning models for large datasets?" },
      { id: 8, question: "What are some key factors to consider when designing an ETL pipeline?" },
      { id: 9, question: "How do you integrate domain knowledge into data science solutions?" },
      { id: 10, question: "What are the key challenges in building an end-to-end data science workflow?" }
    ],
    "professional": [
      { id: 1, question: "What strategies do you use to create a data-driven culture in an organization?" },
      { id: 2, question: "How do you prioritize and manage multiple data science projects?" },
      { id: 3, question: "What are the key components of an enterprise-level data strategy?" },
      { id: 4, question: "How do you ensure compliance with data privacy laws like GDPR?" },
      { id: 5, question: "What are some key KPIs for measuring the success of a data science team?" },
      { id: 6, question: "How do you foster collaboration between data scientists and other business units?" },
      { id: 7, question: "What are the trade-offs between interpretability and performance in AI models?" },
      { id: 8, question: "How do you evaluate and implement new data science technologies?" },
      { id: 9, question: "What strategies do you use for hiring and retaining top data science talent?" },
      { id: 10, question: "How do you balance innovation with maintaining stable data science operations?" }
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
      questionsToDisplay = getRandomQuestions(dataScienceManagerQuestions[currentLevel], 10);

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
    
    if (questionText.includes("team management")) {
        return ["team management", "leadership", "resource allocation", "mentorship", "performance reviews", "cross-functional teams"];
    } else if (questionText.includes("data science strategy")) {
        return ["data science strategy", "business alignment", "project prioritization", "ROI", "data-driven decisions"];
    } else if (questionText.includes("machine learning")) {
        return ["machine learning", "supervised learning", "unsupervised learning", "model deployment", "deep learning", "ML frameworks"];
    } else if (questionText.includes("business intelligence")) {
        return ["business intelligence", "data analytics", "KPI", "dashboarding", "data visualization"];
    } else if (questionText.includes("stakeholder management")) {
        return ["stakeholder management", "client communication", "business requirements", "executive presentation", "client-facing"];
    } else if (questionText.includes("data pipelines")) {
        return ["data pipelines", "ETL", "data integration", "data quality", "data processing", "automation"];
    } else if (questionText.includes("data governance")) {
        return ["data governance", "data policies", "compliance", "data quality standards", "data privacy", "GDPR"];
    } else if (questionText.includes("advanced analytics")) {
        return ["advanced analytics", "predictive modeling", "statistical modeling", "forecasting", "time series analysis"];
    } else if (questionText.includes("model evaluation")) {
        return ["model evaluation", "cross-validation", "AUC", "precision", "recall", "accuracy", "model performance"];
    } else if (questionText.includes("collaboration")) {
        return ["collaboration", "teamwork", "cross-functional collaboration", "engineering collaboration", "product collaboration"];
    } else if (questionText.includes("data visualization")) {
        return ["data visualization", "Tableau", "Power BI", "matplotlib", "seaborn", "data storytelling"];
    } else if (questionText.includes("big data")) {
        return ["big data", "Hadoop", "Spark", "data lakes", "distributed computing", "data storage"];
    } else if (questionText.includes("cloud platforms")) {
        return ["cloud platforms", "AWS", "Azure", "Google Cloud", "cloud storage", "data warehousing"];
    } else if (questionText.includes("project management")) {
        return ["project management", "Agile", "Scrum", "Kanban", "project tracking", "timeline management"];
    } else if (questionText.includes("model deployment")) {
        return ["model deployment", "CI/CD pipelines", "MLOps", "production models", "API integration", "model versioning"];
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