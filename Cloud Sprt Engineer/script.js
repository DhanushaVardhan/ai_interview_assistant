const cloudSupportEngineerQuestions = {
    "fresher": [
      { id: 1, question: "What is cloud computing, and how does it differ from traditional IT infrastructure?" },
      { id: 2, question: "What are the different cloud deployment models?" },
      { id: 3, question: "What is the difference between IaaS, PaaS, and SaaS?" },
      { id: 4, question: "Can you explain the basic components of cloud architecture?" },
      { id: 5, question: "What are some commonly used cloud service providers?" },
      { id: 6, question: "What is auto-scaling in cloud computing?" },
      { id: 7, question: "What are security groups and their role in cloud computing?" },
      { id: 8, question: "What is a virtual machine, and how does it work in a cloud environment?" },
      { id: 9, question: "How does cloud storage work?" },
      { id: 10, question: "What are the benefits of using cloud computing?" }
    ],
    "medium": [
      { id: 1, question: "What is the shared responsibility model in cloud security?" },
      { id: 2, question: "How do you troubleshoot connectivity issues in a cloud network?" },
      { id: 3, question: "What are the differences between block storage, file storage, and object storage?" },
      { id: 4, question: "What is an API Gateway, and why is it used in cloud applications?" },
      { id: 5, question: "Explain the concept of IAM (Identity and Access Management) in cloud security." },
      { id: 6, question: "What is containerization, and how does it relate to cloud computing?" },
      { id: 7, question: "How do you monitor the performance of cloud resources?" },
      { id: 8, question: "What are common troubleshooting steps for cloud service outages?" },
      { id: 9, question: "What is a load balancer, and how does it improve cloud application performance?" },
      { id: 10, question: "How do you ensure data security in cloud storage?" }
    ],
    "experienced": [
      { id: 1, question: "How do you optimize cloud costs for a business?" },
      { id: 2, question: "What are the challenges of multi-cloud management?" },
      { id: 3, question: "Explain the concept of hybrid cloud and its use cases." },
      { id: 4, question: "How do you implement disaster recovery solutions in the cloud?" },
      { id: 5, question: "What are the best practices for securing cloud-based applications?" },
      { id: 6, question: "How do you handle cloud compliance and regulatory requirements?" },
      { id: 7, question: "What are the key considerations when migrating applications to the cloud?" },
      { id: 8, question: "How does serverless computing work, and when should it be used?" },
      { id: 9, question: "What are the benefits and challenges of using microservices in the cloud?" },
      { id: 10, question: "How do you troubleshoot performance issues in cloud-based applications?" }
    ],
    "professional": [
      { id: 1, question: "How do you design a highly available and fault-tolerant cloud infrastructure?" },
      { id: 2, question: "What are the best strategies for cloud capacity planning?" },
      { id: 3, question: "How do you implement CI/CD pipelines in a cloud environment?" },
      { id: 4, question: "What are the challenges and solutions for big data processing in the cloud?" },
      { id: 5, question: "How do you secure API integrations in a cloud environment?" },
      { id: 6, question: "What are the key factors to consider in cloud service selection for an enterprise?" },
      { id: 7, question: "How do you ensure business continuity in a cloud-based IT environment?" },
      { id: 8, question: "What strategies do you use for monitoring and observability in the cloud?" },
      { id: 9, question: "How do you manage network security in a cloud-native application?" },
      { id: 10, question: "What are the benefits and risks of edge computing in a cloud environment?" }
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
      questionsToDisplay = getRandomQuestions(cloudSupportEngineerQuestions[currentLevel], 10);

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
    
    if (questionText.includes("cloud troubleshooting")) {
        return ["cloud troubleshooting", "incident management", "problem resolution", "cloud service issues"];
    } else if (questionText.includes("aws") || questionText.includes("azure") || questionText.includes("gcp")) {
        return ["AWS", "Azure", "Google Cloud Platform", "cloud platforms", "cloud services"];
    } else if (questionText.includes("cloud architecture")) {
        return ["cloud architecture", "cloud infrastructure", "cloud design", "high availability", "fault tolerance"];
    } else if (questionText.includes("cloud monitoring")) {
        return ["cloud monitoring", "CloudWatch", "Azure Monitor", "GCP Stackdriver", "cloud performance"];
    } else if (questionText.includes("service outage")) {
        return ["service outage", "downtime", "cloud failures", "incident response", "recovery"];
    } else if (questionText.includes("networking")) {
        return ["networking", "VPC", "subnets", "IP addressing", "DNS", "VPN"];
    } else if (questionText.includes("security") || questionText.includes("compliance")) {
        return ["security", "compliance", "IAM", "firewall", "data encryption", "cloud security best practices"];
    } else if (questionText.includes("customer support")) {
        return ["customer support", "troubleshooting", "user assistance", "technical support", "service desk"];
    } else if (questionText.includes("api")) {
        return ["API", "RESTful API", "API Gateway", "cloud services integration", "API management"];
    } else if (questionText.includes("cost management")) {
        return ["cost management", "cloud billing", "AWS cost explorer", "Azure cost management", "GCP billing"];
    } else if (questionText.includes("deployment")) {
        return ["deployment", "cloud deployments", "blue-green deployment", "canary releases", "rollbacks"];
    } else if (questionText.includes("automation")) {
        return ["automation", "cloud automation", "scripts", "CloudFormation", "Terraform", "CI/CD pipelines"];
    } else if (questionText.includes("backup and recovery")) {
        return ["backup and recovery", "data protection", "cloud backup", "disaster recovery", "RTO", "RPO"];
    } else if (questionText.includes("performance optimization")) {
        return ["performance optimization", "scaling", "load balancing", "resource management", "auto-scaling"];
    } else if (questionText.includes("incident management")) {
        return ["incident management", "root cause analysis", "post-mortem", "service restoration", "escalation"];
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