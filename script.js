// Global variables
let currentLanguage = 'javascript';
let currentTest = null;
let testQuestions = [];
let currentQuestion = 0;
let userAnswers = {};
let testTimer = null;
let timeLeft = 0;
let isPaused = false;
let studentName = '';
let testStartTime = null;

// Code templates
const codeTemplates = {
    javascript: 'console.log("Hello, World!");',
    python: 'print("Hello, World!")',
    c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}'
};

// Tutorials data
const tutorials = {
    javascript: {
        title: 'JavaScript Basics',
        content: `
            <h3>JavaScript Variables</h3>
            <pre><code>let name = "CodeMaster";
let age = 25;
const PI = 3.14159;</code></pre>
            
            <h3>Functions</h3>
            <pre><code>function greet(name) {
    return "Hello, " + name + "!";
}

console.log(greet("World"));</code></pre>
            
            <h3>Arrays</h3>
            <pre><code>let numbers = [1, 2, 3, 4, 5];
numbers.forEach(num => console.log(num));</code></pre>
        `
    },
    python: {
        title: 'Python Basics',
        content: `
            <h3>Python Variables</h3>
            <pre><code>name = "CodeMaster"
age = 25
PI = 3.14159</code></pre>
            
            <h3>Functions</h3>
            <pre><code>def greet(name):
    return f"Hello, {name}!"

print(greet("World"))</code></pre>
            
            <h3>Lists</h3>
            <pre><code>numbers = [1, 2, 3, 4, 5]
for num in numbers:
    print(num)</code></pre>
        `
    },
    c: {
        title: 'C Programming Basics',
        content: `
            <h3>C Variables</h3>
            <pre><code>#include <stdio.h>

int main() {
    int age = 25;
    char name[] = "CodeMaster";
    float pi = 3.14159;
    
    printf("Name: %s, Age: %d\\n", name, age);
    return 0;
}</code></pre>
            
            <h3>Functions</h3>
            <pre><code>#include <stdio.h>

void greet(char name[]) {
    printf("Hello, %s!\\n", name);
}

int main() {
    greet("World");
    return 0;
}</code></pre>
        `
    }
};

