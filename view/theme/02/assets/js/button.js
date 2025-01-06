function toggleWishes() {
  const wishesSection = document.querySelector('.new-year-wishes');
  const button = document.querySelector('.show-wishes-btn');

    // Fancy exit for button
  button.style.transform = 'scale(1)';
  button.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  button.style.opacity = '0';
  button.style.transform = 'scale(0.2) rotate(180deg)';
  button.style.display = 'none';
  // setTimeout(() => {
  // }, 800);

  var mySong = document.getElementById("song")
      if (mySong.paused) {
        mySong.play()
    }
  // Add fancy entrance animation
  wishesSection.style.opacity = '0';
  wishesSection.style.display = 'block';
  wishesSection.style.transform = 'scale(0.5) rotate(-10deg)';
  wishesSection.style.transition = 'all 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  
  // Trigger animations
  setTimeout(() => {
    wishesSection.style.opacity = '1';
    wishesSection.style.transform = 'scale(1) rotate(0)';
  }, 100);

  // Add sparkle effect
  const sparkles = 15;
  for (let i = 0; i < sparkles; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.cssText = `
      position: absolute;
      width: 10px;
      height: 10px;
      background: #fff;
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: sparkleAnim 1s ease-out forwards;
      opacity: 0;
    `;
    wishesSection.appendChild(sparkle);
  }
}

// Add sparkle animation
const style = document.createElement('style');
style.textContent = `
  @keyframes sparkleAnim {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: scale(1.5) rotate(180deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Enhanced button entrance
document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.show-wishes-btn');
  if (button) {
    button.style.opacity = '0';
    button.style.display = 'none';
    button.style.transform = 'scale(0.5) translateY(20px)';
    
    setTimeout(() => {
      button.style.display = 'block';
      button.style.transition = 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => {
        button.style.opacity = '1';
        button.style.transform = 'scale(1) translateY(0)';
      }, 100);
    }, 5000);
  }
});