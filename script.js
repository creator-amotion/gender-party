const FORM_CONFIG = {
  actionUrl: "https://script.google.com/macros/s/AKfycbxMqb5PsrxtYG6Tjj-VlKnuVbDCnUNM3QVvRb48Mseb4U9HkjBQuHo1FfbkN3LSNeCL/exec",
};

function submitToGoogleForm(fields) {
  const data = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value) data.append(key, value);
  });
  fetch(FORM_CONFIG.actionUrl, {
    method: "POST",
    mode: "no-cors",
    body: data,
  }).catch(() => {});
}

// Balloons launch on scroll past hero
const heroEl = document.querySelector(".hero");
const heroBalloons = document.getElementById("hero-balloons");
const balloonObserver = new IntersectionObserver(
  ([entry]) => {
    if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
      heroBalloons.classList.add("launch");
    } else if (entry.isIntersecting) {
      heroBalloons.classList.remove("launch");
    }
  },
  { threshold: 0, rootMargin: "-50% 0px 0px 0px" }
);
balloonObserver.observe(heroEl);

// Countdown
function updateCountdown() {
  const target = new Date("2026-09-27T13:00:00+03:00").getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  document.getElementById("cd-days").textContent = String(days).padStart(2, "0");
  document.getElementById("cd-hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("cd-mins").textContent = String(mins).padStart(2, "0");
  document.getElementById("cd-secs").textContent = String(secs).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Voting
const voteCards = document.querySelectorAll(".vote__card");
const voteThanks = document.getElementById("vote-thanks");
const VOTE_KEY = "genderparty_voted";

if (localStorage.getItem(VOTE_KEY)) {
  voteThanks.hidden = false;
}

voteCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (localStorage.getItem(VOTE_KEY)) return;
    const choice = card.dataset.vote;
    voteCards.forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
    submitToGoogleForm({ vote: choice });
    localStorage.setItem(VOTE_KEY, choice);
    voteThanks.hidden = false;
  });
});

// Envelope teaser
const envelopeBtn = document.getElementById("envelope-btn");
const envelopeLetter = document.getElementById("envelope-letter");
envelopeBtn.addEventListener("click", () => {
  envelopeBtn.classList.add("opened");
  envelopeBtn.textContent = "💌";
  envelopeLetter.hidden = false;
});

// RSVP
const rsvpButtons = document.querySelectorAll("[data-rsvp]");
const rsvpThanks = document.getElementById("rsvp-thanks");
const rsvpThanksMain = document.getElementById("rsvp-thanks-main");
const nameInput = document.getElementById("rsvp-name");
const RSVP_KEY = "genderparty_rsvp";

function showRsvpThanks(answer) {
  rsvpThanks.hidden = false;
  rsvpThanksMain.textContent = answer === "Да"
    ? "Ура, ждём тебя! 🎉🎊🥳"
    : "Очень жаль, тебе не узнать ответ на главный вопрос 😢";
}

function burstConfetti(x, y) {
  const colors = ["#e6483c", "#f0b429", "#f2a9b8", "#6fa8d6", "#fffdf9"];
  for (let i = 0; i < 26; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = x + "px";
    piece.style.top = y + "px";
    piece.style.background = colors[i % colors.length];
    const angle = Math.random() * Math.PI * 2;
    const dist = 70 + Math.random() * 130;
    piece.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    piece.style.setProperty("--dy", Math.sin(angle) * dist - 60 + "px");
    piece.style.setProperty("--rot", Math.random() * 720 - 360 + "deg");
    document.body.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

function burstSadEmoji(x, y) {
  const emojis = ["😢", "💔", "😞"];
  for (let i = 0; i < 9; i++) {
    const piece = document.createElement("span");
    piece.className = "sad-piece";
    piece.textContent = emojis[i % emojis.length];
    piece.style.left = x + (Math.random() * 90 - 45) + "px";
    piece.style.top = y + "px";
    piece.style.setProperty("--fall", 70 + Math.random() * 60 + "px");
    document.body.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

const savedRsvp = localStorage.getItem(RSVP_KEY);
if (savedRsvp) showRsvpThanks(savedRsvp);

rsvpButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const answer = btn.dataset.rsvp;
    const rect = btn.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    if (answer === "Да") {
      burstConfetti(originX, originY);
    } else {
      burstSadEmoji(originX, originY);
    }
    submitToGoogleForm({
      attend: answer,
      name: nameInput.value.trim(),
    });
    localStorage.setItem(RSVP_KEY, answer);
    showRsvpThanks(answer);
  });
});