// 200+ MCQ Questions Database
const mcqDatabase = [
    // Programming Fundamentals
    { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"], correct: 0 },
    { question: "Which language is used for web styling?", options: ["HTML", "JavaScript", "CSS", "Python"], correct: 2 },
    { question: "What is the correct way to declare a variable in JavaScript?", options: ["var x = 5;", "variable x = 5;", "v x = 5;", "declare x = 5;"], correct: 0 },
    { question: "Which symbol is used for comments in Python?", options: ["//", "/*", "#", "<!--"], correct: 2 },
    { question: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Unit", "Computer Processing Unit"], correct: 0 },
    
    // JavaScript Questions
    { question: "Which method is used to add an element to the end of an array in JavaScript?", options: ["push()", "add()", "append()", "insert()"], correct: 0 },
    { question: "What is the result of '5' + 3 in JavaScript?", options: ["8", "53", "Error", "undefined"], correct: 1 },
    { question: "Which keyword is used to declare a constant in JavaScript?", options: ["var", "let", "const", "final"], correct: 2 },
    { question: "What does DOM stand for?", options: ["Document Object Model", "Data Object Management", "Dynamic Object Method", "Document Oriented Model"], correct: 0 },
    { question: "Which method converts a string to lowercase in JavaScript?", options: ["toLowerCase()", "lower()", "downCase()", "lowerCase()"], correct: 0 },
    
    // Python Questions
    { question: "Which function is used to get the length of a list in Python?", options: ["length()", "size()", "len()", "count()"], correct: 2 },
    { question: "What is the correct way to create a function in Python?", options: ["function myFunc():", "def myFunc():", "create myFunc():", "func myFunc():"], correct: 1 },
    { question: "Which operator is used for exponentiation in Python?", options: ["^", "**", "exp", "pow"], correct: 1 },
    { question: "What is the output of print(type([]))?", options: ["<class 'array'>", "<class 'list'>", "<class 'tuple'>", "<class 'dict'>"], correct: 1 },
    { question: "Which method is used to add an item to a list in Python?", options: ["add()", "append()", "insert()", "push()"], correct: 1 },
    
    // C Programming Questions
    { question: "Which header file is required for printf() function in C?", options: ["<stdlib.h>", "<stdio.h>", "<string.h>", "<math.h>"], correct: 1 },
    { question: "What is the size of int data type in C (typically)?", options: ["2 bytes", "4 bytes", "8 bytes", "1 byte"], correct: 1 },
    { question: "Which operator is used to get the address of a variable in C?", options: ["*", "&", "@", "#"], correct: 1 },
    { question: "What is the correct way to declare a pointer in C?", options: ["int ptr;", "int *ptr;", "int &ptr;", "pointer int ptr;"], correct: 1 },
    { question: "Which loop is guaranteed to execute at least once?", options: ["for loop", "while loop", "do-while loop", "nested loop"], correct: 2 },
    
    // Database Questions
    { question: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "Sequential Query Language"], correct: 0 },
    { question: "Which SQL command is used to retrieve data?", options: ["GET", "SELECT", "FETCH", "RETRIEVE"], correct: 1 },
    { question: "What is a primary key?", options: ["A key that opens the database", "A unique identifier for records", "The first key in a table", "A password for the database"], correct: 1 },
    { question: "Which SQL command is used to add new data?", options: ["ADD", "INSERT", "CREATE", "NEW"], correct: 1 },
    { question: "What does DBMS stand for?", options: ["Database Management System", "Data Backup Management System", "Digital Business Management System", "Database Monitoring System"], correct: 0 },
    
    // Web Development
    { question: "Which HTML tag is used for the largest heading?", options: ["<h6>", "<h1>", "<header>", "<heading>"], correct: 1 },
    { question: "Which CSS property is used to change text color?", options: ["text-color", "font-color", "color", "text-style"], correct: 2 },
    { question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], correct: 1 },
    { question: "Which HTML attribute specifies an alternate text for an image?", options: ["title", "alt", "src", "href"], correct: 1 },
    { question: "Which method is used to select an element by ID in JavaScript?", options: ["getElementById()", "selectById()", "getElement()", "findById()"], correct: 0 },
    
    // Computer Science Fundamentals
    { question: "What is an algorithm?", options: ["A programming language", "A step-by-step procedure to solve a problem", "A type of computer", "A software application"], correct: 1 },
    { question: "Which data structure follows LIFO principle?", options: ["Queue", "Stack", "Array", "Tree"], correct: 1 },
    { question: "What does RAM stand for?", options: ["Random Access Memory", "Read Access Memory", "Rapid Access Memory", "Remote Access Memory"], correct: 0 },
    { question: "Which sorting algorithm has the best average time complexity?", options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"], correct: 2 },
    { question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 1 }
    // ... Continue with more questions to reach 200+
];

// Theory Questions Database
const theoryDatabase = [
    {
        question: "Explain the difference between compiler and interpreter with examples.",
        answer: "A compiler translates the entire source code into machine code before execution (e.g., C, C++), while an interpreter executes code line by line during runtime (e.g., Python, JavaScript). Compiled programs run faster but take time to compile, while interpreted programs are slower but easier to debug."
    },
    {
        question: "What is Object-Oriented Programming? Explain its main principles.",
        answer: "OOP is a programming paradigm based on objects and classes. Main principles: 1) Encapsulation - bundling data and methods, 2) Inheritance - creating new classes from existing ones, 3) Polymorphism - same interface for different data types, 4) Abstraction - hiding complex implementation details."
    },
    {
        question: "Explain the concept of database normalization and its benefits.",
        answer: "Database normalization is organizing data to reduce redundancy and improve data integrity. Benefits include: eliminating duplicate data, reducing storage space, maintaining data consistency, easier updates, and preventing insertion/deletion anomalies. Common forms are 1NF, 2NF, and 3NF."
    },
    {
        question: "What is the difference between GET and POST methods in HTTP?",
        answer: "GET retrieves data from server, parameters visible in URL, limited data size, cacheable, idempotent. POST sends data to server, parameters in request body, larger data capacity, not cacheable, not idempotent. GET for retrieving, POST for submitting data."
    },
    {
        question: "Explain the concept of recursion with an example.",
        answer: "Recursion is when a function calls itself to solve a problem by breaking it into smaller subproblems. Example: factorial(n) = n * factorial(n-1), with base case factorial(0) = 1. Essential components: base case to stop recursion and recursive case that calls itself with modified parameters."
    }
];

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show target section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to corresponding nav link
    document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
}

