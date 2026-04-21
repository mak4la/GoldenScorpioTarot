const businessEmail = "goldenscorpiotarot@example.com";

const deck = [
  {
    name: "The Magician",
    art: "magician",
    message: "Use what is already in your hands. Focus the question, then move with intention.",
  },
  {
    name: "The High Priestess",
    art: "priestess",
    message: "The quiet answer is not empty. Let your intuition speak before outside noise enters.",
  },
  {
    name: "The Empress",
    art: "empress",
    message: "Nurture what is growing. Beauty, patience, and care are part of the strategy.",
  },
  {
    name: "Strength",
    art: "strength",
    message: "Soft control beats force. Hold your boundary without hardening your heart.",
  },
  {
    name: "The Hermit",
    art: "hermit",
    message: "Step back long enough to hear yourself. The next clue appears in stillness.",
  },
  {
    name: "Justice",
    art: "justice",
    message: "Look at the facts and the pattern. A clear choice asks for honest accountability.",
  },
  {
    name: "Death",
    art: "death",
    message: "A cycle is closing so a truer one can begin. Release does not mean failure.",
  },
  {
    name: "The Star",
    art: "star",
    message: "Hope returns in small, believable ways. Let the future feel possible again.",
  },
  {
    name: "The Moon",
    art: "moon",
    message: "Not everything is visible yet. Move slowly until the emotion and the facts separate.",
  },
  {
    name: "The Sun",
    art: "sun",
    message: "Clarity warms the path. Let yourself be seen where you have been hiding.",
  },
  {
    name: "Two of Cups",
    art: "cups",
    message: "Mutual energy matters. Notice who meets you with presence, not only promises.",
  },
  {
    name: "Eight of Pentacles",
    art: "pentacles",
    message: "Your craft is becoming your confidence. Keep refining the thing you care about.",
  },
];

const positions = ["Message", "Where you are", "What is crossing you", "Next best step"];

const cardResults = document.querySelector("#cardResults");
const pullCards = document.querySelector("#pullCards");
const bookingForm = document.querySelector("#bookingForm");
const formStatus = document.querySelector("#formStatus");
const readingSelect = document.querySelector("#readingSelect");

function shuffleCards(cards) {
  return [...cards].sort(() => Math.random() - 0.5);
}

