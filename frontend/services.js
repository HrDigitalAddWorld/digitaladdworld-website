// Arrow पर click → services.html open
document.querySelectorAll(".arrow-link").forEach(arrow => {
  arrow.addEventListener("click", (e) => {
    e.preventDefault(); // default 
    const url = arrow.getAttribute("data-url");
    window.location.href = url;
  });
});