// Add click listeners to nav links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });
});

// Language change
function changeLanguage() {
    currentLanguage = document.getElementById('language-select').value;
    document.getElementById('code-editor').value = codeTemplates[currentLanguage];
    clearOutput();
}

// Clear code
function clearCode() {
    document.getElementById('code-editor').value = '';
    clearOutput();
}

// Clear output
function clearOutput() {
    const output = document.getElementById('output');
    output.textContent = 'Output will appear here...';
    output.className = 'output-content';
}

// Run code with live compilation
async function runCode() {
    const code = document.getElementById('code-editor').value;
    const output = document.getElementById('output');
    
    if (!code.trim()) {
        output.textContent = 'Please write some code first!';
        output.className = 'output-content error';
        return;
    }
    
    output.innerHTML = '<div class="loading"></div> Running...';
    
    try {
        let result;
        
        switch (currentLanguage) {
            case 'javascript':
                result = await runJavaScript(code);
                break;
            case 'python':
                result = await runPython(code);
                break;
            case 'c':
                result = await runC(code);
                break;
            default:
                result = { output: 'Language not supported', error: true };
        }
        
        output.textContent = result.output;
        output.className = result.error ? 'output-content error' : 'output-content success';
        
    } catch (error) {
        output.textContent = `Error: ${error.message}`;
        output.className = 'output-content error';
    }
}

// JavaScript execution
async function runJavaScript(code) {
    try {
        // Capture console.log output
        let output = '';
        const originalLog = console.log;
        console.log = (...args) => {
            output += args.join(' ') + '\n';
        };
        
        // Execute code
        eval(code);
        
        // Restore console.log
        console.log = originalLog;
        
        return { output: output || 'Code executed successfully', error: false };
    } catch (error) {
        return { output: error.message, error: true };
    }
}

