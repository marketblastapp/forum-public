async function loadMessages() {
  const res = await fetch("/api/messages");
  const messages = await res.json();

  const container = document.getElementById("messages");
  container.innerHTML = messages
    .map(
      m => `<p><strong>${m.username}</strong>: ${m.content}<br><small>${m.timestamp}</small></p>`
    )
    .join("");
}

async function sendMessage() {
  const username = document.getElementById("username").value || "Anonim";
  const content = document.getElementById("content").value;

  await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, content })
  });

  document.getElementById("content").value = "";
  loadMessages();
}

setInterval(loadMessages, 2000);
loadMessages();
