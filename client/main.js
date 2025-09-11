// --- DOM elements ---
// Form inputs, result container, report output area, and optional loader
const form = document.getElementById("form");
const result = document.getElementById("result");
const reportEl = document.getElementById("report");
const loadingEl = document.getElementById("loading");

// --- Typewriter effect ---
// Utility that simulates typing by printing characters one by one.
// Works seamlessly for both <textarea> (value) and <div>/<pre> (innerHTML).
function typeWriter(text, el, speed = 20) {
  const isTextArea = el.tagName === "TEXTAREA";

  // reset content before typing starts
  if (isTextArea) el.value = "";
  else el.innerHTML = "";

  let i = 0;
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (i < text.length) {
        if (isTextArea) el.value += text.charAt(i);
        else el.innerHTML += text.charAt(i);
        i++;
        el.scrollTop = el.scrollHeight; // keep content visible
      } else {
        clearInterval(interval);
        resolve(); // notify caller when finished
      }
    }, speed);
  });
}

// --- Form submission handler ---
// Collects form data, sends it to the backend API, 
// and displays the AI-generated report with typing animation.
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // extract user input
  const fd = new FormData(form);
  const data = {
    name: fd.get("name"),
    sizeSqm: Number(fd.get("sizeSqm")),
    seats: Number(fd.get("seats")),
    features: fd.getAll("features")
  };

  result.hidden = false;

  // clear previous report
  if (reportEl.tagName === "TEXTAREA") reportEl.value = "";
  else reportEl.innerHTML = "";

  // show loader if available
  loadingEl.hidden = false;

  try {
    // call backend endpoint
    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const json = await res.json();

    if (json.report) {
      await typeWriter(json.report, reportEl, 25);
      loadingEl.hidden = true; // hide loader after animation
    } else {
      loadingEl.hidden = true;
      if (reportEl.tagName === "TEXTAREA") reportEl.value = "שגיאה: לא התקבל דוח.";
      else reportEl.textContent = "שגיאה: לא התקבל דוח.";
    }
  } catch (err) {
    loadingEl.hidden = true;
    if (reportEl.tagName === "TEXTAREA") reportEl.value = "❌ שגיאת תקשורת עם השרת.";
    else reportEl.textContent = "❌ שגיאת תקשורת עם השרת.";
  }
});