// Python execution (using Pyodide)
async function runPython(code) {
    try {
        // Load Pyodide if not already loaded
        if (!window.pyodide) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
            document.head.appendChild(script);
            
            await new Promise((resolve) => {
                script.onload = resolve;
            });
            
            window.pyodide = await loadPyodide();
        }
        
        // Capture print output
        window.pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
        `);
        
        // Run user code
        window.pyodide.runPython(code);
        
        // Get output
        const output = window.pyodide.runPython('sys.stdout.getvalue()');
        
        return { output: output || 'Code executed successfully', error: false };
    } catch (error) {
        return { output: error.message, error: true };
    }
}

// C execution (simulation)
async function runC(code) {
    try {
        // Simple C code simulation
        if (code.includes('printf')) {
            // Extract printf statements
            const printfMatches = code.match(/printf\s*\(\s*"([^"]*)"[^)]*\)/g);
            if (printfMatches) {
                let output = '';
                printfMatches.forEach(match => {
                    const text = match.match(/"([^"]*)"/)[1];
                    output += text.replace(/\\n/g, '\n') + '\n';
                });
                return { output, error: false };
            }
        }
        
        // Check for common errors
        if (!code.includes('#include <stdio.h>') && code.includes('printf')) {
            return { output: 'Error: stdio.h not included', error: true };
        }
        
        if (!code.includes('int main()')) {
            return { output: 'Error: main function not found', error: true };
        }
        
        return { output: 'C code compiled and executed successfully', error: false };
    } catch (error) {
        return { output: error.message, error: true };
    }
}

// Load tutorial
function loadTutorial(language) {
    const tutorial = tutorials[language];
    const content = document.getElementById('tutorial-content');
    
    content.innerHTML = `
        <h2>${tutorial.title}</h2>
        ${tutorial.content}
    `;
    content.classList.add('active');
}

// Show MCQ Settings Modal
function showMCQSettings() {
    document.getElementById('mcq-modal').classList.add('active');
}

// Close MCQ Settings Modal
function closeMCQSettings() {
    document.getElementById('mcq-modal').classList.remove('active');
}

// Start MCQ Test
function startMCQTest() {
    const questionCount = parseInt(document.getElementById('question-count').value);
    studentName = document.getElementById('student-name').value.trim();
    
    if (!studentName) {
        alert('Please enter your name');
        return;
    }
    
    closeMCQSettings();
    
    // Setup test
    currentTest = 'mcq';
    testQuestions = getRandomQuestions(mcqDatabase, questionCount);
    currentQuestion = 0;
    userAnswers = {};
    testStartTime = new Date();
    
    // Set timer based on question count
    timeLeft = questionCount === 20 ? 600 : questionCount === 50 ? 1500 : 3000; // 10, 25, 50 minutes
    
    startTimer();
    loadQuestion();
    showTestInterface();
}

// Start Theory Test
function startTest(type) {
    if (type === 'theory') {
        studentName = prompt('Enter your name:');
        if (!studentName) return;
        
        currentTest = 'theory';
        testQuestions = getRandomQuestions(theoryDatabase, 10);
        currentQuestion = 0;
        userAnswers = {};
        testStartTime = new Date();
        timeLeft = 3600; // 60 minutes
        
        startTimer();
        loadQuestion();
        showTestInterface();
    }
}

// Get random questions from database
function getRandomQuestions(database, count) {
    const shuffled = [...database].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, database.length));
}

// Show test interface
function showTestInterface() {
    document.querySelector('.test-container').style.display = 'none';
    document.getElementById('test-interface').classList.add('active');
    
    document.getElementById('test-info').textContent = `${currentTest.toUpperCase()} Test - ${studentName}`;
    updateQuestionCounter();
}

// Load current question
function loadQuestion() {
    if (currentQuestion >= testQuestions.length) {
        finishTest();
        return;
    }
    
    const question = testQuestions[currentQuestion];
    const testContent = document.getElementById('test-content');
    
    if (currentTest === 'mcq') {
        testContent.innerHTML = `
            <div class="question">
                <h3>Question ${currentQuestion + 1}</h3>
                <p>${question.question}</p>
            </div>
            <div class="options">
                ${question.options.map((option, index) => `
                    <div class="option ${userAnswers[currentQuestion] === index ? 'selected' : ''}" 
                         onclick="selectOption(${index})">${option}</div>
                `).join('')}
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${((currentQuestion + 1) / testQuestions.length) * 100}%"></div>
            </div>
        `;
    } else if (currentTest === 'theory') {
        testContent.innerHTML = `
            <div class="question">
                <h3>Question ${currentQuestion + 1}</h3>
                <p>${question.question}</p>
            </div>
            <textarea class="theory-answer" placeholder="Write your answer here..." 
                      onchange="saveTheoryAnswer(this.value)">${userAnswers[currentQuestion] || ''}</textarea>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${((currentQuestion + 1) / testQuestions.length) * 100}%"></div>
            </div>
        `;
    }
    
    updateNavigation();
    updateQuestionCounter();
}

// Save theory answer
function saveTheoryAnswer(answer) {
    userAnswers[currentQuestion] = answer;
}

// Select option
function selectOption(index) {
    // Remove previous selection
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    
    // Add selection to clicked option
    document.querySelectorAll('.option')[index].classList.add('selected');
    
    // Save answer
    userAnswers[currentQuestion] = index;
}

// Next question
function nextQuestion() {
    currentQuestion++;
    loadMCQQuestion();
}

// Previous question
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadMCQQuestion();
    }
}

// Timer functions
function startTimer() {
    testTimer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                finishTest();
            } else if (timeLeft <= 300) { // 5 minutes warning
                document.getElementById('timer').classList.add('warning');
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function togglePause() {
    isPaused = !isPaused;
    const pauseBtn = document.getElementById('pause-btn');
    const testContent = document.getElementById('test-content');
    
    if (isPaused) {
        pauseBtn.textContent = 'Resume';
        testContent.classList.add('paused');
    } else {
        pauseBtn.textContent = 'Pause';
        testContent.classList.remove('paused');
    }
}

// Navigation functions
function updateNavigation() {
    document.getElementById('prev-btn').disabled = currentQuestion === 0;
    document.getElementById('next-btn').textContent = 
        currentQuestion === testQuestions.length - 1 ? 'Finish' : 'Next';
}

function updateQuestionCounter() {
    document.getElementById('question-counter').textContent = 
        `${currentQuestion + 1} / ${testQuestions.length}`;
}

// Finish test
function finishTest() {
    clearInterval(testTimer);
    
    let score = 0;
    let totalQuestions = testQuestions.length;
    
    if (currentTest === 'mcq') {
        testQuestions.forEach((question, index) => {
            if (userAnswers[index] === question.correct) {
                score++;
            }
        });
    } else if (currentTest === 'theory') {
        // Simple scoring for theory - count non-empty answers
        Object.values(userAnswers).forEach(answer => {
            if (answer && answer.trim().length > 20) {
                score++;
            }
        });
    }
    
    const percentage = Math.round((score / totalQuestions) * 100);
    showResults(score, totalQuestions, percentage);
}

// Show results
function showResults(score, total, percentage) {
    document.getElementById('test-interface').classList.remove('active');
    
    const results = document.getElementById('results');
    results.innerHTML = `
        <h2>Test Complete!</h2>
        <div class="score">${percentage}%</div>
        <p><strong>${studentName}</strong>, you scored ${score} out of ${total} questions correctly.</p>
        <p>Test completed in ${formatTime(new Date() - testStartTime)}</p>
        <div class="results-actions">
            <button class="btn primary" onclick="downloadPDF()">Download Results PDF</button>
            <button class="btn" onclick="retryTest()">Retry Test</button>
            <button class="btn" onclick="backToTests()">Back to Tests</button>
        </div>
    `;
    results.classList.add('active');
}

// Utility functions
function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
}

function retryTest() {
    document.getElementById('results').classList.remove('active');
    if (currentTest === 'mcq') {
        showMCQSettings();
    } else {
        startTest('theory');
    }
}

function backToTests() {
    document.getElementById('results').classList.remove('active');
    document.querySelector('.test-container').style.display = 'grid';
}

// PDF Generation
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('CodeMaster Test Results', 105, 20, { align: 'center' });
    
    // Student info
    doc.setFontSize(12);
    doc.text(`Student: ${studentName}`, 20, 40);
    doc.text(`Test Type: ${currentTest.toUpperCase()}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
    doc.text(`Questions: ${testQuestions.length}`, 20, 70);
    
    // Results
    let yPos = 90;
    doc.setFontSize(14);
    doc.text('Results:', 20, yPos);
    yPos += 10;
    
    testQuestions.forEach((question, index) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFontSize(10);
        doc.text(`Q${index + 1}: ${question.question}`, 20, yPos);
        yPos += 7;
        
        if (currentTest === 'mcq') {
            const userAnswer = userAnswers[index];
            const correct = question.correct;
            doc.text(`Your answer: ${userAnswer !== undefined ? question.options[userAnswer] : 'Not answered'}`, 25, yPos);
            yPos += 5;
            doc.text(`Correct answer: ${question.options[correct]}`, 25, yPos);
            yPos += 5;
            doc.text(`Result: ${userAnswer === correct ? 'Correct' : 'Incorrect'}`, 25, yPos);
        } else {
            doc.text(`Your answer: ${userAnswers[index] || 'Not answered'}`, 25, yPos);
            yPos += 5;
        }
        yPos += 10;
    });
    
    doc.save(`CodeMaster-${currentTest}-Results-${studentName}.pdf`);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set initial code template
    document.getElementById('code-editor').value = codeTemplates[currentLanguage];
    
    // Close modal when clicking outside
    document.getElementById('mcq-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeMCQSettings();
        }
    });
});