function cardArt(type) {
  const artwork = {
    magician: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M36 26c9-12 39-12 48 0" />
        <path d="M44 54h32l6 48H38l6-48Z" />
        <path d="M60 30v24" />
        <path d="M47 40h26" />
        <path d="M33 86h54" class="thin" />
        <circle cx="60" cy="18" r="6" />
        <path d="M36 102h48" />
      </svg>`,
    priestess: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M36 104V32" />
        <path d="M84 104V32" />
        <path d="M32 104h56" />
        <path d="M42 58c10 8 26 8 36 0" />
        <path d="M60 26c-8 0-14-6-14-14 4 4 24 4 28 0 0 8-6 14-14 14Z" />
        <circle cx="60" cy="64" r="12" />
      </svg>`,
    empress: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M34 96c20-42 32-42 52 0" />
        <path d="M41 68c10 9 28 9 38 0" />
        <path d="M60 36c12 0 21 9 21 21" />
        <path d="M60 36c-12 0-21 9-21 21" />
        <path d="M48 30c4-10 20-10 24 0" />
        <path d="M44 104h32" />
      </svg>`,
    strength: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M37 66c4-22 42-22 46 0 3 18-9 32-23 32S34 84 37 66Z" />
        <path d="M44 62c8 8 24 8 32 0" />
        <path d="M34 46c8-16 44-16 52 0" />
        <path d="M46 34c8-10 20-10 28 0" />
        <path d="M42 96c10 10 26 10 36 0" />
      </svg>`,
    hermit: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M58 36 38 104h44L62 36Z" />
        <path d="M60 16v18" />
        <path d="M47 26h26" />
        <path d="M30 102h60" />
        <path d="M74 70h18" />
        <path d="M92 70v34" />
        <circle cx="60" cy="18" r="7" />
      </svg>`,
    justice: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M60 18v84" />
        <path d="M36 34h48" />
        <path d="M42 34 28 70h28L42 34Z" />
        <path d="M78 34 64 70h28L78 34Z" />
        <path d="M40 102h40" />
        <path d="M50 88h20" />
      </svg>`,
    death: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M28 88c18 12 46 12 64 0" />
        <path d="M36 78c16-26 32-26 48 0" />
        <path d="M42 50h36" />
        <path d="M60 30v62" />
        <path d="M44 30h32" />
        <path d="M50 100h20" />
      </svg>`,
    star: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M60 18 68 47l30-1-25 17 10 29-23-18-23 18 10-29-25-17 30 1 8-29Z" />
        <path d="M22 100h76" class="thin" />
        <circle cx="26" cy="24" r="3" class="filled" />
        <circle cx="95" cy="32" r="3" class="filled" />
      </svg>`,
    moon: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M70 18c-15 8-23 27-17 44s23 27 40 23c-8 12-25 18-41 12-20-7-31-29-24-49 6-18 24-30 42-30Z" />
        <path d="M28 100c16-12 48-12 64 0" />
        <circle cx="34" cy="30" r="3" class="filled" />
        <circle cx="86" cy="38" r="3" class="filled" />
      </svg>`,
    sun: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="58" r="22" />
        <path d="M60 14v16M60 86v18M16 58h16M88 58h16M29 27l12 12M79 77l12 12M91 27 79 39M41 77 29 89" />
        <path d="M36 100h48" class="thin" />
      </svg>`,
    cups: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M34 30h28c0 22-5 34-14 38-9-4-14-16-14-38Z" />
        <path d="M58 30h28c0 22-5 34-14 38-9-4-14-16-14-38Z" />
        <path d="M48 68v22M72 68v22M38 92h20M62 92h20" />
        <path d="M48 38c5 8 19 8 24 0" />
      </svg>`,
    pentacles: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="42" cy="34" r="12" />
        <circle cx="78" cy="34" r="12" />
        <circle cx="42" cy="70" r="12" />
        <circle cx="78" cy="70" r="12" />
        <circle cx="60" cy="96" r="12" />
        <path d="m42 26 4 14-12-8h16l-12 8 4-14ZM78 26l4 14-12-8h16l-12 8 4-14ZM42 62l4 14-12-8h16l-12 8 4-14ZM78 62l4 14-12-8h16l-12 8 4-14ZM60 88l4 14-12-8h16l-12 8 4-14Z" class="thin" />
      </svg>`,
  };

  return artwork[type] || artwork.star;
}

function renderCards(count) {
  const selected = shuffleCards(deck).slice(0, count);
  cardResults.innerHTML = selected
    .map(
      (card, index) => `
        <article class="tarot-result">
          <small>${positions[count === 1 ? 0 : index + 1]}</small>
          <div class="card-art">${cardArt(card.art)}</div>
          <strong>${card.name}</strong>
          <p>${card.message}</p>
        </article>
      `,
    )
    .join("");
}

pullCards.addEventListener("click", () => {
  const count = Number(document.querySelector("input[name='spread']:checked").value);
  renderCards(count);
});

document.querySelectorAll("[data-reading]").forEach((button) => {
  button.addEventListener("click", () => {
    readingSelect.value = button.dataset.reading;
    document.querySelector("#book").scrollIntoView({ behavior: "smooth" });
  });
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!bookingForm.reportValidity()) {
    return;
  }

  const formData = new FormData(bookingForm);
  const subject = `Reading request: ${formData.get("reading")}`;
  const body = [
    `Email: ${formData.get("email")}`,
    `Reading type: ${formData.get("reading")}`,
    `Focus area: ${formData.get("focus") || "Not provided"}`,
    `Delivery: ${formData.get("delivery")}`,
    "",
    "Details:",
    formData.get("details") || "Not provided",
  ].join("\n");

  localStorage.setItem("goldenScorpioReadingRequest", body);
  formStatus.textContent = "Your request is drafted. Confirm the email window to send it.";
  window.location.href = `mailto:${businessEmail}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
});
