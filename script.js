/**
 * Maithili Vivah (मिथिला विवाह) - Interactive Script
 * Madhav & Janki Wedding Celebration
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================================
       0. KOHBAR ENVELOPE UNBOXING
       ============================================================== */
    const envelopeOverlay = document.getElementById('envelopeOverlay');
    const envelope = document.getElementById('envelope');
    const waxSeal = document.getElementById('waxSeal');
    const skipEnvelopeBtn = document.getElementById('skipEnvelopeBtn');
    let envelopeOpened = false;

    function openEnvelope() {
        if (envelopeOpened) return;
        envelopeOpened = true;

        envelope.classList.add('opened');

        setTimeout(() => {
            if (!isPlaying) {
                toggleMusic();
            }
        }, 500);

        setTimeout(() => {
            envelopeOverlay.classList.add('hide-envelope');
        }, 1300);
    }

    if (waxSeal) waxSeal.addEventListener('click', openEnvelope);
    if (skipEnvelopeBtn) {
        skipEnvelopeBtn.addEventListener('click', () => {
            if (envelopeOverlay) {
                envelopeOverlay.classList.add('hide-envelope');
                if (!isPlaying) toggleMusic();
            }
        });
    }


    /* ==============================================================
       1. LIVE COUNTDOWN TIMER
       ============================================================== */
    // Monday, 22 February 2027 19:30:00
    const weddingDate = new Date('February 22, 2027 19:30:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = weddingDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            daysEl.textContent = String(days).padStart(2, '0');
            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');
        } else {
            document.getElementById('timerGrid').innerHTML = `
                <div style="font-size: 1.4rem; color: #fff4cc; font-weight: bold; padding: 10px; font-family:'Rozha One',serif;">
                    🪷 मांगलिक विवाह उत्सव प्रारंभ भऽ गेल! 🪷
                </div>
            `;
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);


    /* ==============================================================
       2. MAITHILI FOLK MUSIC (Sitar/Bansuri Web Audio Fallback)
       ============================================================== */
    const musicToggle = document.getElementById('musicToggle');
    const bgAudio = document.getElementById('bgMusic');
    let isPlaying = false;
    let audioCtx = null;
    let synthInterval = null;

    // Raag Bhupali / Yaman traditional meditative notes
    function startMaithiliDroneSynth() {
        if (!window.AudioContext && !window.webkitAudioContext) return;
        if (!audioCtx || audioCtx.state === 'closed') {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const notes = [220, 247.5, 277.2, 330, 370, 440];
        let step = 0;

        synthInterval = setInterval(() => {
            if (!isPlaying || !audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(notes[step % notes.length], audioCtx.currentTime);

            gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.8);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.8);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 2.9);
            step++;
        }, 1300);
    }

    function toggleMusic() {
        if (!isPlaying) {
            bgAudio.volume = 0.8;
            const playPromise = bgAudio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                    updateMusicButtonState(true);
                }).catch((err) => {
                    console.log("Audio file play prevented, using Web Audio synthesizer:", err);
                    isPlaying = true;
                    startMaithiliDroneSynth();
                    updateMusicButtonState(true);
                });
            } else {
                isPlaying = true;
                updateMusicButtonState(true);
            }
        } else {
            bgAudio.pause();
            if (synthInterval) clearInterval(synthInterval);
            if (audioCtx) {
                audioCtx.close();
                audioCtx = null;
            }
            isPlaying = false;
            updateMusicButtonState(false);
        }
    }

    function updateMusicButtonState(playing) {
        if (playing) {
            musicToggle.classList.add('active');
            musicToggle.innerHTML = `<i class="fas fa-volume-up"></i><span class="btn-label">गीत चालू</span>`;
        } else {
            musicToggle.classList.remove('active');
            musicToggle.innerHTML = `<i class="fas fa-music"></i><span class="btn-label">राग-गीत</span>`;
        }
    }

    musicToggle.addEventListener('click', toggleMusic);


    /* ==============================================================
       3. LOTUS & MARIGOLD PETALS & STARDUST PARTICLES
       ============================================================== */
    const canvas = document.getElementById('petalCanvas');
    const ctx = canvas.getContext('2d');
    let petalsEnabled = true;
    let petals = [];
    let sparkles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class MithilaPetal {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20 - Math.random() * 50;
            this.size = Math.random() * 12 + 8;
            this.speedY = Math.random() * 1.5 + 0.8;
            this.speedX = (Math.random() - 0.5) * 1.2;
            this.angle = Math.random() * Math.PI * 2;
            this.angleSpeed = (Math.random() - 0.5) * 0.04;
            // Terracotta red, pink lotus, or mustard yellow
            const r = Math.random();
            if (r > 0.6) {
                this.color = `rgba(180, 40, 30, ${0.6 + Math.random() * 0.3})`;
            } else if (r > 0.3) {
                this.color = `rgba(240, 175, 45, ${0.7 + Math.random() * 0.3})`;
            } else {
                this.color = `rgba(235, 120, 150, ${0.6 + Math.random() * 0.3})`; // Lotus pink
            }
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.angle) * 1.2 + this.speedX;
            this.angle += this.angleSpeed;

            if (this.y > canvas.height + 30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
            ctx.fill();

            ctx.restore();
        }
    }

    for (let i = 0; i < 26; i++) {
        petals.push(new MithilaPetal());
    }

    class Sparkle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 2;
            this.speedX = (Math.random() - 0.5) * 1.6;
            this.speedY = (Math.random() - 0.5) * 1.6 - 0.4;
            this.opacity = 1;
            this.fadeRate = Math.random() * 0.035 + 0.02;
            this.color = Math.random() > 0.3 ? '#ffe680' : '#ffffff';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= this.fadeRate;
        }

        draw() {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#f9e79f';

            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.size);
            ctx.lineTo(this.x + this.size * 0.3, this.y);
            ctx.lineTo(this.x, this.y + this.size);
            ctx.lineTo(this.x - this.size * 0.3, this.y);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    }

    window.addEventListener('pointermove', (e) => {
        for (let i = 0; i < 2; i++) {
            sparkles.push(new Sparkle(e.clientX + (Math.random() - 0.5) * 8, e.clientY + (Math.random() - 0.5) * 8));
        }
        if (sparkles.length > 50) {
            sparkles.splice(0, sparkles.length - 50);
        }
    });

    const petalToggle = document.getElementById('petalToggle');
    if (petalToggle) {
        petalToggle.addEventListener('click', () => {
            petalsEnabled = !petalsEnabled;
            if (!petalsEnabled) {
                petalToggle.classList.remove('active');
                petalToggle.innerHTML = `<i class="fas fa-eye-slash"></i><span class="btn-label">पुष्प बंद</span>`;
            } else {
                petalToggle.classList.add('active');
                petalToggle.innerHTML = `<i class="fas fa-spa"></i><span class="btn-label">पुष्प वर्षा</span>`;
            }
        });
    }


    /* ==============================================================
       4. FIREWORKS & CONFETTI ENGINE
       ============================================================== */
    const celebrationColors = ['#e5a93c', '#b03a2e', '#ff5722', '#194d33', '#fdf2e9', '#ffe680'];

    class FireworkSpark {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 1.5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.gravity = 0.08;
            this.friction = 0.96;
            this.opacity = 1;
            this.fade = Math.random() * 0.02 + 0.015;
            this.size = Math.random() * 3 + 1.5;
        }

        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.opacity -= this.fade;
        }

        draw() {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class FireworkRocket {
        constructor() {
            this.x = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
            this.y = canvas.height;
            this.targetY = Math.random() * (canvas.height * 0.45) + canvas.height * 0.12;
            this.speed = Math.random() * 4 + 7;
            this.color = celebrationColors[Math.floor(Math.random() * celebrationColors.length)];
            this.exploded = false;
        }

        update() {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.explode();
            }
        }

        explode() {
            this.exploded = true;
            for (let i = 0; i < 45; i++) {
                fireworkSparks.push(new FireworkSpark(this.x, this.y, this.color));
            }
        }

        draw() {
            if (this.exploded) return;
            ctx.save();
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fillRect(this.x - 1.5, this.y, 3, 10);
            ctx.restore();
        }
    }

    class CelebrationConfetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -10 - Math.random() * 20;
            this.sizeW = Math.random() * 8 + 6;
            this.sizeH = Math.random() * 5 + 4;
            this.color = celebrationColors[Math.floor(Math.random() * celebrationColors.length)];
            this.vx = (Math.random() - 0.5) * 3;
            this.vy = Math.random() * 2.5 + 2;
            this.rot = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 8;
            this.opacity = 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rot += this.rotSpeed;
            if (this.y > canvas.height + 20) {
                this.opacity = 0;
            }
        }

        draw() {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rot * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.sizeW / 2, -this.sizeH / 2, this.sizeW, this.sizeH);
            ctx.restore();
        }
    }

    let fireworkRockets = [];
    let fireworkSparks = [];
    let celebrationConfettis = [];

    function triggerCelebrationFireworks(rocketCount = 6) {
        for (let i = 0; i < rocketCount; i++) {
            setTimeout(() => {
                fireworkRockets.push(new FireworkRocket());
            }, i * 280);
        }
        for (let i = 0; i < 50; i++) {
            celebrationConfettis.push(new CelebrationConfetti());
        }
    }

    const celebrateBtn = document.getElementById('celebrateBtn');
    if (celebrateBtn) {
        celebrateBtn.addEventListener('click', () => {
            triggerCelebrationFireworks(7);
        });
    }

    function animatePetals() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (petalsEnabled) {
            petals.forEach(p => {
                p.update();
                p.draw();
            });
        }

        for (let i = sparkles.length - 1; i >= 0; i--) {
            const sp = sparkles[i];
            sp.update();
            sp.draw();
            if (sp.opacity <= 0) sparkles.splice(i, 1);
        }

        for (let i = fireworkRockets.length - 1; i >= 0; i--) {
            const r = fireworkRockets[i];
            r.update();
            r.draw();
            if (r.exploded) fireworkRockets.splice(i, 1);
        }

        for (let i = fireworkSparks.length - 1; i >= 0; i--) {
            const sp = fireworkSparks[i];
            sp.update();
            sp.draw();
            if (sp.opacity <= 0) fireworkSparks.splice(i, 1);
        }

        for (let i = celebrationConfettis.length - 1; i >= 0; i--) {
            const c = celebrationConfettis[i];
            c.update();
            c.draw();
            if (c.opacity <= 0) celebrationConfettis.splice(i, 1);
        }

        requestAnimationFrame(animatePetals);
    }
    animatePetals();


    /* ==============================================================
       5. PHOTO GALLERY LIGHTBOX
       ============================================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImg');
    const modalCaption = document.getElementById('modalCaption');
    const closeModal = document.querySelector('.close-modal');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.getAttribute('data-caption') || img.alt;
            modal.style.display = 'block';
            modalImg.src = img.src;
            modalCaption.textContent = caption;
        });
    });

    if (closeModal) closeModal.addEventListener('click', () => { modal.style.display = 'none'; });
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });


    /* ==============================================================
       6. RSVP FORM & WISHES WALL
       ============================================================== */
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccessAlert = document.getElementById('rsvpSuccessAlert');
    const wishesGrid = document.getElementById('wishesGrid');

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function appendWishToGrid(name, message) {
        if (!message || message.trim() === '') return;
        const card = document.createElement('div');
        card.className = 'wish-card';
        card.innerHTML = `
            <p class="wish-text">"${escapeHtml(message)}"</p>
            <span class="wish-author">— ${escapeHtml(name)}</span>
        `;
        wishesGrid.insertBefore(card, wishesGrid.firstChild);
    }

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('guestName').value.trim();
            const phone = document.getElementById('guestPhone').value.trim();
            const status = document.getElementById('attendanceStatus').value;
            const count = document.getElementById('guestCount').value;
            const message = document.getElementById('guestMessage').value.trim();

            const checkedEvents = Array.from(document.querySelectorAll('input[name="events_attending"]:checked'))
                .map(cb => cb.value);

            const rsvpData = {
                name,
                phone,
                status,
                count,
                events: checkedEvents,
                message,
                timestamp: new Date().toISOString()
            };

            const allRsvps = JSON.parse(localStorage.getItem('maithil_wedding_rsvps') || '[]');
            allRsvps.push(rsvpData);
            localStorage.setItem('maithil_wedding_rsvps', JSON.stringify(allRsvps));

            if (message) {
                appendWishToGrid(name, message);
            }

            rsvpForm.style.display = 'none';
            rsvpSuccessAlert.style.display = 'block';
            triggerCelebrationFireworks(8);
            rsvpSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }


    /* ==============================================================
       7. COPY ADDRESS & ADD TO CALENDAR
       ============================================================== */
    const copyAddressBtn = document.getElementById('copyAddressBtn');
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', () => {
            const addressText = "Mithila Heritage Vatika, Station Road, Vidyapati Nagar, Madhubani, Bihar - 847211";
            navigator.clipboard.writeText(addressText).then(() => {
                const originalText = copyAddressBtn.innerHTML;
                copyAddressBtn.innerHTML = `<i class="fas fa-check"></i> पता कॉपी भऽ गेल!`;
                setTimeout(() => { copyAddressBtn.innerHTML = originalText; }, 2500);
            });
        });
    }

    const addToCalBtn = document.getElementById('addToCalBtn');
    if (addToCalBtn) {
        addToCalBtn.addEventListener('click', () => {
            const title = encodeURIComponent("Madhav & Janki's Maithil Wedding (शुभ विवाह)");
            const details = encodeURIComponent("अहाँक माधव आ जानकीक पावन मिथिला विवाह मे सपरिवार सादर आमंत्रण अछि!");
            const location = encodeURIComponent("Mithila Heritage Vatika, Madhubani, Bihar");
            const dates = "20270222T133000Z/20270223T043000Z";

            const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
            window.open(gCalUrl, '_blank');
        });
    }


    /* ==============================================================
       8. PARALLAX MANDALA ROTATION
       ============================================================== */
    const headerMandala = document.querySelector('.header-mandala');
    if (headerMandala) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            headerMandala.style.transform = `translate(-50%, -50%) rotate(${scrollPos * 0.08}deg)`;
        }, { passive: true });
    }


    /* ==============================================================
       9. PERSONALIZED GUEST GREETING & MAITHILI WHATSAPP INVITE
       ============================================================== */
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('to') || urlParams.get('guest') || urlParams.get('name');
    const guestDisplayTitle = document.getElementById('guestDisplayTitle');
    const envelopeGuestName = document.getElementById('envelopeGuestName');

    if (guestParam && guestParam.trim() !== '') {
        const cleanName = decodeURIComponent(guestParam.trim());
        if (guestDisplayTitle) {
            guestDisplayTitle.textContent = `आदरणीय ${cleanName} सपरिवार`;
        }
        if (envelopeGuestName) {
            envelopeGuestName.textContent = `॥ शुभ विवाहक नेवता: ${cleanName} ॥`;
        }
    }

    const whatsappShareBtn = document.getElementById('whatsappShareBtn');
    const shareModal = document.getElementById('shareModal');
    const closeShareModal = document.getElementById('closeShareModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const inviteGuestInput = document.getElementById('inviteGuestInput');
    const previewMsgText = document.getElementById('previewMsgText');
    const directWhatsappSendBtn = document.getElementById('directWhatsappSendBtn');
    const copyShareLinkBtn = document.getElementById('copyShareLinkBtn');
    const shareCopyAlert = document.getElementById('shareCopyAlert');

    function updateWhatsAppPreview() {
        if (!previewMsgText || !directWhatsappSendBtn) return;
        const guestName = (inviteGuestInput && inviteGuestInput.value.trim()) ? inviteGuestInput.value.trim() : 'पाहुन सपरिवार';
        const baseUrl = window.location.origin + window.location.pathname;
        const personalizedLink = `${baseUrl}?to=${encodeURIComponent(guestName)}`;

        const message = `॥ श्री सीतारामाभ्यां नमः ॥\n\nआदरणीय ${guestName},\n\nपरमपिता परमात्माक अनुकम्पा आ पूर्वजक शुभाशीर्वाद सँ हमरा परिवारक परम सौभाग्य अछि जे माधव संग जानकीक पावन विवाह समारोह मे अहाँ सब सपरिवार सादर आमंत्रित छी।\n\n🗓️ तिथि: सोमवार, 22 फरवरी 2027 (माघ पूर्णिमा)\n📍 स्थल: मिथिला हेरिटेज वाटिका, मधुबनी (मिथिलांचल), बिहार\n\nकृपया अपन डिजिटल नेवता पत्र एहि ठाम देखू:\n${personalizedLink}`;

        previewMsgText.textContent = message;
        directWhatsappSendBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    }

    if (whatsappShareBtn && shareModal) {
        whatsappShareBtn.addEventListener('click', () => {
            shareModal.style.display = 'flex';
            updateWhatsAppPreview();
        });
    }
    if (closeShareModal && shareModal) {
        closeShareModal.addEventListener('click', () => { shareModal.style.display = 'none'; });
    }
    if (modalBackdrop && shareModal) {
        modalBackdrop.addEventListener('click', () => { shareModal.style.display = 'none'; });
    }
    if (inviteGuestInput) {
        inviteGuestInput.addEventListener('input', updateWhatsAppPreview);
    }
    if (copyShareLinkBtn) {
        copyShareLinkBtn.addEventListener('click', () => {
            const guestName = (inviteGuestInput && inviteGuestInput.value.trim()) ? inviteGuestInput.value.trim() : 'सपरिवार';
            const baseUrl = window.location.origin + window.location.pathname;
            const personalizedLink = `${baseUrl}?to=${encodeURIComponent(guestName)}`;

            navigator.clipboard.writeText(personalizedLink).then(() => {
                if (shareCopyAlert) {
                    shareCopyAlert.style.display = 'block';
                    setTimeout(() => { shareCopyAlert.style.display = 'none'; }, 2500);
                }
            });
        });
    }


    /* ==============================================================
       10. RSVP ADMIN PORTAL & EXCEL/CSV EXPORT
       ============================================================== */
    const adminPortalBtn = document.getElementById('adminPortalBtn');
    const adminModal = document.getElementById('adminModal');
    const closeAdminModal = document.getElementById('closeAdminModal');
    const adminModalBackdrop = document.getElementById('adminModalBackdrop');
    const rsvpTableBody = document.getElementById('rsvpTableBody');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const addSampleRsvpBtn = document.getElementById('addSampleRsvpBtn');
    const clearRsvpsBtn = document.getElementById('clearRsvpsBtn');

    function checkAdminAuthAndOpen() {
        const pin = prompt("पाहुन प्रबंधक पासवर्ड प्रविष्ट करू (Default Passcode: 1234):");
        if (pin === "1234") {
            adminModal.style.display = "flex";
            renderAdminDashboard();
        } else if (pin !== null) {
            alert("पासवर्ड अमान्य अछि! कृपया '1234' दर्ज करू।");
        }
    }

    function renderAdminDashboard() {
        const rsvps = JSON.parse(localStorage.getItem('maithil_wedding_rsvps') || '[]');

        let attendingParties = 0;
        let totalHeadcount = 0;
        let declinedCount = 0;

        rsvpTableBody.innerHTML = '';

        if (rsvps.length === 0) {
            rsvpTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:#888;">एखन धरि कोनो प्रविष्टि नहि अछि। टेस्ट करबाक लेल 'परीक्षण डेटा जोड़ू' दबाउ।</td></tr>`;
        } else {
            rsvps.forEach(item => {
                const isAttending = item.status !== 'regretfully_declined';
                const guestCount = parseInt(item.count || 1, 10);

                if (isAttending) {
                    attendingParties++;
                    totalHeadcount += guestCount;
                } else {
                    declinedCount++;
                }

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${escapeHtml(item.name)}</strong></td>
                    <td>${escapeHtml(item.phone || '-')}</td>
                    <td><span class="status-badge ${isAttending ? 'status-attending' : 'status-declined'}">${isAttending ? 'उपस्थित' : 'असमर्थ'}</span></td>
                    <td>${isAttending ? guestCount : 0}</td>
                    <td>${escapeHtml(Array.isArray(item.events) ? item.events.join(', ') : '-')}</td>
                    <td style="max-width:200px; font-style:italic;">"${escapeHtml(item.message || 'शुभकामना')}"</td>
                `;
                rsvpTableBody.appendChild(tr);
            });
        }

        document.getElementById('statTotalRsvp').textContent = rsvps.length;
        document.getElementById('statAttendingCount').textContent = attendingParties;
        document.getElementById('statTotalHeadcount').textContent = totalHeadcount;
        document.getElementById('statDeclinedCount').textContent = declinedCount;
    }

    if (adminPortalBtn) adminPortalBtn.addEventListener('click', checkAdminAuthAndOpen);
    if (closeAdminModal) closeAdminModal.addEventListener('click', () => { adminModal.style.display = 'none'; });
    if (adminModalBackdrop) adminModalBackdrop.addEventListener('click', () => { adminModal.style.display = 'none'; });

    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
            const rsvps = JSON.parse(localStorage.getItem('maithil_wedding_rsvps') || '[]');
            if (rsvps.length === 0) {
                alert("डाउनलोड करबाक लेल कोनो डेटा नहि अछि!");
                return;
            }

            let csvContent = "\uFEFF";
            csvContent += "पाहुनक नाम,फोन नंबर,स्थिति,सदस्य संख्या,कार्यक्रम,आशीर्वाद संदेश,समय\n";

            rsvps.forEach(r => {
                const row = [
                    `"${(r.name || '').replace(/"/g, '""')}"`,
                    `"${(r.phone || '').replace(/"/g, '""')}"`,
                    `"${(r.status || '').replace(/"/g, '""')}"`,
                    r.count || 1,
                    `"${(Array.isArray(r.events) ? r.events.join('; ') : '').replace(/"/g, '""')}"`,
                    `"${(r.message || '').replace(/"/g, '""')}"`,
                    `"${(r.timestamp || '').replace(/"/g, '""')}"`
                ];
                csvContent += row.join(",") + "\n";
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `maithil_vivah_guest_list_madhav_janki_${new Date().toISOString().slice(0,10)}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    if (addSampleRsvpBtn) {
        addSampleRsvpBtn.addEventListener('click', () => {
            const samples = [
                { name: "पं. भुवनेश्वर मिश्र (दरभंगा)", phone: "+91 98350 11223", status: "joyfully_attending", count: 4, events: ["सिद्धांत", "हरदी", "कन्यादान-सिंदूरदान", "कोहबर-प्रीतिभोज"], message: "सीता-रामक पावन कृपा बनल रहय!", timestamp: new Date().toISOString() },
                { name: "प्रो. हरिनारायण झा (मधुबनी)", phone: "+91 94310 44556", status: "joyfully_attending", count: 3, events: ["कन्यादान-सिंदूरदान", "कोहबर-प्रीतिभोज"], message: "वर-कन्याक जोड़ी जुग-जुग जियय!", timestamp: new Date().toISOString() },
                { name: "अमित कुमार चौधरी (पटना)", phone: "+91 98352 99887", status: "attending_solo", count: 1, events: ["कन्यादान-सिंदूरदान"], message: "अनंत बधाई व मंगलकामना।", timestamp: new Date().toISOString() },
                { name: "मामा जी (दिल्ली)", phone: "+91 98100 22334", status: "regretfully_declined", count: 0, events: [], message: "दूर सँ अखंड सौभाग्यक आशीर्वाद!", timestamp: new Date().toISOString() }
            ];

            const existing = JSON.parse(localStorage.getItem('maithil_wedding_rsvps') || '[]');
            const updated = existing.concat(samples);
            localStorage.setItem('maithil_wedding_rsvps', JSON.stringify(updated));
            renderAdminDashboard();
        });
    }

    if (clearRsvpsBtn) {
        clearRsvpsBtn.addEventListener('click', () => {
            if (confirm("की अहाँ सच मे संपूर्ण पाहुन सूची साफ करय चाहैत छी?")) {
                localStorage.removeItem('maithil_wedding_rsvps');
                renderAdminDashboard();
            }
        });
    }

});

