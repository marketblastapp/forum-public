// ===== Nama user tersimpan =====
const usernameInput = document.getElementById("username");
if(localStorage.getItem("username")) {
  usernameInput.value = localStorage.getItem("username");
}

// ===== Load & tampilkan pesan =====
async function loadMessages() {
  const res = await fetch("/api/messages");
  const messages = await res.json();
  const container = document.getElementById("messages");

  container.innerHTML = messages.map(m => {
    const isUser = (m.username || "Anonim") === usernameInput.value;
    const cls = isUser ? "user" : "other";

    // Emoji support (simple)
    const content = m.content.replace(/:\)/g,'😊').replace(/:\(/g,'😢');

    return `<p class="${cls}"><strong>${m.username}</strong>: ${content}<br><small>${m.timestamp}</small></p>`;
  }).join("");

  container.scrollTop = container.scrollHeight;
}

// ===== Kirim pesan =====
async function sendMessage() {
  const username = usernameInput.value || "Anonim";
  const content = document.getElementById("content").value;
  if(!content.trim()) return;

  localStorage.setItem("username", username);

  await fetch("/api/messages", {
    method:"POST",
    headers:{ "Content-Type": "application/json" },
    body: JSON.stringify({ username, content })
  });

  document.getElementById("content").value = "";
  loadMessages();
}

// ===== Reload otomatis =====
setInterval(loadMessages, 2000);
loadMessages();

// ===== Toggle Dark Mode =====
const toggleBtn = document.getElementById("toggle-theme");
if(localStorage.getItem("theme") === "dark") document.body.classList.add("dark");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});
