const nlpEngineerQuestions = {
    "fresher": [
      { id: 1, question: "What is Natural Language Processing (NLP)?" },
      { id: 2, question: "Explain the difference between NLP and Computational Linguistics." },
      { id: 3, question: "What are the common preprocessing steps in NLP?" },
      { id: 4, question: "What is tokenization in NLP?" },
      { id: 5, question: "Explain stemming and lemmatization with examples." },
      { id: 6, question: "What is the purpose of stopword removal in NLP?" },
      { id: 7, question: "What are n-grams, and how are they used in NLP?" },
      { id: 8, question: "What is part-of-speech (POS) tagging?" },
      { id: 9, question: "Explain Named Entity Recognition (NER)." },
      { id: 10, question: "What is the difference between a corpus and a lexicon?" },
      { id: 11, question: "What are word embeddings in NLP?" },
      { id: 12, question: "What is the Bag of Words (BoW) model?" },
      { id: 13, question: "Explain TF-IDF and its importance in NLP." },
      { id: 14, question: "What is a language model in NLP?" },
      { id: 15, question: "How does sentiment analysis work?" }
    ],
    "medium": [
      { id: 1, question: "How do you evaluate the performance of an NLP model?" },
      { id: 2, question: "Explain word2vec and how it works." },
      { id: 3, question: "What is the difference between CBOW and Skip-gram in word2vec?" },
      { id: 4, question: "What are transformers in NLP?" },
      { id: 5, question: "Explain the working of BERT." },
      { id: 6, question: "How does attention mechanism work in NLP?" },
      { id: 7, question: "What are recurrent neural networks (RNNs) used for in NLP?" },
      { id: 8, question: "How does LSTM improve upon RNNs?" },
      { id: 9, question: "What are some real-world applications of NLP?" },
      { id: 10, question: "What are sequence-to-sequence models in NLP?" },
      { id: 11, question: "Explain the difference between generative and extractive summarization." },
      { id: 12, question: "What challenges do NLP models face with polysemy and synonymy?" },
      { id: 13, question: "What is dependency parsing?" },
      { id: 14, question: "How does machine translation work in NLP?" },
      { id: 15, question: "What are some ethical concerns in NLP?" }
    ],
    "experienced": [
      { id: 1, question: "How do you fine-tune a pre-trained NLP model?" },
      { id: 2, question: "Explain transfer learning in NLP." },
      { id: 3, question: "What is zero-shot and few-shot learning in NLP?" },
      { id: 4, question: "How do you handle bias in NLP models?" },
      { id: 5, question: "Explain how Named Entity Recognition (NER) can be improved." },
      { id: 6, question: "What are some advanced techniques for text classification?" },
      { id: 7, question: "How do you deploy an NLP model in production?" },
      { id: 8, question: "Explain how multilingual NLP models work." },
      { id: 9, question: "How do you optimize NLP models for speed and efficiency?" },
      { id: 10, question: "What is self-supervised learning in NLP?" },
      { id: 11, question: "How does GPT-3 generate text?" },
      { id: 12, question: "What are some ways to reduce hallucinations in NLP models?" },
      { id: 13, question: "What techniques are used for low-resource languages in NLP?" },
      { id: 14, question: "How do you evaluate conversational AI models?" },
      { id: 15, question: "What are some adversarial attacks on NLP models?" }
    ],
    "professional": [
      { id: 1, question: "How do you build a custom transformer model from scratch?" },
      { id: 2, question: "What are state-of-the-art techniques in NLP?" },
      { id: 3, question: "How do you handle large-scale NLP training?" },
      { id: 4, question: "Explain unsupervised and semi-supervised NLP models." },
      { id: 5, question: "How does knowledge distillation work in NLP?" },
      { id: 6, question: "What is meta-learning in NLP?" },
      { id: 7, question: "Explain the role of reinforcement learning in NLP." },
      { id: 8, question: "How do you make NLP models more interpretable?" },
      { id: 9, question: "What is continual learning in NLP?" },
      { id: 10, question: "How do you handle NLP models on edge devices?" },
      { id: 11, question: "What are federated learning applications in NLP?" },
      { id: 12, question: "How do you handle real-time NLP inference?" },
      { id: 13, question: "What are some applications of NLP in healthcare?" },
      { id: 14, question: "Explain ethical AI principles in NLP." },
      { id: 15, question: "What is the role of symbolic AI in NLP?" }
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
      questionsToDisplay = getRandomQuestions(nlpEngineerQuestions[currentLevel], 10);

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
    
    if (questionText.includes("nlp") || questionText.includes("natural language processing")) {
        return ["NLP", "text processing", "linguistics"];
    } else if (questionText.includes("tokenization")) {
        return ["tokenization", "text segmentation", "words"];
    } else if (questionText.includes("stemming") || questionText.includes("lemmatization")) {
        return ["stemming", "lemmatization", "word normalization"];
    } else if (questionText.includes("word embedding")) {
        return ["word embeddings", "vector representation", "word2vec", "glove"];
    } else if (questionText.includes("transformer")) {
        return ["transformers", "BERT", "GPT", "self-attention"];
    } else if (questionText.includes("sentiment analysis")) {
        return ["sentiment analysis", "opinion mining", "polarity"];
    } else if (questionText.includes("named entity recognition")) {
        return ["NER", "entity extraction", "information retrieval"];
    } else if (questionText.includes("language model")) {
        return ["language model", "probability distribution", "text generation"];
    } else if (questionText.includes("sequence-to-sequence")) {
        return ["seq2seq", "machine translation", "encoder-decoder"];
    } else if (questionText.includes("attention mechanism")) {
        return ["attention mechanism", "context vectors", "deep learning"];
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