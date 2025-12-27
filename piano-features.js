// Extended Piano Features
// This extends the Piano class with all beginner-friendly features

// Add methods to Piano prototype
Piano.prototype.setupHelperTabs = function() {
    const tabs = document.querySelectorAll('.helper-tab');
    const panels = document.querySelectorAll('.helper-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            const panel = document.getElementById(`${targetTab}Panel`);
            if (panel) panel.classList.add('active');
        });
    });
};

Piano.prototype.setupMetronome = function() {
    const metronomeBPM = document.getElementById('metronomeBPM');
    const bpmValue = document.getElementById('bpmValue');
    const toggleMetronome = document.getElementById('toggleMetronome');

    if (metronomeBPM && bpmValue) {
        metronomeBPM.addEventListener('input', (e) => {
            this.metronomeBPM = parseInt(e.target.value);
            bpmValue.textContent = this.metronomeBPM;
            this.tempo = this.metronomeBPM;
            if (this.metronomeEnabled) {
                this.stopMetronome();
                this.startMetronome();
            }
        });
    }

    if (toggleMetronome) {
        toggleMetronome.addEventListener('click', () => {
            if (this.metronomeEnabled) {
                this.stopMetronome();
                toggleMetronome.textContent = 'Start Metronome';
            } else {
                this.startMetronome();
                toggleMetronome.textContent = 'Stop Metronome';
            }
        });
    }
};

Piano.prototype.startMetronome = function() {
    this.metronomeEnabled = true;
    const interval = 60000 / this.metronomeBPM;
    
    const playClick = () => {
        if (!this.metronomeEnabled || !this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 800;
        
        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.1);
        
        this.metronomeInterval = setTimeout(playClick, interval);
    };
    
    playClick();
};

Piano.prototype.stopMetronome = function() {
    this.metronomeEnabled = false;
    if (this.metronomeInterval) {
        clearTimeout(this.metronomeInterval);
        this.metronomeInterval = null;
    }
};

Piano.prototype.setupChordMode = function() {
    const chordType = document.getElementById('chordType');
    const playChordBtn = document.getElementById('playChord');
    const enableChordModeBtn = document.getElementById('enableChordMode');

    if (chordType) {
        chordType.addEventListener('change', (e) => {
            this.currentChord = e.target.value;
        });
    }

    if (playChordBtn) {
        playChordBtn.addEventListener('click', () => {
            if (this.currentChord) {
                this.playChord(this.currentChord);
            }
        });
    }

    if (enableChordModeBtn) {
        enableChordModeBtn.addEventListener('click', () => {
            this.chordModeEnabled = !this.chordModeEnabled;
            enableChordModeBtn.textContent = this.chordModeEnabled 
                ? 'Disable Chord Mode' 
                : 'Enable Chord Mode';
            enableChordModeBtn.style.background = this.chordModeEnabled
                ? 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        });
    }
};

