const businessEmail = "goldenscorpiotarot@example.com";

const deck = [
  {
    name: "The Magician",
    message: "Use what is already in your hands. Focus the question, then move with intention.",
  },
  {
    name: "The High Priestess",
    message: "The quiet answer is not empty. Let your intuition speak before outside noise enters.",
  },
  {
    name: "The Empress",
    message: "Nurture what is growing. Beauty, patience, and care are part of the strategy.",
  },
  {
    name: "Strength",
    message: "Soft control beats force. Hold your boundary without hardening your heart.",
  },
  {
    name: "The Hermit",
    message: "Step back long enough to hear yourself. The next clue appears in stillness.",
  },
  {
    name: "Justice",
    message: "Look at the facts and the pattern. A clear choice asks for honest accountability.",
  },
  {
    name: "Death",
    message: "A cycle is closing so a truer one can begin. Release does not mean failure.",
  },
  {
    name: "The Star",
    message: "Hope returns in small, believable ways. Let the future feel possible again.",
  },
  {
    name: "The Moon",
    message: "Not everything is visible yet. Move slowly until the emotion and the facts separate.",
  },
  {
    name: "The Sun",
    message: "Clarity warms the path. Let yourself be seen where you have been hiding.",
  },
  {
    name: "Two of Cups",
    message: "Mutual energy matters. Notice who meets you with presence, not only promises.",
  },
  {
    name: "Eight of Pentacles",
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

function renderCards(count) {
  const selected = shuffleCards(deck).slice(0, count);
  cardResults.innerHTML = selected
    .map(
      (card, index) => `
        <article class="tarot-result">
          <small>${positions[count === 1 ? 0 : index + 1]}</small>
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
