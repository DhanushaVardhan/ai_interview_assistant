const cloudEngineerQuestions = {
    "fresher": [
      { id: 1, question: "What is cloud computing, and how does it work?" },
      { id: 2, question: "What are the different types of cloud service models (IaaS, PaaS, SaaS)?" },
      { id: 3, question: "What are the benefits of using cloud computing?" },
      { id: 4, question: "Explain the difference between public, private, and hybrid clouds." },
      { id: 5, question: "What is virtualization, and how does it relate to cloud computing?" },
      { id: 6, question: "What are some common cloud computing platforms?" },
      { id: 7, question: "What is auto-scaling in cloud computing?" },
      { id: 8, question: "What are the key components of cloud architecture?" },
      { id: 9, question: "What is a virtual machine, and how is it different from a container?" },
      { id: 10, question: "How does cloud storage work, and what are its advantages?" }
    ],
    "medium": [
      { id: 1, question: "What is a VPC (Virtual Private Cloud), and why is it used?" },
      { id: 2, question: "How do you ensure security in a cloud environment?" },
      { id: 3, question: "What are the differences between horizontal and vertical scaling?" },
      { id: 4, question: "What is containerization, and why is it important in cloud engineering?" },
      { id: 5, question: "Explain the differences between Docker and Kubernetes." }
    ],
    "experienced": [
      { id: 1, question: "How do you optimize cloud costs for a large-scale deployment?" },
      { id: 2, question: "What are microservices, and how do they work in a cloud environment?" },
      { id: 3, question: "What are some best practices for disaster recovery in the cloud?" },
      { id: 4, question: "How do you design a multi-cloud strategy?" },
      { id: 5, question: "What is serverless computing, and when should it be used?" },
      { id: 6, question: "Explain the shared responsibility model in cloud security." },
      { id: 7, question: "What are some challenges of managing a cloud-based infrastructure?" },
      { id: 8, question: "How do you handle compliance and regulatory requirements in the cloud?" },
      { id: 9, question: "What is API Gateway, and how is it used in cloud services?" },
      { id: 10, question: "How do you troubleshoot performance issues in a cloud environment?" }
    ],
    "professional": [
      { id: 1, question: "How do you architect a highly available and fault-tolerant cloud infrastructure?" },
      { id: 2, question: "What are the considerations for implementing CI/CD in the cloud?" },
      { id: 3, question: "How do you manage data privacy and encryption in the cloud?" },
      { id: 4, question: "What strategies do you use for cloud migration?" },
      { id: 5, question: "What is FinOps, and why is it important for cloud cost management?" },
      { id: 6, question: "How do you implement observability and monitoring in a cloud-native environment?" },
      { id: 7, question: "What are the trade-offs between using managed services and self-hosted solutions in the cloud?" },
      { id: 8, question: "How do you design a cloud-based data analytics platform?" },
      { id: 9, question: "What are the key considerations when designing edge computing solutions?" },
      { id: 10, question: "How do you ensure business continuity in a cloud environment?" }
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
      questionsToDisplay = getRandomQuestions(cloudEngineerQuestions[currentLevel], 10);

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
    
    if (questionText.includes("vpc") || questionText.includes("virtual private cloud")) {
        return ["VPC", "cloud networking", "subnet", "security groups", "isolation"];
    } else if (questionText.includes("cloud security")) {
        return ["cloud security", "encryption", "IAM", "firewalls", "monitoring"];
    } else if (questionText.includes("scaling")) {
        return ["scaling", "horizontal scaling", "vertical scaling", "load balancing", "elasticity"];
    } else if (questionText.includes("containerization") || questionText.includes("docker") || questionText.includes("kubernetes")) {
        return ["containerization", "Docker", "Kubernetes", "microservices", "orchestration"];
    } else if (questionText.includes("cloud storage")) {
        return ["cloud storage", "object storage", "block storage", "S3", "Google Cloud Storage", "Azure Blob"];
    } else if (questionText.includes("cloud computing models")) {
        return ["cloud computing", "IaaS", "PaaS", "SaaS", "hybrid cloud", "multi-cloud"];
    } else if (questionText.includes("devops")) {
        return ["DevOps", "CI/CD", "automation", "infrastructure as code", "Terraform", "Ansible"];
    } else if (questionText.includes("cloud networking")) {
        return ["cloud networking", "VPN", "DNS", "CDN", "load balancer"];
    } else if (questionText.includes("serverless computing")) {
        return ["serverless computing", "AWS Lambda", "Google Cloud Functions", "Azure Functions", "event-driven architecture"];
    } else if (questionText.includes("disaster recovery") || questionText.includes("backups")) {
        return ["disaster recovery", "backups", "fault tolerance", "redundancy", "restore"];
    } else if (questionText.includes("cloud migration")) {
        return ["cloud migration", "data transfer", "lift and shift", "hybrid cloud", "modernization"];
    } else if (questionText.includes("network security")) {
        return ["network security", "zero trust", "DDoS protection", "firewall", "WAF"];
    } else if (questionText.includes("cloud monitoring")) {
        return ["cloud monitoring", "observability", "logging", "tracing", "Prometheus", "Grafana"];
    } else if (questionText.includes("identity and access management") || questionText.includes("iam")) {
        return ["IAM", "authentication", "authorization", "roles", "least privilege"];
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