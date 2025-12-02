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


// --- Image Magnification Lens Functions ---

/* Function from the provided image to calculate cursor position relative to an element */
function getCursorPos(element, e) {
    e = e || window.event;
    let rect = element.getBoundingClientRect();
    
    // Calculate X and Y coordinates of the cursor relative to the element
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    // Return the cursor's position
    return { x: x, y: y };
}

/* Function to create and manage the magnifying lens */
function magnify(imgID, zoom) {
    let img = document.getElementById(imgID);
    let container = img.parentElement;
    let glass = container.querySelector(".magnify-glass");
    
    // Ensure elements exist
    if (!img || !glass) return;

    /* Calculate dimensions and offsets */
    let w = img.offsetWidth;
    let h = img.offsetHeight;
    let lens_size = 150; // Size defined in CSS

    /* Set the background size of the lens to the zoom factor of the image */
    glass.style.backgroundSize = (w * zoom) + "px " + (h * zoom) + "px";
    
    /* Function to move the lens */
    function moveMagnifier(e) {
        let pos = getCursorPos(img, e);
        let x = pos.x;
        let y = pos.y;

        /* Prevent the lens from running out of the image borders (based on the magnified image size) */
        // x must be > lens_size/zoom and < w - lens_size/zoom
        let limitX_max = w - (lens_size / zoom);
        let limitX_min = lens_size / zoom;
        let limitY_max = h - (lens_size / zoom);
        let limitY_min = lens_size / zoom;

        if (x > limitX_max) {x = limitX_max;}
        if (x < limitX_min) {x = limitX_min;}
        if (y > limitY_max) {y = limitY_max;}
        if (y < limitY_min) {y = limitY_min;}

        /* Set the position of the lens element (offset by half its size) */
        glass.style.left = (x - lens_size / 2) + "px";
        glass.style.top = (y - lens_size / 2) + "px";

        /* Display what the lens is magnifying by setting the background position */
        // We invert the position and multiply by zoom
        glass.style.backgroundPosition = "-" + ((x * zoom) - lens_size / 2) + "px -" + ((y * zoom) - lens_size / 2) + "px";
    }

    /* Set up events on the container (where the cursor moves) */
    container.addEventListener("mousemove", moveMagnifier);
    
    container.addEventListener("mouseenter", function() {
        // Show the lens and set the background image URL
        glass.style.opacity = 1;
        glass.style.backgroundImage = "url('" + img.src + "')";
    });
    
    container.addEventListener("mouseleave", function() {
        // Hide the lens
        glass.style.opacity = 0;
    });
}


// Initialization on load
window.onload = function() {
    type();
    handleAllNavClicks();
    
    // --- Initialize Magnifier on Batchmate Photo ---
    const batchmateImg = document.getElementById('batchmate-img');
    if (batchmateImg) {
        // Set zoom level (e.g., 2.5x zoom)
        magnify('batchmate-img', 2.5); 
    }
    
    // Initial load state check: Highlights the link corresponding to the current URL hash
    const currentHash = window.location.hash || '#hero';
    const initialActiveLink = document.querySelector(`nav ul a[href="${currentHash}"]`);
    
    // Ensure that if the hash exists, it is set as active on load
    if (initialActiveLink) {
         document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('nav-active'));
         initialActiveLink.classList.add('nav-active');
    }
};
