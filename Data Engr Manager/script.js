const dataEngineeringManagerQuestions = {
    "fresher": [
      { id: 1, question: "What is data engineering, and why is it important?" },
      { id: 2, question: "Can you explain the basic components of a data pipeline?" },
      { id: 3, question: "What are ETL processes, and why are they used?" },
      { id: 4, question: "What is the difference between a data lake and a data warehouse?" },
      { id: 5, question: "What are some commonly used tools in data engineering?" },
      { id: 6, question: "What is the role of a data engineer in a data-driven organization?" },
      { id: 7, question: "What are primary and foreign keys in a database?" },
      { id: 8, question: "How does data normalization impact database performance?" },
      { id: 9, question: "What is indexing, and why is it important in databases?" },
      { id: 10, question: "How do you ensure data quality in a data pipeline?" }
    ],
    "medium": [
      { id: 1, question: "How do you handle large-scale data processing efficiently?" },
      { id: 2, question: "What is data partitioning, and how does it improve performance?" },
      { id: 3, question: "How do you ensure data security in a distributed system?" },
      { id: 4, question: "Explain the role of Apache Spark in data engineering." },
      { id: 5, question: "What is schema evolution, and why is it important?" },
      { id: 6, question: "How do you monitor and optimize data pipelines?" },
      { id: 7, question: "What are the benefits and challenges of cloud-based data solutions?" },
      { id: 8, question: "Explain the importance of data lineage in data engineering." },
      { id: 9, question: "What are the best practices for designing scalable data architectures?" },
      { id: 10, question: "How do you integrate data from multiple sources efficiently?" }
    ],
    "experienced": [
      { id: 1, question: "What are the key challenges in managing a data engineering team?" },
      { id: 2, question: "How do you approach performance tuning for large-scale data workflows?" },
      { id: 3, question: "Explain the significance of data governance in an enterprise setting." },
      { id: 4, question: "How do you handle real-time data streaming effectively?" },
      { id: 5, question: "What are the trade-offs between batch processing and stream processing?" },
      { id: 6, question: "How do you design a fault-tolerant and resilient data architecture?" },
      { id: 7, question: "What are the key considerations when building a data lake?" },
      { id: 8, question: "How do you ensure compliance with data regulations like GDPR?" },
      { id: 9, question: "What are some best practices for maintaining metadata management?" },
      { id: 10, question: "How do you design a cost-effective data processing infrastructure?" }
    ],
    "professional": [
      { id: 1, question: "What strategies do you use to align data engineering with business goals?" },
      { id: 2, question: "How do you evaluate and implement new data technologies?" },
      { id: 3, question: "What methodologies do you use for capacity planning in data systems?" },
      { id: 4, question: "How do you build a data-driven culture within an organization?" },
      { id: 5, question: "What are the best practices for managing data engineering roadmaps?" },
      { id: 6, question: "How do you ensure high availability and disaster recovery in data engineering?" },
      { id: 7, question: "What are the most critical KPIs for a data engineering team?" },
      { id: 8, question: "How do you balance technical debt and innovation in data engineering?" },
      { id: 9, question: "What is your approach to recruiting and retaining top data engineering talent?" },
      { id: 10, question: "How do you manage cross-functional collaboration with data scientists and analysts?" }
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
      questionsToDisplay = getRandomQuestions(dataEngineeringManagerQuestions[currentLevel], 10);

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
    
    if (questionText.includes("data pipeline")) {
        return ["data pipeline", "ETL", "data processing", "data integration", "batch processing", "real-time processing"];
    } else if (questionText.includes("team management")) {
        return ["team management", "leadership", "team building", "resource allocation", "mentorship", "performance reviews"];
    } else if (questionText.includes("big data")) {
        return ["big data", "Hadoop", "Apache Spark", "MapReduce", "data lakes", "distributed systems"];
    } else if (questionText.includes("cloud architecture")) {
        return ["cloud architecture", "AWS", "Azure", "Google Cloud", "cloud storage", "cloud data warehousing"];
    } else if (questionText.includes("data quality")) {
        return ["data quality", "data validation", "data governance", "data consistency", "data cleaning", "data profiling"];
    } else if (questionText.includes("data warehousing")) {
        return ["data warehousing", "ETL processes", "OLAP", "Redshift", "Snowflake", "BigQuery"];
    } else if (questionText.includes("data modeling")) {
        return ["data modeling", "star schema", "snowflake schema", "dimensional modeling", "schema design"];
    } else if (questionText.includes("leadership") || questionText.includes("strategy")) {
        return ["leadership", "strategic planning", "data strategy", "vision", "executive communication", "goal setting"];
    } else if (questionText.includes("performance optimization")) {
        return ["performance optimization", "database performance", "query optimization", "resource management", "scalability"];
    } else if (questionText.includes("cross-functional collaboration")) {
        return ["cross-functional collaboration", "collaboration", "stakeholder management", "project management", "interdepartmental communication"];
    } else if (questionText.includes("etl tools")) {
        return ["ETL tools", "Apache Nifi", "Airflow", "Talend", "DataStage", "workflow automation"];
    } else if (questionText.includes("data security")) {
        return ["data security", "data encryption", "data privacy", "compliance", "access control", "GDPR"];
    } else if (questionText.includes("budgeting")) {
        return ["budgeting", "cost management", "project budgeting", "resource allocation", "cost optimization"];
    } else if (questionText.includes("automation")) {
        return ["automation", "workflow automation", "data pipeline automation", "CI/CD", "DevOps"];
    } else if (questionText.includes("scalability")) {
        return ["scalability", "data architecture", "horizontal scaling", "vertical scaling", "cloud scalability"];
    } else if (questionText.includes("machine learning")) {
        return ["machine learning", "ML models", "model deployment", "data for ML", "data pipelines for ML"];
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