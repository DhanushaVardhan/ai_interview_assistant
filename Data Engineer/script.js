const dataEngineerQuestions = {
    "fresher": [
      { id: 1, question: "What is ETL, and why is it important in data engineering?" },
      { id: 2, question: "Explain the difference between structured and unstructured data." },
      { id: 3, question: "What are the main components of a data pipeline?" },
      { id: 4, question: "What is data normalization, and why is it necessary?" },
      { id: 5, question: "What is the difference between SQL and NoSQL databases?" },
      { id: 6, question: "What is a primary key and a foreign key in a database?" },
      { id: 7, question: "Explain the role of indexing in database performance." },
      { id: 8, question: "What are common data formats used in data engineering?" },
      { id: 9, question: "Describe the importance of data quality in analytics." },
      { id: 10, question: "How does a data warehouse differ from a data lake?" }
    ],
    "medium": [
      { id: 1, question: "How do you optimize a large-scale data pipeline?" },
      { id: 2, question: "Explain the role of Apache Spark in big data processing." },
      { id: 3, question: "What are different types of indexes in databases, and how do they improve performance?" },
      { id: 4, question: "What are the advantages of using cloud-based data storage solutions?" },
      { id: 5, question: "Explain the concept of data partitioning and sharding." },
      { id: 6, question: "How do you ensure data security in a cloud-based environment?" },
      { id: 7, question: "What is a star schema and a snowflake schema in data warehousing?" },
      { id: 8, question: "Explain the role of a data pipeline orchestrator like Apache Airflow." },
      { id: 9, question: "How do you handle missing data in a dataset?" },
      { id: 10, question: "What are the common challenges in data integration from multiple sources?" }
    ],
    "experienced": [
      { id: 1, question: "Explain partitioning in BigQuery and its advantages." },
      { id: 2, question: "How do you handle schema evolution in a data lake?" },
      { id: 3, question: "What are the best practices for designing a scalable data warehouse?" },
      { id: 4, question: "How do you ensure data consistency and integrity in distributed databases?" },
      { id: 5, question: "Explain the role of data cataloging and metadata management in large-scale data environments." },
      { id: 6, question: "How do you optimize batch processing in big data architectures?" },
      { id: 7, question: "What are the benefits and challenges of real-time data streaming?" },
      { id: 8, question: "Explain the importance of data lineage in enterprise data management." },
      { id: 9, question: "How do you design an efficient data archiving strategy?" },
      { id: 10, question: "What are the common bottlenecks in ETL processes and how do you mitigate them?" }
    ],
    "professional": [
      { id: 1, question: "How do you design a real-time data ingestion pipeline with Apache Kafka?" },
      { id: 2, question: "Explain the CAP theorem and its relevance to distributed systems." },
      { id: 3, question: "How do you optimize complex queries in a large-scale data warehouse?" },
      { id: 4, question: "Discuss the importance of data governance and compliance in enterprise data management." },
      { id: 5, question: "What are the challenges and solutions for managing petabyte-scale data infrastructure?" },
      { id: 6, question: "How do you ensure fault tolerance and high availability in a distributed data system?" },
      { id: 7, question: "What strategies do you use to minimize data redundancy in big data systems?" },
      { id: 8, question: "How do you approach designing a data architecture for a global enterprise?" },
      { id: 9, question: "What are the trade-offs between batch and stream processing?" },
      { id: 10, question: "How do you measure and improve the performance of a data engineering system?" }
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
      questionsToDisplay = getRandomQuestions(dataEngineerQuestions[currentLevel], 10);

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
    
    if (questionText.includes("database")) {
        return ["database", "relational databases", "SQL", "NoSQL", "MySQL", "PostgreSQL", "MongoDB", "data storage"];
    } else if (questionText.includes("data pipeline")) {
        return ["data pipeline", "ETL", "data integration", "data processing", "batch processing", "streaming"];
    } else if (questionText.includes("big data")) {
        return ["big data", "Hadoop", "MapReduce", "Apache Spark", "distributed systems", "data lakes"];
    } else if (questionText.includes("cloud")) {
        return ["cloud computing", "AWS", "Azure", "Google Cloud", "cloud storage", "cloud services"];
    } else if (questionText.includes("data warehouse")) {
        return ["data warehouse", "ETL processes", "OLAP", "data modeling", "Redshift", "Snowflake"];
    } else if (questionText.includes("data lake")) {
        return ["data lake", "data storage", "data ingestion", "raw data", "big data architecture"];
    } else if (questionText.includes("data quality")) {
        return ["data quality", "data validation", "data cleansing", "data consistency"];
    } else if (questionText.includes("etl tools")) {
        return ["ETL tools", "Talend", "Apache Nifi", "Airflow", "DataStage"];
    } else if (questionText.includes("data modeling")) {
        return ["data modeling", "star schema", "snowflake schema", "normalization", "denormalization"];
    } else if (questionText.includes("api")) {
        return ["API", "RESTful API", "data integration", "JSON", "data exchange"];
    } else if (questionText.includes("distributed systems")) {
        return ["distributed systems", "distributed computing", "fault tolerance", "scalability"];
    } else if (questionText.includes("data transformation")) {
        return ["data transformation", "data wrangling", "data processing", "data aggregation"];
    } else if (questionText.includes("data security")) {
        return ["data security", "data encryption", "data privacy", "data access control"];
    } else if (questionText.includes("sql")) {
        return ["SQL", "Structured Query Language", "queries", "joins", "subqueries"];
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