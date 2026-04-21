const formspreeEndpoint = "https://formspree.io/f/mnjlgjqq";
const REQUEST_STORAGE_KEY = "goldenScorpioPendingRequest";

const STRIPE_LINKS = {
  singleSpark: "https://buy.stripe.com/fZu7sMbZvbhf5D9ewa6kg02",
  pastPresentFuture: "https://buy.stripe.com/5kQeVe7JfbhfghNbjY6kg01",
  goldenDeepDive: "https://buy.stripe.com/3cIeVeaVr4SRghNgEi6kg00",
};

const READING_TO_STRIPE_KEY = {
  "Single Spark": "singleSpark",
  "Past • Present • Future": "pastPresentFuture",
  "Golden Deep Dive": "goldenDeepDive",
};

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
const readingSelectionNote = document.querySelector("#readingSelectionNote");
const finalizeRequest = document.querySelector("#finalizeRequest");
const confirmationStatus = document.querySelector("#confirmationStatus");
const requestSummary = document.querySelector("#requestSummary");

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

pullCards?.addEventListener("click", () => {
  const count = Number(document.querySelector("input[name='spread']:checked").value);
  renderCards(count);
});

function updateReadingSelectionNote(reading) {
  if (!readingSelectionNote) {
    return;
  }

  readingSelectionNote.textContent = reading
    ? `Thank you for choosing the ${reading} reading.`
    : "Choose a reading above or select one here.";
}

document.querySelectorAll("[data-reading-choice]").forEach((link) => {
  link.addEventListener("click", () => {
    const reading = link.dataset.readingChoice;

    if (readingSelect) {
      readingSelect.value = reading;
      updateReadingSelectionNote(reading);
    }
  });
});

readingSelect?.addEventListener("change", () => {
  updateReadingSelectionNote(readingSelect.value);
});

function getStripeCheckoutUrl(reading, email) {
  const stripeKey = READING_TO_STRIPE_KEY[reading];
  const stripeUrl = STRIPE_LINKS[stripeKey];

  if (!stripeUrl) {
    throw new Error("Please choose one of the listed reading types.");
  }

  const url = new URL(stripeUrl);
  url.searchParams.set("prefilled_email", email);
  return url.toString();
}

function getRequestData(form) {
  const formData = new FormData(form);

  return {
    email: formData.get("email") || "",
    preferredName: formData.get("preferredName") || "",
    reading: formData.get("reading") || "",
    focus: formData.get("focus") || "",
    details: formData.get("details") || "",
    delivery: formData.get("delivery") || "",
    consent: formData.get("consent") === "on",
    savedAt: new Date().toISOString(),
  };
}

function getSavedRequest() {
  const savedRequest = window.localStorage.getItem(REQUEST_STORAGE_KEY);

  if (!savedRequest) {
    return null;
  }

  try {
    return JSON.parse(savedRequest);
  } catch {
    window.localStorage.removeItem(REQUEST_STORAGE_KEY);
    return null;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createRequestFormData(request) {
  const formData = new FormData();
  const confirmationSummary = [
    "Thank you for booking with Golden Scorpio Tarot.",
    "",
    `Reading: ${request.reading}`,
    `Email: ${request.email}`,
    `Preferred name: ${request.preferredName || "Not provided"}`,
    `Focus: ${request.focus || "Not provided"}`,
    `Delivery preference: ${request.delivery}`,
    "",
    "Your request has been received. You should receive your reading by the end of day.",
  ].join("\n");

  formData.set("email", request.email);
  formData.set("_replyto", request.email);
  formData.set("_cc", request.email);
  formData.set("preferred_name", request.preferredName);
  formData.set("reading", request.reading);
  formData.set("focus", request.focus);
  formData.set("details", request.details);
  formData.set("delivery", request.delivery);
  formData.set("consent", request.consent ? "Confirmed" : "Not confirmed");
  formData.set("customer_confirmation", confirmationSummary);
  formData.set("payment_status", "Customer returned from Stripe checkout");
  formData.set("_subject", `Paid reading request: ${request.reading}`);

  return formData;
}

function submitSavedRequest(request) {
  return fetch(formspreeEndpoint, {
    method: "POST",
    body: createRequestFormData(request),
    headers: {
      Accept: "application/json",
    },
  }).then(async (response) => {
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const message = data.errors?.[0]?.message || "Please try sending your request again.";
      throw new Error(message);
    }
  });
}

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!bookingForm.reportValidity()) {
    formStatus.textContent = "Please complete the required fields before checkout.";
    return;
  }

  const request = getRequestData(bookingForm);
  const submitButton = bookingForm.querySelector("button[type='submit']");

  try {
    const checkoutUrl = getStripeCheckoutUrl(request.reading, request.email);

    window.localStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(request));
    submitButton.disabled = true;
    submitButton.textContent = "Opening secure checkout...";
    formStatus.textContent = "Your details are saved. Sending you to secure checkout...";
    window.location.href = checkoutUrl;
  } catch (error) {
    formStatus.textContent = error.message || "Please check the form and try again.";
  }
});

if (requestSummary && confirmationStatus && finalizeRequest) {
  const savedRequest = getSavedRequest();
  let requestIsSubmitting = false;

  if (!savedRequest) {
    requestSummary.innerHTML = `
      <p>No saved reading request was found on this device. If you already paid, email
      <a href="mailto:goldenscorpiotarot@gmail.com">goldenscorpiotarot@gmail.com</a>
      with your Stripe receipt and reading details.</p>
    `;
    finalizeRequest.disabled = true;
    confirmationStatus.textContent = "There is no saved request to finalize.";
  } else {
    requestSummary.innerHTML = `
      <h2>You're booked for ${escapeHtml(savedRequest.reading)}</h2>
      <p><strong>Email:</strong> ${escapeHtml(savedRequest.email)}</p>
      <p><strong>Preferred name:</strong> ${escapeHtml(savedRequest.preferredName || "Not provided")}</p>
      <p><strong>Focus:</strong> ${escapeHtml(savedRequest.focus || "Not provided")}</p>
      <p><strong>Delivery:</strong> ${escapeHtml(savedRequest.delivery)}</p>
    `;

    function finalizeSavedRequest() {
      if (requestIsSubmitting) {
        return;
      }

      requestIsSubmitting = true;
      finalizeRequest.disabled = true;
      finalizeRequest.textContent = "Sending request...";
      confirmationStatus.textContent = "Sending your paid reading request...";

      submitSavedRequest(savedRequest)
        .then(() => {
          window.localStorage.removeItem(REQUEST_STORAGE_KEY);
          requestSummary.innerHTML = `
            <h2>Request confirmed</h2>
            <p>Your reading request has been sent to Golden Scorpio Tarot.</p>
            <p>Check your email for a confirmation. You should receive your reading by the end of day.</p>
          `;
          confirmationStatus.textContent = "Thank you. Your request is confirmed.";
          finalizeRequest.remove();
        })
        .catch((error) => {
          requestIsSubmitting = false;
          finalizeRequest.disabled = false;
          finalizeRequest.textContent = "Send reading request";
          confirmationStatus.textContent =
            error.message || "Something went wrong. Please try again.";
        });
    }

    finalizeRequest.addEventListener("click", finalizeSavedRequest);
    finalizeSavedRequest();
  }
}
