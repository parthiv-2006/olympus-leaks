// 1. PASSWORD GATE LOGIC
function checkPass() {
    const input = document.getElementById('passwordInput').value.toUpperCase();
    if(input === 'TROY') {
        document.getElementById('gate').classList.add('unlocked');
    } else {
        const err = document.getElementById('errorMsg');
        err.style.opacity = 1;
        setTimeout(() => err.style.opacity = 0, 2000);
    }
}

// 2. HERMES ANNOTATION TOGGLE
const toggle = document.getElementById('hermesToggle');
toggle.addEventListener('change', (e) => {
    if(e.target.checked) {
        document.body.classList.add('hermes-mode');
    } else {
        document.body.classList.remove('hermes-mode');
    }
});

// 3. SLACK CHAT SIMULATION
const chatFeed = document.getElementById('chat-feed');
const chats = [
    {u: 'Zeus', t: 'Great turnout everyone. The mutton is acceptable.', a: '⚡'},
    {u: 'Hera', t: 'Finally, a peaceful retreat without *certain people*.', a: '👑'},
    {u: 'Athena', t: 'The seating chart is optimal. Good work, Dad.', a: '🦉'},
    {u: 'SYSTEM', t: 'Eris 🍎 has joined the channel.'},
    {u: 'Hermes', t: 'Uh oh.', a: '👟'},
    {u: 'Eris', t: 'Wow. My invite must have gone to spam? 🙄', a: '🍎'},
    {u: 'Zeus', t: 'Eris, this is a private channel.', a: '⚡'},
    {u: 'Eris', t: 'Relax. Since I’m here, I brought a bonus. Catch.', a: '🍎'},
    {u: 'Eris', t: 'Uploaded: Golden_Apple.jpg ("For The Fairest")', a: '🍎'},
    {u: 'SYSTEM', t: 'Eris 🍎 has left the channel.'},
    {u: 'Hera', t: 'Obviously, this is for me. I am the Queen.', a: '👑'},
    {u: 'Athena', t: 'Objection. "Fairest" implies wisdom. It’s mine.', a: '🦉'},
    {u: 'Aphrodite', t: 'LOL. Look at the font. It literally means Beautiful. Hand it over.', a: '🕊️'},
    {u: 'Hera', t: '@Zeus Make a decision.', a: '👑'},
    {u: 'Zeus', t: '@channel I am going on PTO immediately. Do not tag me. Hermes, find a shepherd to decide.', a: '⚡'}
];

let chatPlayed = false;
const chatTrigger = document.getElementById('chat-trigger');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting && !chatPlayed) {
            chatPlayed = true;
            playChat();
        }
        // Stamp trigger
        if(entry.target.id === 'form-trigger' && entry.isIntersecting) {
            setTimeout(() => document.getElementById('stamp').classList.add('visible'), 1500);
        }
    });
}, {threshold: 0.5});

observer.observe(chatTrigger);
observer.observe(document.getElementById('form-trigger'));

async function playChat() {
    for(let msg of chats) {
        let div = document.createElement('div');
        div.className = 'msg';
        if(msg.u === 'SYSTEM') {
            div.innerHTML = `<div style="width:100%; text-align:center; color:#888; font-style:italic; font-size:0.8rem;">${msg.t}</div>`;
        } else {
            div.innerHTML = `
                <div class="avatar">${msg.a}</div>
                <div class="msg-body">
                    <b>${msg.u}</b>
                    <div>${msg.t}</div>
                </div>
            `;
        }
        chatFeed.appendChild(div);
        setTimeout(() => div.classList.add('show'), 50);
        chatFeed.scrollTop = chatFeed.scrollHeight;
        // Variable typing speed
        let delay = 1000 + Math.random() * 800;
        await new Promise(r => setTimeout(r, delay));
    }
}

// 4. CONSTELLATION BACKGROUND
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let w, h, particles = [];

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if(this.x < 0 || this.x > w) this.vx *= -1;
        if(this.y < 0 || this.y > h) this.vy *= -1;
    }
}

for(let i=0; i<60; i++) particles.push(new Particle());

function animate() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(100, 100, 255, 0.1)';
    ctx.fillStyle = 'rgba(200, 200, 255, 0.5)';
    
    for(let i=0; i<particles.length; i++) {
        let p = particles[i];
        p.update();
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fill();
        
        for(let j=i; j<particles.length; j++) {
            let p2 = particles[j];
            let d = Math.hypot(p.x - p2.x, p.y - p2.y);
            if(d < 150) {
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}
animate();