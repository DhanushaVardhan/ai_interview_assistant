const databaseAdministratorQuestions = {
    "fresher": [
      { id: 1, question: "What is a database, and why is it important?" },
      { id: 2, question: "Explain the difference between SQL and NoSQL databases." },
      { id: 3, question: "What are the different types of database management systems (DBMS)?" },
      { id: 4, question: "What is normalization in databases, and why is it necessary?" },
      { id: 5, question: "What is the purpose of indexing in a database?" },
      { id: 6, question: "What is a primary key, and how does it differ from a foreign key?" },
      { id: 7, question: "What are the ACID properties in a database?" },
      { id: 8, question: "Explain the difference between OLTP and OLAP systems." },
      { id: 9, question: "What is a stored procedure, and how is it used?" },
      { id: 10, question: "What are database constraints, and why are they important?" }
    ],
    "medium": [
      { id: 1, question: "What is database partitioning, and when should it be used?" },
      { id: 2, question: "Explain the concept of database replication." },
      { id: 3, question: "How do you optimize SQL queries for performance?" },
      { id: 4, question: "What are different types of database backups?" },
      { id: 5, question: "How do you handle deadlocks in a database system?" },
      { id: 6, question: "What are the advantages and disadvantages of using indexing?" },
      { id: 7, question: "What is a materialized view, and how is it different from a regular view?" },
      { id: 8, question: "Explain the concept of database sharding." },
      { id: 9, question: "How do you enforce data integrity in a database?" },
      { id: 10, question: "What is the role of a transaction log in a database system?" }
    ],
    "experienced": [
      { id: 1, question: "How do you troubleshoot and optimize a slow database query?" },
      { id: 2, question: "What are some best practices for database security?" },
      { id: 3, question: "How do you implement high availability in a database system?" },
      { id: 4, question: "Explain the concept of eventual consistency in distributed databases." },
      { id: 5, question: "What are some strategies for database performance tuning?" },
      { id: 6, question: "How do you design a disaster recovery plan for a database system?" },
      { id: 7, question: "What are the challenges in managing a multi-tenant database?" },
      { id: 8, question: "Explain the CAP theorem and its implications on database design." },
      { id: 9, question: "What is the role of a database administrator in a cloud environment?" },
      { id: 10, question: "How do you handle schema evolution in a database?" }
    ],
    "professional": [
      { id: 1, question: "How do you design and implement a scalable database architecture?" },
      { id: 2, question: "What are the latest trends in database technology?" },
      { id: 3, question: "How do you ensure compliance with data protection regulations in database management?" },
      { id: 4, question: "What are the key considerations when migrating a database to the cloud?" },
      { id: 5, question: "How do you secure a database against SQL injection and other cyber threats?" },
      { id: 6, question: "What are the trade-offs between relational and NoSQL databases for large-scale applications?" },
      { id: 7, question: "How do you implement data encryption in a database?" },
      { id: 8, question: "What are some best practices for monitoring and maintaining a production database?" },
      { id: 9, question: "How do you manage access control and user permissions in a database?" },
      { id: 10, question: "What are the key challenges in managing big data storage systems?" }
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
      questionsToDisplay = getRandomQuestions(databaseAdministratorQuestions[currentLevel], 10);

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
    
    if (questionText.includes("database design")) {
        return ["database design", "normalization", "denormalization", "ER model", "schema"];
    } else if (questionText.includes("sql")) {
        return ["SQL", "Structured Query Language", "queries", "joins", "subqueries", "stored procedures"];
    } else if (questionText.includes("indexing")) {
        return ["indexing", "database indexes", "B-tree", "hash indexes", "query optimization"];
    } else if (questionText.includes("backups")) {
        return ["backups", "data recovery", "backup strategies", "disaster recovery", "restore"];
    } else if (questionText.includes("data security")) {
        return ["data security", "data encryption", "data privacy", "user access control", "authentication"];
    } else if (questionText.includes("performance tuning")) {
        return ["performance tuning", "query optimization", "load balancing", "database optimization"];
    } else if (questionText.includes("replication")) {
        return ["replication", "database replication", "master-slave replication", "high availability"];
    } else if (questionText.includes("database migration")) {
        return ["database migration", "data transfer", "cloud migration", "schema migration", "ETL"];
    } else if (questionText.includes("transactions")) {
        return ["transactions", "ACID properties", "transaction management", "commit", "rollback"];
    } else if (questionText.includes("distributed databases")) {
        return ["distributed databases", "NoSQL", "CAP theorem", "sharding", "horizontal scaling"];
    } else if (questionText.includes("database management systems")) {
        return ["DBMS", "RDBMS", "MySQL", "PostgreSQL", "Oracle", "SQL Server", "NoSQL"];
    } else if (questionText.includes("data integrity")) {
        return ["data integrity", "constraints", "referential integrity", "data validation"];
    } else if (questionText.includes("high availability")) {
        return ["high availability", "failover", "clustering", "load balancing", "redundancy"];
    } else if (questionText.includes("query optimization")) {
        return ["query optimization", "execution plans", "database performance", "indexing", "joins"];
    } else if (questionText.includes("cloud databases")) {
        return ["cloud databases", "AWS RDS", "Google Cloud SQL", "Azure SQL", "database as a service"];
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