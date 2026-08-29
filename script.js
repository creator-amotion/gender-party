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

// Countdown
function updateCountdown() {
  const target = new Date("2026-09-27T14:00:00+03:00").getTime();
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
