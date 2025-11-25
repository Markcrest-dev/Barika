// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Gallery Pagination
const imagesPerPage = 9;
let currentPage = 1;
const totalImages = 83; // Total number of images in gallery_images folder
const totalPages = Math.ceil(totalImages / imagesPerPage);
let currentView = 'images'; // 'images' or 'videos'

// DOM elements
const galleryGrid = document.getElementById('gallery-grid');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const viewToggleBtn = document.getElementById('view-toggle-btn');

// Initialize gallery if we're on the collection page
if (galleryGrid) {
    renderGallery();
    setupPaginationControls();
    setupViewToggle();
}

function renderGallery() {
    // Clear the gallery
    galleryGrid.innerHTML = '';
    
    // Calculate start and end indices for current page
    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = Math.min(startIndex + imagesPerPage, totalImages);
    
    // Create gallery items for current page
    for (let i = startIndex + 1; i <= endIndex; i++) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = `gallery_images/image_${String(i).padStart(3, '0')}.jpg`;
        img.alt = `Gallery image ${i}`;
        img.className = 'gallery-image';
        
        galleryItem.appendChild(img);
        galleryGrid.appendChild(galleryItem);
    }
    
    // Update page info
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    // Update button states
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    
    // Add click listeners to new images
    setTimeout(addImageClickListeners, 0);
}

function setupPaginationControls() {
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderGallery();
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderGallery();
        }
    });
}

function setupViewToggle() {
    if (viewToggleBtn) {
        viewToggleBtn.addEventListener('click', () => {
            if (currentView === 'images') {
                currentView = 'videos';
                viewToggleBtn.textContent = 'View Images';
                // For now, we'll just show a placeholder message
                // In the future, this would load videos
                galleryGrid.innerHTML = `
                    <div class="video-placeholder">
                        <div class="placeholder-box">
                            <p>Video gallery coming soon!</p>
                            <p>Stay tuned for amazing content.</p>
                        </div>
                    </div>
                `;
                // Hide pagination controls when viewing videos
                document.querySelector('.pagination-controls').style.display = 'none';
            } else {
                currentView = 'images';
                viewToggleBtn.textContent = 'View Videos';
                // Show images again
                renderGallery();
                // Show pagination controls
                document.querySelector('.pagination-controls').style.display = 'flex';
            }
        });
    }
}

// Modal functionality
let currentImageIndex = 0;
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeModalBtn = document.querySelector('.close-modal');
const prevModalBtn = document.getElementById('prev-modal');
const nextModalBtn = document.getElementById('next-modal');

function openModal(index) {
    currentImageIndex = index;
    const imageNumber = (currentPage - 1) * imagesPerPage + index + 1;
    modalImage.src = `gallery_images/image_${String(imageNumber).padStart(3, '0')}.jpg`;
    modalImage.alt = `Gallery image ${imageNumber}`;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

function showPrevImage() {
    const startIndex = (currentPage - 1) * imagesPerPage;
    if (currentImageIndex > 0) {
        currentImageIndex--;
        const imageNumber = startIndex + currentImageIndex + 1;
        modalImage.src = `gallery_images/image_${String(imageNumber).padStart(3, '0')}.jpg`;
        modalImage.alt = `Gallery image ${imageNumber}`;
    }
}

function showNextImage() {
    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = Math.min(startIndex + imagesPerPage, totalImages);
    if (currentImageIndex < endIndex - startIndex - 1) {
        currentImageIndex++;
        const imageNumber = startIndex + currentImageIndex + 1;
        modalImage.src = `gallery_images/image_${String(imageNumber).padStart(3, '0')}.jpg`;
        modalImage.alt = `Gallery image ${imageNumber}`;
    }
}

// Event listeners for modal
if (modal) {
    // Close modal when clicking on close button
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal when pressing ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    // Navigation buttons
    prevModalBtn.addEventListener('click', showPrevImage);
    nextModalBtn.addEventListener('click', showNextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // In a real implementation, you would send this data to a server
        // For now, we'll just show an alert
        alert(`Thank you, ${name}! Your message has been received. I'll get back to you soon.`);
        
        // Reset form
        contactForm.reset();
    });
}

// Simple animation for elements when they come into view
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe elements with animation class
document.querySelectorAll('.gallery-item, .about-text, .contact-info, .contact-form').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    observer.observe(el);
});

// Observe gallery items for animation
galleryGrid && galleryGrid.addEventListener('DOMNodeInserted', (mutation) => {
    document.querySelectorAll('.gallery-item:not(.animated)').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add click event listeners to gallery images
function addImageClickListeners() {
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        const img = item.querySelector('.gallery-image');
        if (img) {
            img.addEventListener('click', () => {
                openModal(index);
            });
        }
    });
}

// Call this function after rendering gallery
galleryGrid && new MutationObserver(addImageClickListeners).observe(galleryGrid, { childList: true });

// Add animated class for fade-in effect
const style = document.createElement('style');
style.innerHTML = `
    .animated {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);