$(document).ready(function () {

    // ============================================
    // LOADING ANIMATION
    // ============================================
    setTimeout(function () {
        $('.loading-overlay').addClass('fade-out');
    }, 1500);

    // ============================================
    // SAKURA PETALS ANIMATION
    // ============================================
    function createSakuraPetals() {
        const container = $('#sakuraContainer');
        const petalCount = 10;

        container.empty();

        for (let i = 0; i < petalCount; i++) {
            const petal = $('<div class="petal"></div>');

            const size = Math.floor(Math.random() * 12) + 8;
            const left = Math.random() * 100;
            const animationDuration = (Math.random() * 7 + 5).toFixed(2);
            const animationDelay = (Math.random() * 4).toFixed(2);
            const rotateStart = Math.random() * 360;
            const opacity = (Math.random() * 0.5 + 0.2).toFixed(2);

            // Purple shades
            const hue = Math.floor(Math.random() * 60 + 260);
            const saturation = Math.floor(Math.random() * 30 + 60);
            const lightness = Math.floor(Math.random() * 30 + 60);

            petal.css({
                'width': size + 'px',
                'height': size * 0.8 + 'px',
                'left': left + '%',
                'animation-duration': animationDuration + 's',
                'animation-delay': animationDelay + 's',
                'transform': `rotate(${rotateStart}deg)`,
                'background': `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`,
                'box-shadow': `0 5px 10px rgba(94, 58, 107, 0.2)`
            });

            container.append(petal);
        }
    }

    createSakuraPetals();

    $(window).on('resize', function () {
        createSakuraPetals();
    });

    // ============================================
    // MUSIC PLAYER - AUTO PLAY ON PAGE LOAD
    // ============================================
    const music = document.getElementById('weddingMusic');
    const $musicToggle = $('#musicToggle');
    const $unmuteIcon = $('#unmuteIcon');
    const $muteIcon = $('#muteIcon');

    // Preload and attempt to autoplay
    music.load();

    // Function to play music
    function playMusic() {
        music.play()
            .then(() => {
                console.log("Music playing automatically");
                $unmuteIcon.hide();
                $muteIcon.show();
                $musicToggle.addClass('playing');
            })
            .catch(error => {
                console.log("Auto-play failed:", error);
                // If autoplay fails, show unmute icon and wait for user interaction
                $unmuteIcon.show();
                $muteIcon.hide();
            });
    }

    // Function to pause/mute music
    function pauseMusic() {
        music.pause();
        $unmuteIcon.show();
        $muteIcon.hide();
        $musicToggle.removeClass('playing');
    }

    // Attempt to autoplay when page loads
    $(window).on('load', function () {
        setTimeout(function () {
            playMusic();
        }, 1000); // Small delay to ensure DOM is ready
    });

    // Also try to play on first user interaction as fallback
    $(document).one('click touchstart', function () {
        if (music.paused) {
            playMusic();
        }
    });

    // Toggle music on button click
    $musicToggle.on('click', function (e) {
        e.stopPropagation();
        if (music.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    });

    // Handle music ended
    music.addEventListener('ended', function () {
        $unmuteIcon.show();
        $muteIcon.hide();
        $musicToggle.removeClass('playing');
    });

    // ============================================
    // COUNTDOWN TIMER
    // ============================================
    function updateCountdown() {
        const weddingDate = new Date('June 17, 2026 06:00:00').getTime();
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const $days = $('#days');
        const $hours = $('#hours');
        const $minutes = $('#minutes');
        const $seconds = $('#seconds');

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            updateNumber($days, days);
            updateNumber($hours, hours);
            updateNumber($minutes, minutes);
            updateNumber($seconds, seconds);
        } else {
            $('.countdown-container').html(`
                <div class="wedding-day-message">
                    <i class="fas fa-heart"></i>
                    <h3>Today is the day!</h3>
                    <p>We can't wait to celebrate with you!</p>
                </div>
            `);
        }
    }

    function updateNumber($element, newValue) {
        const currentValue = parseInt($element.text());
        if (currentValue !== newValue) {
            $element.css('transform', 'scale(1.2)');
            setTimeout(() => {
                $element.text(newValue.toString().padStart(2, '0'));
                $element.css('transform', 'scale(1)');
            }, 150);
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ============================================
    // DOWNLOAD INVITATION
    // ============================================
    $('#downloadInvite').on('click', function (e) {
        e.preventDefault();

        fetch("../assets/invitation.jpeg")
            .then(response => response.blob())
            .then(data => {
                const blob = new Blob([data], { type: "image/jpeg" });
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = "invitation.jpeg";
                a.click();

                URL.revokeObjectURL(url);
            })
            .catch(error => console.error("Error:", error));

        alert('✨ Invitation downloaded successfully! ✨');
    });

    // ============================================
    // ADD TO CALENDAR
    // ============================================
    $('#addToCalendar').on('click', function (e) {
        e.preventDefault();

        const event = {
            title: "Yogeshwaran & Manjuladevi's Wedding",
            description: "Join us in celebrating the wedding of Yogeshwaran and Manjuladevi!.",

        };

        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${event.startDate}/${event.endDate}`;

        window.open(googleCalendarUrl, '_blank');
    });

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    $('a[href*="#"]').on('click', function (e) {
        if (this.hash !== '' && this.hash !== '#') {
            e.preventDefault();

            const hash = this.hash;
            const target = $(hash);

            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 50
                }, 800, 'swing');
            }
        }
    });

    // ============================================
    // CONSOLE WELCOME MESSAGE
    // ============================================
    console.log('%c💍 Sarah & Michael 💍', 'font-size: 24px; color: #9b6b9e; font-weight: bold; font-family: "Great Vibes", cursive;');
    console.log('%cJune 15, 2024 | 5:30 PM', 'font-size: 16px; color: #5e3a6b;');
    console.log('%cGrand Garden, Chicago', 'font-size: 14px; color: #7a6a7d;');
    console.log('%c🎵 Music is playing automatically!', 'font-size: 14px; color: #9b6b9e; font-style: italic;');

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    function checkScroll() {
        const windowHeight = $(window).height();
        const scrollTop = $(window).scrollTop();

        $('.countdown-item, .detail-item, .btn, .contact-card, .social-link, .map-container').each(function () {
            const elementTop = $(this).offset().top;

            if (scrollTop + windowHeight > elementTop + 100) {
                $(this).css({
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }
        });
    }

    $('.countdown-item, .detail-item, .btn, .contact-card, .social-link, .map-container').css({
        'opacity': '0',
        'transform': 'translateY(30px)',
        'transition': 'all 0.6s ease'
    });

    $(window).on('scroll', function () {
        checkScroll();
    });

    setTimeout(checkScroll, 500);

    // ============================================
    // TOUCH DEVICE HANDLING
    // ============================================
    if ('ontouchstart' in window) {
        $('.detail-item, .btn, .contact-card, .social-link').on('touchstart', function () {
            $(this).addClass('touch-active');
        }).on('touchend', function () {
            $(this).removeClass('touch-active');
        });
    }
});

function topOpen() {
    let door1 = document.getElementsByClassName("door1")[0]
    let door2 = document.getElementsByClassName("door2")[0]
    document.getElementsByClassName("door-button")[0].style.display="none"
    door1.style.animation = "door1 2s linear 1"
    door2.style.animation = "door2 2s linear 1"
    document.getElementsByClassName("body")[0].style.display="flex"
   setTimeout(() => {
     door1.style.display="none"
    door2.style.display="none"
   }, 2000);
}