Piano.prototype.playChord = function(chordName, keyElement = null) {
    const chords = {
        'C-major': [261.63, 329.63, 392.00],
        'C-minor': [261.63, 311.13, 392.00],
        'C-7th': [261.63, 329.63, 392.00, 466.16],
        'D-major': [293.66, 369.99, 440.00],
        'D-minor': [293.66, 349.23, 440.00],
        'E-major': [329.63, 415.30, 493.88],
        'E-minor': [329.63, 392.00, 493.88],
        'F-major': [349.23, 440.00, 523.25],
        'G-major': [392.00, 493.88, 587.33],
        'A-major': [440.00, 554.37, 659.25],
        'A-minor': [440.00, 523.25, 659.25]
    };

    const frequencies = chords[chordName];
    if (!frequencies) return;

    frequencies.forEach((freq, index) => {
        setTimeout(() => {
            const note = `chord-${chordName}-${index}`;
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = this.getOscillatorType();
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(this.volume * 0.2, this.audioContext.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.start();
            osc.stop(this.audioContext.currentTime + 1);
        }, index * 50);
    });
};

Piano.prototype.getOscillatorType = function() {
    const types = {
        'piano': 'sine',
        'organ': 'square',
        'synth': 'sawtooth',
        'strings': 'triangle'
    };
    return types[this.instrumentType] || 'sine';
};

Piano.prototype.setupMelodies = function() {
    const melodies = {
        'twinkle': [
            { note: 'C', time: 0 }, { note: 'C', time: 500 },
            { note: 'G', time: 1000 }, { note: 'G', time: 1500 },
            { note: 'A', time: 2000 }, { note: 'A', time: 2500 },
            { note: 'G', time: 3000 }, { note: 'F', time: 3500 },
            { note: 'F', time: 4000 }, { note: 'E', time: 4500 },
            { note: 'E', time: 5000 }, { note: 'D', time: 5500 },
            { note: 'D', time: 6000 }, { note: 'C', time: 6500 }
        ],
        'happy': [
            { note: 'C', time: 0 }, { note: 'C', time: 300 },
            { note: 'D', time: 600 }, { note: 'C', time: 900 },
            { note: 'F', time: 1200 }, { note: 'E', time: 1800 },
            { note: 'C', time: 2400 }, { note: 'C', time: 2700 },
            { note: 'D', time: 3000 }, { note: 'C', time: 3300 },
            { note: 'G', time: 3600 }, { note: 'F', time: 4200 }
        ],
        'scale': [
            { note: 'C', time: 0 }, { note: 'D', time: 300 },
            { note: 'E', time: 600 }, { note: 'F', time: 900 },
            { note: 'G', time: 1200 }, { note: 'A', time: 1500 },
            { note: 'B', time: 1800 }, { note: 'C', time: 2100 },
            { note: 'B', time: 2400 }, { note: 'A', time: 2700 },
            { note: 'G', time: 3000 }, { note: 'F', time: 3300 },
            { note: 'E', time: 3600 }, { note: 'D', time: 3900 },
            { note: 'C', time: 4200 }
        ],
        'chopsticks': [
            { note: 'C', time: 0 }, { note: 'E', time: 0 },
            { note: 'G', time: 500 }, { note: 'C', time: 1000 },
            { note: 'E', time: 1000 }, { note: 'G', time: 1500 },
            { note: 'C', time: 2000 }, { note: 'E', time: 2000 },
            { note: 'G', time: 2500 }
        ]
    };

    const noteFrequencies = {
        'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
        'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
        'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
    };

    document.querySelectorAll('.melody-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const melodyCard = e.target.closest('.melody-card');
            const melodyName = melodyCard.dataset.melody;
            const melody = melodies[melodyName];
            
            if (melody) {
                melody.forEach(({ note, time }) => {
                    setTimeout(() => {
                        const freq = noteFrequencies[note] || 261.63;
                        const osc = this.audioContext.createOscillator();
                        const gain = this.audioContext.createGain();
                        
                        osc.type = this.getOscillatorType();
                        osc.frequency.value = freq;
                        
                        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
                        gain.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
                        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                        
                        osc.connect(gain);
                        gain.connect(this.audioContext.destination);
                        
                        osc.start();
                        osc.stop(this.audioContext.currentTime + 0.5);
                    }, time);
                });
            }
        });
    });
};

Piano.prototype.setupEffects = function() {
    const reverbAmount = document.getElementById('reverbAmount');
    const delayAmount = document.getElementById('delayAmount');
    const instrumentType = document.getElementById('instrumentType');

    if (reverbAmount) {
        reverbAmount.addEventListener('input', (e) => {
            this.reverbAmount = parseInt(e.target.value);
            const reverbValue = document.getElementById('reverbValue');
            if (reverbValue) reverbValue.textContent = `${this.reverbAmount}%`;
        });
    }

    if (delayAmount) {
        delayAmount.addEventListener('input', (e) => {
            this.delayAmount = parseInt(e.target.value);
            const delayValue = document.getElementById('delayValue');
            if (delayValue) delayValue.textContent = `${this.delayAmount}%`;
        });
    }

    if (instrumentType) {
        instrumentType.addEventListener('change', (e) => {
            this.instrumentType = e.target.value;
        });
    }
};

Piano.prototype.setupAdvancedFeatures = function() {
    const newTrackBtn = document.getElementById('newTrack');
    const saveRecordingBtn = document.getElementById('saveRecording');
    const shareRecordingBtn = document.getElementById('shareRecording');
    const tempoSync = document.getElementById('tempoSync');
    const syncBeatPianoBtn = document.getElementById('syncBeatPiano');

    if (newTrackBtn) {
        newTrackBtn.addEventListener('click', () => {
            this.tracks.push({
                name: `Track ${this.tracks.length + 1}`,
                notes: []
            });
            this.updateTracksList();
        });
    }

    if (saveRecordingBtn) {
        saveRecordingBtn.addEventListener('click', () => {
            if (this.recordedNotes.length === 0) {
                alert('No recording to save! Record something first.');
                return;
            }
            this.saveRecording();
        });
    }

    if (shareRecordingBtn) {
        shareRecordingBtn.addEventListener('click', () => {
            if (this.recordedNotes.length === 0) {
                alert('No recording to share! Record something first.');
                return;
            }
            this.shareRecording();
        });
    }

    if (tempoSync) {
        tempoSync.addEventListener('input', (e) => {
            this.tempo = parseInt(e.target.value);
            const tempoValue = document.getElementById('tempoValue');
            if (tempoValue) tempoValue.textContent = this.tempo;
        });
    }

    if (syncBeatPianoBtn) {
        syncBeatPianoBtn.addEventListener('click', () => {
            this.metronomeBPM = this.tempo;
            const metronomeBPM = document.getElementById('metronomeBPM');
            const bpmValue = document.getElementById('bpmValue');
            if (metronomeBPM) metronomeBPM.value = this.tempo;
            if (bpmValue) bpmValue.textContent = this.tempo;
            if (this.metronomeEnabled) {
                this.stopMetronome();
                this.startMetronome();
            }
        });
    }
};

