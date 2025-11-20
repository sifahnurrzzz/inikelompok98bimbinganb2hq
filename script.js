// Smooth scroll navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update active link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Scroll to section
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});


// Update active nav on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});



// Gallery Section - Auto play music when scroll to gallery
let musicPlayed = false;
const bgMusic = document.getElementById('bgMusic');
bgMusic.volume = 1; // memastikan tidak diblokir autoplay

const observerOptions = {
    threshold: 0.5
};

const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Jika galeri terlihat → coba mainkan musik
        if (entry.isIntersecting && !musicPlayed) {
            bgMusic.currentTime = 61;
            bgMusic.play().catch(err => {
                console.log('Autoplay diblokir, user perlu interaksi:', err);
            });
        }
    });
}, observerOptions);

const galeriSection = document.getElementById('galeri');
galleryObserver.observe(galeriSection);

// tandai bahwa musik berhasil diputar
bgMusic.addEventListener('play', () => {
    musicPlayed = true;
});

// Click anywhere to play music if autoplay blocked
document.addEventListener('click', () => {
    bgMusic.currentTime = 61;
    bgMusic.play();
}, { once: true });

// Tombol Play / Pause Musik
const toggleBtn = document.getElementById('toggleMusic');

toggleBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.currentTime = 61;
        bgMusic.play();
        toggleBtn.textContent = "🔈 Matikan Lagu";
    } else {
        bgMusic.pause();
        toggleBtn.textContent = "🔊 Putar Lagu";
    }
});

// ========================
// GAME TAJWID
// ========================

const questions = [
    {
        question: "Apa hukum bacaan 'Alif Lam Syamsiyah' pada kata 'الشَّمْسُ'?",
        answers: ["Alif Lam Syamsiyah", "Alif Lam Qamariyah", "Ikhfa", "Idgham Bilaghunnah"],
        correct: 0
    },
    {
        question: "Huruf mad thobi'i dibaca berapa harakat?",
        answers: ["1 harakat", "2 harakat", "4 harakat", "6 harakat"],
        correct: 1
    },
    {
        question: "Apa nama hukum bacaan ketika nun mati/tanwin bertemu huruf ب?",
        answers: ["Izhar", "Idgham", "Iqlab", "Ikhfa"],
        correct: 2
    },
    {
        question: "Hukum nun mati dan tanwin ada 4, yaitu?",
        answers: ["Idzhar Haqiqi, Idgham, Iqlab, Mad Thabii", "Idzhar Haqiqi, Idgham Mutaqaribain, Iqlab, Ikhfa", "Idzhar Haqiqi, Idgham, Iqlab, Ikhfa", "Idzhar Syafawi, Idgham, Iqlab, Ikhfa"],
        correct: 2
    },
    {
        question: "Apa nama hukum bacaan nun mati bertemu huruf ل?",
        answers: ["Ikhfa", "Idgham Bilaghunnah", "Idgham Bighunnah", "Iqlab"],
        correct: 1
    },
    {
        question: "Mad terbagi menjadi 2, ada Mad Thabi'i (Huruf nya ada 3 Alif, Wawu, dan Ya) dan Mad Far'i (ada 15), Berikut salah satu yang termasuk bagian Mad Far'i yaitu Mad 'Arid Lissukun, dibaca berapa harakat?",
        answers: ["2, 4, atau 6 harakat", "1 atau 2 harakat", "4 harakat saja", "6 harakat saja"],
        correct: 0
    },
    {
        question: "Hukum Mim mati dan tanwid ada 3, yaitu...",
        answers: ["Idzhar Syafawi, Idgham Mimi, Ikhfa Syafawi", "Idzhar Haqiqi, Idgham Mimi, Ikhfa Syafawi", "Idzhar Syafawi, Idgham Mimi, Ikhfa Aqrob", "Idzhar Syafawi, Idgham Mimi, Iqlab"],
        correct: 0
    },
    {
        question: "Berapa huruf Ikhfa Haqiqi?",
        answers: ["13 huruf", "15 huruf", "17 huruf", "19 huruf"],
        correct: 1
    },
    {
        question: "Apa nama hukum bacaan 'مِنْ وَلِيٍّ'?",
        answers: ["Idgham Bilaghunnah", "Idgham Bighunnah", "Ikhfa", "Izhar"],
        correct: 1
    },
    {
        question: "Qalqalah Kubra terjadi ketika huruf qalqalah berada di mana?",
        answers: ["Tengah kalimat", "Akhir kalimat dengan waqaf", "Awal kalimat", "Huruf bertasydid"],
        correct: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;

const questionText = document.getElementById('questionText');
const answersGrid = document.getElementById('answersGrid');
const scoreValue = document.getElementById('score');
const currentQuestionEl = document.getElementById('currentQuestion');
const totalQuestionsEl = document.getElementById('totalQuestions');
const gameContent = document.getElementById('gameContent');
const gameResult = document.getElementById('gameResult');
const finalScoreEl = document.getElementById('finalScore');
const resultMessage = document.getElementById('resultMessage');
const restartBtn = document.getElementById('restartBtn');

totalQuestionsEl.textContent = questions.length;

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    currentQuestionEl.textContent = currentQuestionIndex + 1;
    
    answersGrid.innerHTML = '';
    
    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.addEventListener('click', () => selectAnswer(index));
        answersGrid.appendChild(button);
    });
}

function selectAnswer(selectedIndex) {
    const currentQuestion = questions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.answer-btn');
    
    buttons.forEach(btn => btn.disabled = true);
    
    if (selectedIndex === currentQuestion.correct) {
        buttons[selectedIndex].classList.add('correct');
        score++;
        scoreValue.textContent = score;
    } else {
        buttons[selectedIndex].classList.add('wrong');
        buttons[currentQuestion.correct].classList.add('correct');
    }
    
    setTimeout(() => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }, 1500);
}

function showResult() {
    gameContent.classList.add('hidden');
    gameResult.classList.remove('hidden');
    
    finalScoreEl.textContent = score;
    
    if (score === questions.length) {
        resultMessage.textContent = "Masha Allah! Sempurna! Kamu benar-benar memahami tajwid dengan baik! 🌟";
    } else if (score >= questions.length * 0.7) {
        resultMessage.textContent = "Alhamdulillah! Sangat bagus! Terus semangat belajar tajwid! 💪";
    } else if (score >= questions.length * 0.5) {
        resultMessage.textContent = "Bagus! Masih ada yang perlu dipelajari lagi. Semangat! 📖";
    } else {
        resultMessage.textContent = "Tetap semangat! Yuk belajar tajwid lagi supaya lebih paham! ✨";
    }
}

function restartGame() {
    currentQuestionIndex = 0;
    score = 0;
    scoreValue.textContent = 0;
    gameContent.classList.remove('hidden');
    gameResult.classList.add('hidden');
    loadQuestion();
}

restartBtn.addEventListener('click', restartGame);

// Initialize game
loadQuestion();
