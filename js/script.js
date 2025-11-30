// js/script.js

// --- Typing Animation Script ---

const textArray = [
  "IT student",
  "Programmer",
  "Future ERP Consultant",
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


// --- Navigation Active State (Click Handler for All Nav Buttons) ---

/**
 * Handles clicks on both top navigation links (.nav-link) and bottom section buttons (.section-nav-btn).
 * It updates the active class on the main navigation bar and navigates without smooth scrolling.
 */
function handleAllNavClicks() {
    // Combine top links and bottom buttons into one collection
    const allNavButtons = document.querySelectorAll('.nav-link, .section-nav-btn');
    const topNavLinks = document.querySelectorAll('.nav-link');
    
    allNavButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default smooth scrolling behavior
            
            // Get the target hash from the href attribute
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // 1. Immediately jump to the target section (snaps, no smooth scroll)
                targetSection.scrollIntoView({ behavior: 'auto' });

                // 2. Update the active class in the TOP navigation bar
                
                // Determine the correct link in the top nav to activate
                let activeLinkToHighlight;
                
                if (this.classList.contains('nav-link')) {
                    // If the clicked element is already a top link, use it directly
                    activeLinkToHighlight = this;
                } else {
                    // If the clicked element is a bottom button, find the corresponding top link
                    activeLinkToHighlight = document.querySelector(`nav ul a[href="${targetId}"]`);
                }

                if (activeLinkToHighlight) {
                    // Remove active class from all top links
                    topNavLinks.forEach(l => l.classList.remove('nav-active'));
                    
                    // Add active class to the correct link
                    activeLinkToHighlight.classList.add('nav-active');
                }
            }
        });
    });
}

// Initialization on load
window.onload = function() {
    type();
    handleAllNavClicks();
    
    // Initial load state check: Highlights the link corresponding to the current URL hash
    const currentHash = window.location.hash || '#hero';
    const initialActiveLink = document.querySelector(`nav ul a[href="${currentHash}"]`);
    
    // Ensure that if the hash exists, it is set as active on load
    if (initialActiveLink) {
         document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('nav-active'));
         initialActiveLink.classList.add('nav-active');
    }
};
