// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Beat Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const beatCards = document.querySelectorAll('.beat-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        beatCards.forEach(card => {
            if (filterValue === 'all') {
                card.classList.remove('hidden');
            } else {
                const cardCategory = card.getAttribute('data-category');
                if (cardCategory === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            }
        });
    });
});

// Play Button Functionality
const playButtons = document.querySelectorAll('.play-btn');
const hitPlayButtons = document.querySelectorAll('.hit-card .play-button');

// Sample playback timer functionality
let sampleTimers = {};

// Simulate audio playback for beat cards (30 second samples)
playButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const beatCard = button.closest('.beat-card');
        const waveform = beatCard.querySelector('.beat-waveform');
        const timerElement = beatCard.querySelector('.sample-timer');
        const isPlaying = beatCard.classList.contains('playing');
        
        if (isPlaying) {
            // Stop playing
            beatCard.classList.remove('playing');
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
            waveform.style.animationPlayState = 'paused';
            
            // Clear timer
            if (sampleTimers[beatCard.id || beatCard]) {
                clearInterval(sampleTimers[beatCard.id || beatCard]);
                delete sampleTimers[beatCard.id || beatCard];
            }
            
            if (timerElement) {
                timerElement.textContent = '0:30';
            }
        } else {
            // Start playing
            // Stop all other beats
            document.querySelectorAll('.beat-card').forEach(card => {
                card.classList.remove('playing');
                const otherWaveform = card.querySelector('.beat-waveform');
                const otherTimer = card.querySelector('.sample-timer');
                if (otherWaveform) {
                    otherWaveform.style.animationPlayState = 'paused';
                }
                if (otherTimer) {
                    otherTimer.textContent = '0:30';
                }
                
                // Clear other timers
                if (sampleTimers[card.id || card]) {
                    clearInterval(sampleTimers[card.id || card]);
                    delete sampleTimers[card.id || card];
                }
            });
            
            beatCard.classList.add('playing');
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
            `;
            waveform.style.animationPlayState = 'running';
            
            // Start sample timer (30 seconds)
            if (timerElement) {
                let seconds = 30;
                timerElement.textContent = `0:${seconds.toString().padStart(2, '0')}`;
                
                const timerId = setInterval(() => {
                    seconds--;
                    if (seconds < 0) {
                        // Auto-stop after 30 seconds
                        clearInterval(timerId);
                        beatCard.classList.remove('playing');
                        button.innerHTML = `
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        `;
                        waveform.style.animationPlayState = 'paused';
                        timerElement.textContent = '0:30';
                        delete sampleTimers[beatCard.id || beatCard];
                    } else {
                        const mins = Math.floor(seconds / 60);
                        const secs = seconds % 60;
                        timerElement.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
                    }
                }, 1000);
                
                sampleTimers[beatCard.id || beatCard] = timerId;
            }
        }
    });
});

// Hit card play button - opens Spotify
hitPlayButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const hitCard = button.closest('.hit-card');
        const spotifyLink = hitCard.querySelector('.spotify-link');
        if (spotifyLink) {
            // Open Spotify link in new tab
            window.open(spotifyLink.href, '_blank');
        } else {
            // Fallback if no Spotify link
            alert('Click the "Listen on Spotify" button below to play the full track!');
        }
    });
});

// Add to Cart Functionality
const buyButtons = document.querySelectorAll('.btn-buy');

buyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const beatCard = button.closest('.beat-card');
        const beatName = beatCard.querySelector('h3').textContent;
        const beatPrice = beatCard.querySelector('.beat-price').textContent;
        
        // In a real implementation, this would add to a shopping cart
        button.textContent = 'Added to Cart!';
        button.style.background = 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)';
        
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }, 2000);
        
        // Show notification
        showNotification(`${beatName} added to cart!`);
    });
});

// Notification Function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'error' 
        ? 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
        max-width: 400px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Booking Form Handling
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
    // Calculate price based on duration and services
    function calculatePrice() {
        const duration = parseInt(document.getElementById('sessionDuration')?.value) || 0;
        const serviceCheckboxes = bookingForm.querySelectorAll('input[name="service"]:checked');
        const priceDisplay = document.getElementById('priceDisplay');
        const totalPriceElement = document.getElementById('totalPrice');
        
        if (duration === 0 || serviceCheckboxes.length === 0) {
            priceDisplay.style.display = 'none';
            return;
        }
        
        let totalPrice = 0;
        serviceCheckboxes.forEach(checkbox => {
            const servicePrice = parseFloat(checkbox.dataset.price) || 0;
            totalPrice += servicePrice * duration;
        });
        
        // Apply discount for full day (8 hours)
        if (duration === 8) {
            totalPrice = totalPrice * 0.85; // 15% discount for full day
        }
        
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        priceDisplay.style.display = 'block';
    }
    
    // Add event listeners for price calculation
    const durationSelect = document.getElementById('sessionDuration');
    const serviceCheckboxes = bookingForm.querySelectorAll('input[name="service"]');
    
    if (durationSelect) {
        durationSelect.addEventListener('change', calculatePrice);
    }
    
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculatePrice);
    });
    
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(bookingForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const date = formData.get('date');
        const duration = formData.get('duration');
        const services = formData.getAll('service');
        const notes = formData.get('notes');
        
        if (services.length === 0) {
            showNotification('Please select at least one service type!', 'error');
            return;
        }
        
        if (!duration) {
            showNotification('Please select a session duration!', 'error');
            return;
        }
        
        // Calculate final price
        let totalPrice = 0;
        const durationHours = parseInt(duration);
        services.forEach(serviceValue => {
            const checkbox = bookingForm.querySelector(`input[name="service"][value="${serviceValue}"]`);
            if (checkbox) {
                const servicePrice = parseFloat(checkbox.dataset.price) || 0;
                totalPrice += servicePrice * durationHours;
            }
        });
        
        if (durationHours === 8) {
            totalPrice = totalPrice * 0.85; // 15% discount for full day
        }
        
        // In a real implementation, this would send the data to a server
        const durationText = duration === '2' ? '2 Hours' : duration === '4' ? '4 Hours' : 'Full Day (8 Hours)';
        const serviceNames = services.map(s => {
            const labels = {
                'has-beats': 'I already have beats',
                'vocals-only': 'Vocals only',
                'all': 'All (Full Production)',
                'mastering': 'Mastering the Mix'
            };
            return labels[s] || s;
        }).join(', ');
        
        showNotification(`Session booking request sent! ${durationText} session on ${date} for ${serviceNames}. Estimated total: $${totalPrice.toFixed(2)}. We'll confirm via email.`);
        bookingForm.reset();
        document.getElementById('priceDisplay').style.display = 'none';
    });
}

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // In a real implementation, this would send the data to a server
        showNotification('Message sent successfully! We\'ll get back to you soon.');
        contactForm.reset();
    });
}

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.hit-card, .beat-card, .contact-item, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const vinyl = hero.querySelector('.vinyl-record');
        if (vinyl) {
            vinyl.style.transform = `translate(-50%, -50%) rotate(${scrolled * 0.5}deg)`;
        }
    }
});

