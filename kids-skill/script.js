// Yellow BRIC-Toad Kids Skill - Interactive Script

// State Management
const state = {
    soundEnabled: true,
    discoveries: new Set(),
    currentActivity: null,
    drawingColor: '#ff6b6b',
    count: 0
};

// Toad Messages
const toadMessages = {
    welcome: "Hi! I'm the Yellow BRIC-Toad! Click on the colorful paths to explore!",
    yellow: "Wow! You found the Yellow Path! ⭐ Like sunshine and happiness!",
    blue: "Amazing! You discovered the Blue Path! 🔵 Like the ocean and sky!",
    red: "Fantastic! You explored the Red Path! ❤️ Like love and courage!",
    green: "Wonderful! You followed the Green Path! 🌿 Like nature and growth!",
    allFound: "🎉 You're an amazing explorer! You found all the paths! You're so clever!",
    activity: "Great choice! Let's have some fun together!",
    drawing: "Let's draw something beautiful! Pick a color and create!",
    counting: "Let's count together! Numbers are fun!",
    music: "Time to make some music! Press the colorful keys!",
    shapes: "Let's learn about shapes! Click on each one!"
};

// Discovery Data
const discoveries = {
    yellow: { emoji: '🌟', text: 'Sunshine Star' },
    blue: { emoji: '🌊', text: 'Ocean Wave' },
    red: { emoji: '❤️', text: 'Happy Heart' },
    green: { emoji: '🌿', text: 'Growing Plant' }
};

// Audio Context (Web Audio API for simple sounds)
let audioContext;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(frequency = 440, duration = 200, type = 'sine') {
    if (!state.soundEnabled) return;
    
    initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
}

function playDiscoverySound() {
    playSound(523.25, 150); // C5
    setTimeout(() => playSound(659.25, 150), 150); // E5
    setTimeout(() => playSound(783.99, 200), 300); // G5
}

function playClickSound() {
    playSound(440, 100, 'triangle');
}

function playSuccessSound() {
    playSound(523.25, 100);
    setTimeout(() => playSound(659.25, 100), 100);
    setTimeout(() => playSound(783.99, 150), 200);
    setTimeout(() => playSound(1046.50, 200), 350); // C6
}

// Update Toad Message
function updateToadMessage(message) {
    const messageEl = document.getElementById('toad-message');
    messageEl.style.opacity = '0';
    
    setTimeout(() => {
        messageEl.textContent = message;
        messageEl.style.opacity = '1';
    }, 300);
}

// Handle Path Discovery
function handlePathDiscovery(pathType) {
    const pathNode = document.querySelector(`[data-discovery="${pathType}"]`);
    
    if (state.discoveries.has(pathType)) {
        playClickSound();
        updateToadMessage(toadMessages[pathType]);
        return;
    }
    
    // Add to discoveries
    state.discoveries.add(pathType);
    pathNode.classList.add('discovered');
    
    // Play sound
    playDiscoverySound();
    
    // Update toad message
    updateToadMessage(toadMessages[pathType]);
    
    // Add discovery to list
    addDiscoveryItem(pathType);
    
    // Check if all found
    if (state.discoveries.size === 4) {
        setTimeout(() => {
            playSuccessSound();
            updateToadMessage(toadMessages.allFound);
        }, 2000);
    }
}

function addDiscoveryItem(pathType) {
    const discoveriesList = document.getElementById('discoveries-list');
    const hint = discoveriesList.querySelector('.hint');
    
    if (hint) {
        hint.remove();
    }
    
    const discovery = discoveries[pathType];
    const item = document.createElement('div');
    item.className = 'discovery-item';
    item.innerHTML = `${discovery.emoji} ${discovery.text}`;
    
    discoveriesList.appendChild(item);
}

// Activity Handlers
function openActivity(activityType) {
    playClickSound();
    state.currentActivity = activityType;
    
    const canvas = document.getElementById('activity-canvas');
    const content = document.getElementById('activity-content');
    
    updateToadMessage(toadMessages.activity);
    
    canvas.classList.remove('hidden');
    
    // Generate activity content
    switch(activityType) {
        case 'draw':
            content.innerHTML = createDrawingActivity();
            initDrawing();
            break;
        case 'count':
            content.innerHTML = createCountingActivity();
            initCounting();
            break;
        case 'music':
            content.innerHTML = createMusicActivity();
            initMusic();
            break;
        case 'shapes':
            content.innerHTML = createShapesActivity();
            initShapes();
            break;
    }
}

function closeActivity() {
    playClickSound();
    const canvas = document.getElementById('activity-canvas');
    canvas.classList.add('hidden');
    state.currentActivity = null;
    updateToadMessage(toadMessages.welcome);
}

// Drawing Activity
function createDrawingActivity() {
    return `
        <h2>🎨 Draw with the Yellow BRIC-Toad!</h2>
        <div class="color-palette">
            <button class="color-btn active" style="background-color: #ff6b6b" data-color="#ff6b6b"></button>
            <button class="color-btn" style="background-color: #4ecdc4" data-color="#4ecdc4"></button>
            <button class="color-btn" style="background-color: #ffd93d" data-color="#ffd93d"></button>
            <button class="color-btn" style="background-color: #95e1d3" data-color="#95e1d3"></button>
            <button class="color-btn" style="background-color: #f38181" data-color="#f38181"></button>
            <button class="color-btn" style="background-color: #aa96da" data-color="#aa96da"></button>
        </div>
        <canvas id="draw-canvas" class="drawing-canvas" width="600" height="400"></canvas>
        <div style="text-align: center; margin-top: 15px;">
            <button class="count-btn plus" onclick="clearCanvas()">Clear Canvas</button>
        </div>
    `;
}

