class TypingTest {
            constructor() {
                this.sentences = {
                    general: [
                        "The quick brown fox jumps over the lazy dog near the sparkling riverbank under moonlight.",
                        "She sells seashells by the seashore while watching the magnificent sunset paint the sky.",
                        "A journey of a thousand miles begins with a single confident step toward your dreams.",
                        "The early bird catches the worm but the second mouse gets the delicious cheese reward.",
                        "Life is what happens when you're busy making other wonderful plans for tomorrow's adventures."
                    ],
                    programming: [
                        "function calculateSum(arr) { return arr.reduce((sum, num) => sum + num, 0); }",
                        "const users = await fetch('/api/users').then(response => response.json());",
                        "if (condition === true && array.length > 0) { console.log('Processing data'); }",
                        "class DataProcessor extends BaseClass { constructor() { super(); this.data = []; } }",
                        "const result = numbers.filter(n => n % 2 === 0).map(n => n * 2).sort((a, b) => a - b);"
                    ],
                    quotes: [
                        "The only way to do great work is to love what you do every single day. - Steve Jobs",
                        "Innovation distinguishes between a leader and a follower in every field. - Steve Jobs",
                        "Life is 10% what happens to you and 90% how you react to it with grace. - Charles Swindoll",
                        "The future belongs to those who believe in the beauty of their dreams and aspirations. - Eleanor Roosevelt",
                        "Success is not final, failure is not fatal: it is the courage to continue that truly counts. - Winston Churchill"
                    ],
                    business: [
                        "Our quarterly revenue increased by 15% due to improved customer retention strategies and market expansion.",
                        "The marketing team will launch a comprehensive digital campaign next month targeting millennial consumers.",
                        "Please review the project timeline carefully and provide detailed feedback by end of business day.",
                        "We need to streamline our processes to improve operational efficiency and significantly reduce overhead costs.",
                        "The board of directors approved the budget allocation for the upcoming fiscal year's major initiatives."
                    ],
                    science: [
                        "Photosynthesis converts carbon dioxide and water into glucose using sunlight energy through chlorophyll molecules.",
                        "The periodic table organizes chemical elements by atomic number and recurring chemical properties systematically.",
                        "DNA contains the genetic instructions needed for the development and functioning of all living organisms.",
                        "Einstein's theory of relativity revolutionized our fundamental understanding of space, time, and gravity.",
                        "Mitochondria are known as the powerhouses of the cell due to their crucial ATP production processes."
                    ]
                };

                this.currentSentence = '';
                this.currentType = 'general';
                this.startTime = null;
                this.endTime = null;
                this.isTestActive = false;
                this.timerInterval = null;
                this.timeLimit = 60;
                this.timeRemaining = this.timeLimit;
                this.errors = 0;
                this.totalCharacters = 0;
                this.correctCharacters = 0;

                this.initializeElements();
                this.bindEvents();
                this.loadNewSentence();
            }

            initializeElements() {
                this.sentenceDisplay = document.getElementById('sentenceDisplay');
                this.typingInput = document.getElementById('typingInput');
                this.startBtn = document.getElementById('startBtn');
                this.resetBtn = document.getElementById('resetBtn');
                this.newSentenceBtn = document.getElementById('newSentenceBtn');
                this.copyBtn = document.getElementById('copyBtn');
                this.results = document.getElementById('results');
                
                this.wpmDisplay = document.getElementById('wpm');
                this.accuracyDisplay = document.getElementById('accuracy');
                this.timerDisplay = document.getElementById('timer');
                this.errorsDisplay = document.getElementById('errors');
                
                this.finalWPM = document.getElementById('finalWPM');
                this.finalAccuracy = document.getElementById('finalAccuracy');
                this.performanceMessage = document.getElementById('performanceMessage');
                
                this.wpmCircle = document.getElementById('wpm-circle');
                this.accuracyBar = document.getElementById('accuracy-bar');
                this.timerBar = document.getElementById('timer-bar');
            }

