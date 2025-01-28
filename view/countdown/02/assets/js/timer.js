const countDownDate = new Date("jan 28, 2025 23:59:00").getTime();

setInterval(() => {
  const now = new Date().getTime();
  const distance = countDownDate - now;
  
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  document.getElementById("timer").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s `;
  
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer").innerHTML = "2025";
    window.location.href = `hny/${wishData.id}`;
  }
}, 1000);

