// js/script.js

// Initialize AOS (Animate On Scroll) library
AOS.init();

// --- Typing Animation Script ---

// The array of texts to be typed
const textArray = [
  "IT student",
  "Programmer",
];

const typingElement = document.getElementById('typing-text');
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80; // Faster typing (was 100)
let deletingSpeed = 40; // Faster deleting (was 50)
let delayBeforeNext = 1500; // Delay before starting the next action (ms)

function type() {
  const currentText = textArray[textIndex];
  
  if (isDeleting) {
    // DELETE mode
    typingElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
    
    if (charIndex === 0) {
      isDeleting = false;
      // Move to the next string in the array
      textIndex = (textIndex + 1) % textArray.length;
      setTimeout(type, 500); // Pause before starting to type the next phrase
    } else {
      setTimeout(type, deletingSpeed);
    }

  } else {
    // TYPE mode
    typingElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
    
    if (charIndex === currentText.length) {
      isDeleting = true;
      setTimeout(type, delayBeforeNext); // Pause before starting to delete
    } else {
      setTimeout(type, typingSpeed);
    }
  }
}

// Start the typing animation after a small delay on page load
setTimeout(type, 1000);