            bindEvents() {
                this.startBtn.addEventListener('click', () => this.startTest());
                this.resetBtn.addEventListener('click', () => this.resetTest());
                this.newSentenceBtn.addEventListener('click', () => this.loadNewSentence());
                this.copyBtn.addEventListener('click', () => this.copySentence());
                
                this.typingInput.addEventListener('input', () => this.handleInput());
                this.typingInput.addEventListener('keydown', (e) => this.handleKeydown(e));

                // Category buttons
                document.querySelectorAll('.category-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => this.changeSentenceType(e.target.dataset.type));
                });
            }

            changeSentenceType(type) {
                this.currentType = type;
                
                document.querySelectorAll('.category-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                event.target.classList.add('active');
                this.loadNewSentence();
            }

            loadNewSentence() {
                const sentences = this.sentences[this.currentType];
                this.currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
                this.displaySentence();
                this.resetTest();
            }

            displaySentence() {
                this.sentenceDisplay.innerHTML = this.currentSentence.split('').map(char => 
                    `<span>${char}</span>`
                ).join('');
            }

            copySentence() {
                navigator.clipboard.writeText(this.currentSentence).then(() => {
                    this.copyBtn.innerHTML = '✅ Copied!';
                    setTimeout(() => {
                        this.copyBtn.innerHTML = '📋 Copy Text';
                    }, 2000);
                });
            }

            startTest() {
                this.isTestActive = true;
                this.startTime = new Date().getTime();
                this.timeRemaining = this.timeLimit;
                
                this.typingInput.disabled = false;
                this.typingInput.focus();
                this.startBtn.disabled = true;
                this.startBtn.innerHTML = '⏰ Testing...';
                
                this.startTimer();
            }

            startTimer() {
                this.timerInterval = setInterval(() => {
                    this.timeRemaining--;
                    this.timerDisplay.textContent = this.timeRemaining;
                    
                    const progress = (this.timeRemaining / this.timeLimit) * 100;
                    this.timerBar.style.width = progress + '%';
                    
                    if (this.timeRemaining <= 0) {
                        this.endTest();
                    }
                }, 1000);
            }

            handleInput() {
                if (!this.isTestActive) return;
                
                const typedText = this.typingInput.value;
                this.highlightText(typedText);
                this.calculateStats(typedText);
                
                if (typedText === this.currentSentence) {
                    this.endTest();
                }
            }

            handleKeydown(e) {
                if (!this.isTestActive && e.key !== 'Tab') {
                    e.preventDefault();
                }
            }

            highlightText(typedText) {
                const sentenceChars = this.sentenceDisplay.querySelectorAll('span');
                
                sentenceChars.forEach((span, index) => {
                    span.className = '';
                    
                    if (index < typedText.length) {
                        if (typedText[index] === this.currentSentence[index]) {
                            span.classList.add('correct');
                        } else {
                            span.classList.add('incorrect');
                        }
                    } else if (index === typedText.length) {
                        span.classList.add('current');
                    }
                });
            }

            calculateStats(typedText) {
                this.totalCharacters = typedText.length;
                this.correctCharacters = 0;
                this.errors = 0;
                
                for (let i = 0; i < typedText.length; i++) {
                    if (typedText[i] === this.currentSentence[i]) {
                        this.correctCharacters++;
                    } else {
                        this.errors++;
                    }
                }
                
                const timeElapsed = (new Date().getTime() - this.startTime) / 1000 / 60;
                const wordsTyped = this.correctCharacters / 5;
                const wpm = Math.round(wordsTyped / timeElapsed) || 0;
                
                const accuracy = this.totalCharacters > 0 ? 
                    Math.round((this.correctCharacters / this.totalCharacters) * 100) : 100;
                
                this.wpmDisplay.textContent = wpm;
                this.accuracyDisplay.textContent = accuracy + '%';
                this.errorsDisplay.textContent = this.errors;
                
                // Update visual indicators
                const wpmProgress = Math.min(wpm / 100, 1);
                const circumference = 2 * Math.PI * 36;
                const offset = circumference - (wpmProgress * circumference);
                this.wpmCircle.style.strokeDashoffset = offset;
                
                this.accuracyBar.style.width = accuracy + '%';
            }

            endTest() {
                this.isTestActive = false;
                this.endTime = new Date().getTime();
                
                clearInterval(this.timerInterval);
                this.typingInput.disabled = true;
                
                this.showResults();
            }

            showResults() {
                const timeElapsed = (this.endTime - this.startTime) / 1000 / 60;
                const wordsTyped = this.correctCharacters / 5;
                const finalWPM = Math.round(wordsTyped / timeElapsed) || 0;
                const finalAccuracy = this.totalCharacters > 0 ? 
                    Math.round((this.correctCharacters / this.totalCharacters) * 100) : 100;
                
                this.finalWPM.textContent = finalWPM;
                this.finalAccuracy.textContent = finalAccuracy + '%';
                
                let message = '';
                if (finalWPM >= 70 && finalAccuracy >= 95) {
                    message = '🏆 LEGENDARY! You\'re a typing master supreme!';
                } else if (finalWPM >= 50 && finalAccuracy >= 90) {
                    message = '🔥 AMAZING! Your skills are on fire!';
                } else if (finalWPM >= 35 && finalAccuracy >= 85) {
                    message = '⭐ GREAT JOB! You\'re improving rapidly!';
                } else if (finalWPM >= 20 && finalAccuracy >= 75) {
                    message = '👍 GOOD WORK! Keep practicing consistently!';
                } else {
                    message = '💪 KEEP GOING! Every expert was once a beginner!';
                }
                
                this.performanceMessage.textContent = message;
                this.results.classList.remove('hidden');
            }

            resetTest() {
                this.isTestActive = false;
                this.startTime = null;
                this.endTime = null;
                this.timeRemaining = this.timeLimit;
                this.errors = 0;
                this.totalCharacters = 0;
                this.correctCharacters = 0;
                
                clearInterval(this.timerInterval);
                
                this.typingInput.value = '';
                this.typingInput.disabled = true;
                
                this.startBtn.disabled = false;
                this.startBtn.innerHTML = '🚀 Start Typing';
                
                this.wpmDisplay.textContent = '0';
                this.accuracyDisplay.textContent = '100%';
                this.timerDisplay.textContent = this.timeLimit;
                this.errorsDisplay.textContent = '0';
                
                // Reset visual indicators
                this.wmpCircle?.style.setProperty('stroke-dashoffset', '251.2');
                this.accuracyBar.style.width = '100%';
                this.timerBar.style.width = '100%';
                
                this.results.classList.add('hidden');
                
                const sentenceChars = this.sentenceDisplay.querySelectorAll('span');
                sentenceChars.forEach(span => span.className = '');
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            new TypingTest();
        });

  // Dark Mode Toggle
  const toggleBtn = document.getElementById('theme-toggle');
  const toggleBtnMobile = document.getElementById('theme-toggle-mobile');

  function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    toggleBtn.textContent = isDark ? '☀️' : '🌙';
    toggleBtnMobile.textContent = isDark ? '☀️' : '🌙';
  }

  toggleBtn.onclick = toggleTheme;
  toggleBtnMobile.onclick = toggleTheme;

  // Mobile Menu
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');

  function toggleMobileMenu() {
    mobileMenu.classList.toggle('translate-x-full');
    mobileOverlay.classList.toggle('hidden');
    document.body.style.overflow = mobileMenu.classList.contains('translate-x-full') ? 'auto' : 'hidden';
  }

  mobileMenuButton.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', toggleMobileMenu);

  //share the site
  function shareApp() {
  const shareData = {
    title: document.title,
    text: "Check out this awesome site!",
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData)
      .then(() => console.log('Shared successfully!'))
      .catch((error) => console.log('Sharing failed:', error));
  } else {
    navigator.clipboard.writeText(shareData.url).then(() => {
      alert("Copied link to clipboard:\n" + shareData.url);
    }).catch(err => {
      alert("Could not copy link. Please copy manually:\n" + shareData.url);
    });
  }
}