function initDrawing() {
    const canvas = document.getElementById('draw-canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    
    // Set initial properties
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = state.drawingColor;
    
    // Color selection
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            playClickSound();
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.drawingColor = btn.dataset.color;
            ctx.strokeStyle = state.drawingColor;
        });
    });
    
    // Drawing events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
    
    function startDrawing(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
    
    function draw(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
    
    function handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
}

function clearCanvas() {
    playClickSound();
    const canvas = document.getElementById('draw-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Counting Activity
function createCountingActivity() {
    return `
        <h2>🔢 Count with the Yellow BRIC-Toad!</h2>
        <div class="counting-game">
            <div class="counting-display">${state.count}</div>
            <div class="counting-items" id="counting-items"></div>
            <div class="counting-controls">
                <button class="count-btn minus" onclick="decrementCount()">➖ Minus</button>
                <button class="count-btn plus" onclick="incrementCount()">➕ Plus</button>
            </div>
        </div>
    `;
}

function initCounting() {
    state.count = 0;
    updateCountDisplay();
}

function incrementCount() {
    if (state.count < 10) {
        state.count++;
        playSound(440 + (state.count * 50), 150);
        updateCountDisplay();
    }
}

function decrementCount() {
    if (state.count > 0) {
        state.count--;
        playSound(440 - (state.count * 30), 150);
        updateCountDisplay();
    }
}

function updateCountDisplay() {
    const display = document.querySelector('.counting-display');
    const itemsContainer = document.getElementById('counting-items');
    
    if (display) {
        display.textContent = state.count;
        display.style.animation = 'none';
        setTimeout(() => display.style.animation = 'popIn 0.3s ease-out', 10);
    }
    
    if (itemsContainer) {
        itemsContainer.innerHTML = '';
        const emojis = ['🌟', '🎈', '🍎', '🌸', '🦋', '🎨', '🎵', '🌈', '⭐', '🎁'];
        
        for (let i = 0; i < state.count; i++) {
            const item = document.createElement('div');
            item.className = 'counting-item';
            item.textContent = emojis[i % emojis.length];
            item.style.animationDelay = `${i * 0.1}s`;
            itemsContainer.appendChild(item);
        }
    }
}

// Music Activity
function createMusicActivity() {
    const notes = [
        { note: 'Do', freq: 261.63, color: '#ff6b6b' },
        { note: 'Re', freq: 293.66, color: '#ffd93d' },
        { note: 'Mi', freq: 329.63, color: '#4ecdc4' },
        { note: 'Fa', freq: 349.23, color: '#95e1d3' },
        { note: 'Sol', freq: 392.00, color: '#f38181' },
        { note: 'La', freq: 440.00, color: '#aa96da' },
        { note: 'Ti', freq: 493.88, color: '#fcbad3' },
        { note: 'Do', freq: 523.25, color: '#ff6b6b' }
    ];
    
    let html = '<h2>🎵 Make Music with the Yellow BRIC-Toad!</h2><div class="music-keyboard">';
    
    notes.forEach((note, index) => {
        html += `<button class="key-btn" style="background-color: ${note.color}" 
                 onclick="playNote(${note.freq}, '${note.note}')">${note.note}</button>`;
    });
    
    html += '</div>';
    return html;
}

function initMusic() {
    // Music is initialized through inline onclick handlers
}

function playNote(frequency, noteName) {
    playSound(frequency, 300, 'sine');
    updateToadMessage(`🎵 That's ${noteName}! Beautiful!`);
}

// Shapes Activity
function createShapesActivity() {
    const shapes = [
        { emoji: '⭐', name: 'Star' },
        { emoji: '🔵', name: 'Circle' },
        { emoji: '🔺', name: 'Triangle' },
        { emoji: '🟦', name: 'Square' },
        { emoji: '❤️', name: 'Heart' },
        { emoji: '💠', name: 'Diamond' }
    ];
    
    let html = '<h2>⭐ Find Shapes with the Yellow BRIC-Toad!</h2><div class="shapes-grid">';
    
    shapes.forEach(shape => {
        html += `
            <div class="shape-item" onclick="announceShape('${shape.name}', '${shape.emoji}')">
                <div class="shape-icon">${shape.emoji}</div>
                <div class="shape-label">${shape.name}</div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function initShapes() {
    // Shapes are initialized through inline onclick handlers
}

function announceShape(shapeName, emoji) {
    playSound(440 + Math.random() * 200, 200);
    updateToadMessage(`${emoji} You found a ${shapeName}! Great job!`);
}

// Sound Toggle
function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    const btn = document.getElementById('sound-toggle');
    
    if (state.soundEnabled) {
        btn.textContent = '🔊';
        btn.classList.remove('muted');
        playClickSound();
    } else {
        btn.textContent = '🔇';
        btn.classList.add('muted');
    }
}

// Initialize App
function init() {
    // Path nodes
    document.querySelectorAll('.path-node').forEach(node => {
        node.addEventListener('click', () => {
            const discovery = node.dataset.discovery;
            handlePathDiscovery(discovery);
        });
    });
    
    // Activity buttons
    document.querySelectorAll('.activity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const activity = btn.dataset.activity;
            openActivity(activity);
        });
    });
    
    // Close activity button
    document.getElementById('close-activity').addEventListener('click', closeActivity);
    
    // Sound toggle
    document.getElementById('sound-toggle').addEventListener('click', toggleSound);
    
    // Toad character interaction
    document.querySelector('.toad-character').addEventListener('click', () => {
        playSound(523.25, 100);
        setTimeout(() => playSound(659.25, 100), 100);
        updateToadMessage("Ribbit! 🐸 Keep exploring, little friend!");
    });
    
    // Welcome sound
    setTimeout(() => {
        playSound(440, 150);
    }, 500);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
