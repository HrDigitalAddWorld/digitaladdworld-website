function toggleReadMore(id, btn) {
  const content = document.getElementById(id);
  if (content.style.display === "block") {
    content.style.display = "none";
    btn.innerText = "Read More";
    btn.style.color = "#007BFF";
  } else {
    content.style.display = "block";
    btn.innerText = "Read Less";
    btn.style.color = "#28a745";
  }
}
