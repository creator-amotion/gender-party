const FORM_CONFIG = {
  actionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfiiVgu0U4aq8luX6M6il6ghbhgYIxokfMzA_OxUaliqNPaSA/formResponse",
  entryName: "entry.559352220",
  entryAttend: "entry.877086558",
  entryVote: "entry.2118111400",
};

function submitToGoogleForm(fields) {
  if (FORM_CONFIG.actionUrl.startsWith("TODO")) {
    console.warn("Google Форма ещё не подключена — см. README.md");
    return;
  }
  const data = new FormData();
  Object.entries(fields).forEach(([entry, value]) => {
    if (value) data.append(entry, value);
  });
  fetch(FORM_CONFIG.actionUrl, {
    method: "POST",
    mode: "no-cors",
    body: data,
  }).catch(() => {});
}

// Background tuner (open the site with ?tune=1 to use)
if (new URLSearchParams(location.search).has("tune")) {
  const panel = document.createElement("div");
  panel.id = "bg-tuner";
  panel.innerHTML = `
    <strong>Настройка фона</strong>
    <label>Масштаб: <span id="tune-scale-val">100</span>%</label>
    <input type="range" id="tune-scale" min="30" max="400" value="100">
    <label>Сдвиг по вертикали: <span id="tune-pos-val">0</span>%</label>
    <input type="range" id="tune-pos" min="-100" max="100" value="0">
    <button id="tune-copy">Скопировать значения</button>
    <div id="bg-tuner-output"></div>
  `;
  document.body.appendChild(panel);

  const root = document.documentElement.style;
  const scaleInput = document.getElementById("tune-scale");
  const posInput = document.getElementById("tune-pos");
  const scaleVal = document.getElementById("tune-scale-val");
  const posVal = document.getElementById("tune-pos-val");
  const output = document.getElementById("bg-tuner-output");

  function updateTuner() {
    scaleVal.textContent = scaleInput.value;
    posVal.textContent = posInput.value;
    root.setProperty("--bg-size", `${scaleInput.value}%`);
    root.setProperty("--bg-pos-y", `${posInput.value}%`);
    output.textContent = `Масштаб: ${scaleInput.value}%, Сдвиг: ${posInput.value}%`;
  }
  scaleInput.addEventListener("input", updateTuner);
  posInput.addEventListener("input", updateTuner);
  updateTuner();

  document.getElementById("tune-copy").addEventListener("click", () => {
    const text = `Масштаб: ${scaleInput.value}%, Сдвиг: ${posInput.value}%`;
    navigator.clipboard?.writeText(text).catch(() => {});
    alert("Скопировано! Пришлите эти цифры мне в чат — " + text);
  });
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
    submitToGoogleForm({ [FORM_CONFIG.entryVote]: choice });
    localStorage.setItem(VOTE_KEY, choice);
    voteThanks.hidden = false;
  });
});

// RSVP
const rsvpButtons = document.querySelectorAll("[data-rsvp]");
const rsvpThanks = document.getElementById("rsvp-thanks");
const nameInput = document.getElementById("rsvp-name");
const RSVP_KEY = "genderparty_rsvp";

function showRsvpThanks(answer) {
  rsvpThanks.hidden = false;
  rsvpThanks.textContent = answer === "Да"
    ? "Ура, ждём тебя! 🎉"
    : "Жаль, что не получится — обнимаем!";
}

const savedRsvp = localStorage.getItem(RSVP_KEY);
if (savedRsvp) showRsvpThanks(savedRsvp);

rsvpButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const answer = btn.dataset.rsvp;
    submitToGoogleForm({
      [FORM_CONFIG.entryAttend]: answer,
      [FORM_CONFIG.entryName]: nameInput.value.trim(),
    });
    localStorage.setItem(RSVP_KEY, answer);
    showRsvpThanks(answer);
  });
});
