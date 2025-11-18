const usernameInput = document.getElementById("username");
const contentInput = document.getElementById("content");

// Simpan username di localStorage
if(localStorage.getItem("username")) usernameInput.value = localStorage.getItem("username");

// ===== Emoji =====
const emojiBtn = document.getElementById("emoji-btn");
const emojiPicker = document.getElementById("emoji-picker");
const emojis = ["😊","😂","❤️","👍","😢","😎","🔥","🎉","🥳","💡"];

emojis.forEach(e => {
  const span = document.createElement("span");
  span.textContent = e;
  span.onclick = () => {
    contentInput.value += e;
    emojiPicker.classList.remove("show");
  };
  emojiPicker.appendChild(span);
});

emojiBtn.addEventListener("click", () => {
  emojiPicker.classList.toggle("show");
});

// ===== Load & tampilkan pesan =====
async function loadMessages() {
  const res = await fetch("/api/messages");
  const messages = await res.json();
  const container = document.getElementById("messages");

  container.innerHTML = messages.map((m,index) => {
    const isUser = (m.username || "Anonim") === usernameInput.value;
    const cls = isUser ? "user" : "other";

    // Reaksi default
    const reactions = ["❤️","😂","👍"];
    const reactionsHTML = reactions.map(r => `<span onclick="addReaction(${index},'${r}')">${r}</span>`).join("");

    // Emoji sudah ada di content
    return `<p class="${cls}" id="msg-${index}"><strong>${m.username}</strong>: ${m.content}<br><small>${m.timestamp}</small>
      <div class="message-reactions">${reactionsHTML}</div>
    </p>`;
  }).join("");

  container.scrollTop = container.scrollHeight;
}

// ===== Kirim pesan =====
async function sendMessage() {
  const username = usernameInput.value || "Anonim";
  const content = contentInput.value;
  if(!content.trim()) return;

  localStorage.setItem("username", username);

  await fetch("/api/messages", {
    method:"POST",
    headers:{ "Content-Type": "application/json" },
    body: JSON.stringify({ username, content })
  });

  contentInput.value = "";
  loadMessages();
}

// ===== Reactions =====
window.addReaction = function(index, emoji){
  const msgEl = document.getElementById(`msg-${index}`);
  if(!msgEl) return;
  // Tambahkan emoji di akhir
  msgEl.querySelector(".message-reactions").innerHTML += ` <span>${emoji}</span>`;
};

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