Piano.prototype.updateTracksList = function() {
    const tracksList = document.getElementById('tracksList');
    if (!tracksList) return;

    tracksList.innerHTML = '';
    this.tracks.forEach((track, index) => {
        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        trackItem.innerHTML = `
            <span>${track.name}</span>
            <div class="track-controls">
                <button class="track-btn" onclick="window.pianoInstance.playTrack(${index})">Play</button>
                <button class="track-btn" onclick="window.pianoInstance.deleteTrack(${index})">Delete</button>
            </div>
        `;
        tracksList.appendChild(trackItem);
    });
};

Piano.prototype.playTrack = function(index) {
    const track = this.tracks[index];
    if (!track || track.notes.length === 0) return;

    track.notes.forEach(({ note, frequency, startTime, duration }) => {
        const delay = startTime - track.notes[0].startTime;
        setTimeout(() => {
            const keyElement = document.querySelector(`[data-note="${note}"]`);
            this.playNote(frequency, note, keyElement);
            if (duration) {
                setTimeout(() => this.stopNote(note), duration);
            }
        }, delay);
    });
};

Piano.prototype.deleteTrack = function(index) {
    this.tracks.splice(index, 1);
    this.updateTracksList();
};

Piano.prototype.saveRecording = function() {
    const data = JSON.stringify({
        notes: this.recordedNotes,
        timestamp: Date.now()
    });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `piano-recording-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('Recording saved!');
};

Piano.prototype.shareRecording = function() {
    const data = btoa(JSON.stringify(this.recordedNotes));
    const shareUrl = `${window.location.origin}${window.location.pathname}?recording=${data}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Piano Recording',
            text: 'Check out my piano recording!',
            url: shareUrl
        });
    } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Share link copied to clipboard!');
        });
    }
};

Piano.prototype.setupVisualFeedback = function() {
    const canvas = document.getElementById('waveformCanvas');
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.canvasContext = canvas.getContext('2d');
    
    // Simple waveform animation
    this.drawWaveform();
};

Piano.prototype.drawWaveform = function() {
    if (!this.canvasContext) return;
    
    const canvas = this.canvasContext.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    this.canvasContext.clearRect(0, 0, width, height);
    this.canvasContext.strokeStyle = '#ff6b6b';
    this.canvasContext.lineWidth = 2;
    
    this.canvasContext.beginPath();
    for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin((x + Date.now() / 10) * 0.1) * 30;
        if (x === 0) {
            this.canvasContext.moveTo(x, y);
        } else {
            this.canvasContext.lineTo(x, y);
        }
    }
    this.canvasContext.stroke();
    
    requestAnimationFrame(() => this.drawWaveform());
};

Piano.prototype.updateCurrentNote = function(note) {
    const currentNoteEl = document.getElementById('currentNote');
    if (currentNoteEl) {
        currentNoteEl.textContent = `Playing: ${note}`;
        setTimeout(() => {
            if (currentNoteEl) {
                currentNoteEl.textContent = 'Press a key to start';
            }
        }, 500);
    }
};

Piano.prototype.setupVirtualKeyboard = function() {
    const toggleBtn = document.getElementById('toggleVirtualKeyboard');
    const virtualKeyboard = document.getElementById('virtualKeyboard');
    const virtualKeysContainer = document.getElementById('virtualKeysContainer');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (virtualKeyboard.style.display === 'none') {
                virtualKeyboard.style.display = 'block';
                this.createVirtualKeys(virtualKeysContainer);
                toggleBtn.textContent = 'Hide On-Screen Keyboard';
            } else {
                virtualKeyboard.style.display = 'none';
                toggleBtn.textContent = 'Show On-Screen Keyboard';
            }
        });
    }
};