// Active Navigation Link Highlighting
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Add active link styling
const activeLinkStyle = document.createElement('style');
activeLinkStyle.textContent = `
    .nav-menu a.active {
        color: var(--primary-color);
    }
    .nav-menu a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(activeLinkStyle);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set initial navbar state
    const navbar = document.querySelector('.navbar');
    navbar.style.transition = 'background 0.3s ease';
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Add stagger animation to floating icons
    const floatingIcons = document.querySelectorAll('.floating-icon');
    floatingIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Enhanced scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const enhancedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        enhancedObserver.observe(section);
    });
    
    // Load posters when page loads
    loadPosters();
    
    // Also reload posters periodically in case they were updated
    setInterval(() => {
        loadPosters();
    }, 2000);
});

// Load and display listening party posters
async function loadPosters() {
    const postersGrid = document.getElementById('postersGrid');
    if (!postersGrid) return;
    
    let posters = [];
    
    // Try API first
    try {
        if (window.api && window.api.posters) {
            posters = await window.api.posters.getAll();
        }
    } catch (error) {
        console.log('API fetch failed, using localStorage:', error);
        // Fallback to localStorage
        posters = JSON.parse(localStorage.getItem('listeningPartyPosters') || '[]');
    }
    
    if (posters.length === 0) {
        postersGrid.innerHTML = `
            <div class="poster-placeholder">
                <div class="poster-icon">📅</div>
                <p>Posters will be displayed here</p>
                <p class="poster-note">14 Tugi will upload event posters for upcoming listening parties</p>
            </div>
        `;
        return;
    }
    
    postersGrid.innerHTML = '';
    posters.forEach(poster => {
        const posterCard = document.createElement('div');
        posterCard.className = 'poster-card';
        
        // Handle image URL (could be base64, relative path, or full URL)
        let imageSrc = poster.posterImage;
        if (poster.posterImage && !poster.posterImage.startsWith('data:') && !poster.posterImage.startsWith('http')) {
            // If it's a relative path, prepend API base URL
            imageSrc = (window.API_BASE_URL?.replace('/api', '') || '') + poster.posterImage;
        }
        
        const posterId = poster._id || poster.id;
        posterCard.innerHTML = `
            <img src="${imageSrc}" alt="${poster.title}" class="poster-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23333%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2214%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3ENo Image%3C/text%3E%3C/svg%3E';">
            <div class="poster-info">
                <h4>${poster.title}</h4>
                <p><strong>Date:</strong> ${new Date(poster.date).toLocaleDateString()}</p>
                ${poster.time ? `<p><strong>Time:</strong> ${poster.time}</p>` : ''}
                ${poster.venue ? `<p><strong>Venue:</strong> ${poster.venue}</p>` : ''}
                <p><strong>Price:</strong> KES ${poster.ticketPrice.toLocaleString()}</p>
                <button class="btn btn-primary buy-ticket-btn" data-poster-id="${posterId}">Buy Ticket</button>
            </div>
        `;
        postersGrid.appendChild(posterCard);
    });
    
    // Add event listeners to buy ticket buttons
    document.querySelectorAll('.buy-ticket-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const posterId = e.target.dataset.posterId;
            const poster = posters.find(p => (p._id || p.id) === posterId);
            if (poster) {
                window.location.href = `ticket-purchase.html?id=${posterId}`;
            }
        });
    });
}

// Reload posters when window gains focus (in case new ones were added in another tab)
window.addEventListener('focus', () => {
    loadPosters();
});

