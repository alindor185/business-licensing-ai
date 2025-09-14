const form = document.getElementById("form");
const result = document.getElementById("result");
const reportEl = document.getElementById("report");
const loadingEl = document.getElementById("loading");

// Typing effect for displaying the report smoothly
function typeWriter(text, el, speed = 20) {
  const isTextArea = el.tagName === "TEXTAREA";
  if (isTextArea) el.value = "";
  else el.innerHTML = "";

  let i = 0;
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (i < text.length) {
        if (isTextArea) el.value += text.charAt(i);
        else el.innerHTML += text.charAt(i);
        i++;
        el.scrollTop = el.scrollHeight;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fd = new FormData(form);
  const data = {
    name: fd.get("name"),
    sizeSqm: Number(fd.get("sizeSqm")),
    seats: Number(fd.get("seats")),
    features: fd.getAll("features")
  };

  result.hidden = false;
  reportEl.textContent = "";
  loadingEl.hidden = false;   

  try {
    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error(`Server responded with ${res.status}`);

    const json = await res.json();

    if (json.report) {
      loadingEl.hidden = true;      
      await typeWriter(json.report, reportEl, 25);
    } else {
      loadingEl.hidden = true;
      reportEl.textContent = "Error: No report received.";
    }
  } catch (err) {
    console.error("Error while fetching report:", err);
    loadingEl.hidden = true;
    reportEl.textContent = "Error: Failed to connect to server.";
  }
});