Piano.prototype.createVirtualKeys = function(container) {
    if (!container) return;
    container.innerHTML = '';

    const keys = [
        { key: 'q', note: 'C', white: true },
        { key: 'w', note: 'D', white: true },
        { key: 'e', note: 'E', white: true },
        { key: 'r', note: 'F', white: true },
        { key: 't', note: 'G', white: true },
        { key: 'y', note: 'A', white: true },
        { key: 'u', note: 'B', white: true },
        { key: 'i', note: 'C', white: true },
        { key: 'o', note: 'D', white: true },
        { key: 'p', note: 'E', white: true },
        { key: 'a', note: 'F', white: true },
        { key: 's', note: 'G', white: true },
        { key: 'd', note: 'A', white: true },
        { key: 'f', note: 'B', white: true },
        { key: 'g', note: 'C', white: true },
        { key: 'h', note: 'D', white: true },
        { key: 'j', note: 'E', white: true },
        { key: 'k', note: 'F', white: true },
        { key: 'l', note: 'G', white: true },
    ];

    keys.forEach(({ key, note, white }) => {
        const keyBtn = document.createElement('button');
        keyBtn.className = `virtual-key ${white ? '' : 'black'}`;
        keyBtn.textContent = note;
        keyBtn.title = `Key: ${key.toUpperCase()}`;
        
        const self = this;
        keyBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const keyConfig = self.getKeyConfig(key);
            if (keyConfig) {
                self.playNote(keyConfig.frequency, keyConfig.note, keyBtn);
                keyBtn.classList.add('active');
            }
        });
        
        keyBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            const keyConfig = self.getKeyConfig(key);
            if (keyConfig) {
                self.stopNote(keyConfig.note);
                keyBtn.classList.remove('active');
            }
        });

        keyBtn.addEventListener('mousedown', () => {
            const keyConfig = self.getKeyConfig(key);
            if (keyConfig) {
                self.playNote(keyConfig.frequency, keyConfig.note, keyBtn);
                keyBtn.classList.add('active');
            }
        });

        keyBtn.addEventListener('mouseup', () => {
            const keyConfig = self.getKeyConfig(key);
            if (keyConfig) {
                self.stopNote(keyConfig.note);
                keyBtn.classList.remove('active');
            }
        });

        container.appendChild(keyBtn);
    });
};

Piano.prototype.getKeyConfig = function(key) {
    const keyMap = {
        'q': { note: 'C1', frequency: 130.81 },
        'w': { note: 'D1', frequency: 146.83 },
        'e': { note: 'E1', frequency: 164.81 },
        'r': { note: 'F1', frequency: 174.61 },
        't': { note: 'G1', frequency: 196.00 },
        'y': { note: 'A1', frequency: 220.00 },
        'u': { note: 'B1', frequency: 246.94 },
        'i': { note: 'C2', frequency: 261.63 },
        'o': { note: 'D2', frequency: 293.66 },
        'p': { note: 'E2', frequency: 329.63 },
        'a': { note: 'A2', frequency: 440.00 },
        's': { note: 'B2', frequency: 493.88 },
        'd': { note: 'C3', frequency: 523.25 },
        'f': { note: 'D3', frequency: 587.33 },
        'g': { note: 'E3', frequency: 659.25 },
        'h': { note: 'F3', frequency: 698.46 },
        'j': { note: 'G3', frequency: 783.99 },
        'k': { note: 'A3', frequency: 880.00 },
        'l': { note: 'B3', frequency: 987.77 }
    };
    return keyMap[key.toLowerCase()];
};

Piano.prototype.setupScaleHelper = function() {
    const scaleSelector = document.getElementById('scaleSelector');
    if (!scaleSelector) return;

    scaleSelector.addEventListener('change', (e) => {
        this.selectedScale = e.target.value;
        this.highlightScale(this.selectedScale);
    });
};

Piano.prototype.highlightScale = function(scaleName) {
    document.querySelectorAll('.piano-key').forEach(key => {
        key.classList.remove('in-scale', 'scale-root');
    });

    if (!scaleName) return;

    const scales = {
        'c-major': ['C1', 'D1', 'E1', 'F1', 'G1', 'A1', 'B1', 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C3'],
        'a-minor': ['A1', 'B1', 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3'],
        'g-major': ['G1', 'A1', 'B1', 'C2', 'D2', 'E2', 'F#2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3'],
        'd-minor': ['D1', 'E1', 'F1', 'G1', 'A1', 'A#1', 'C2', 'D2', 'E2', 'F2', 'G2', 'A2'],
        'f-major': ['F1', 'G1', 'A1', 'A#1', 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'A#2', 'C3', 'D3', 'E3', 'F3']
    };

    const scaleNotes = scales[scaleName];
    if (!scaleNotes) return;

    scaleNotes.forEach((note, index) => {
        const keyElement = document.querySelector(`[data-note="${note}"]`);
        if (keyElement) {
            keyElement.classList.add('in-scale');
            if (index === 0) {
                keyElement.classList.add('scale-root');
            }
        }
    });
};

