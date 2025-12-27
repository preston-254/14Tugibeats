// Interactive Piano
class Piano {
    constructor() {
        this.audioContext = null;
        this.oscillators = {};
        this.recordedNotes = [];
        this.isRecording = false;
        this.volume = 0.7;
        this.keyboardModeEnabled = true;
        this.chordModeEnabled = false;
        this.currentChord = null;
        this.metronomeEnabled = false;
        this.metronomeBPM = 120;
        this.metronomeInterval = null;
        this.reverbAmount = 0;
        this.delayAmount = 0;
        this.instrumentType = 'piano';
        this.tracks = [];
        this.currentTrack = 0;
        this.selectedScale = null;
        this.tempo = 120;
        this.waveformAnalyser = null;
        this.init();
    }

    init() {
        // Initialize Web Audio API
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error('Web Audio API not supported');
            return;
        }

        this.initBeat();
        this.createKeyboard();
        this.setupControls();
        this.setupVolumeControl();
    }

    createKeyboard() {
        const keyboard = document.getElementById('pianoKeyboard');
        if (!keyboard) return;

        // Full piano keys configuration (3+ octaves)
        const keys = [
            // First Octave
            { note: 'C1', key: 'q', frequency: 130.81, white: true },
            { note: 'C#1', key: '2', frequency: 138.59, white: false },
            { note: 'D1', key: 'w', frequency: 146.83, white: true },
            { note: 'D#1', key: '3', frequency: 155.56, white: false },
            { note: 'E1', key: 'e', frequency: 164.81, white: true },
            { note: 'F1', key: 'r', frequency: 174.61, white: true },
            { note: 'F#1', key: '5', frequency: 185.00, white: false },
            { note: 'G1', key: 't', frequency: 196.00, white: true },
            { note: 'G#1', key: '6', frequency: 207.65, white: false },
            { note: 'A1', key: 'y', frequency: 220.00, white: true },
            { note: 'A#1', key: '7', frequency: 233.08, white: false },
            { note: 'B1', key: 'u', frequency: 246.94, white: true },
            // Second Octave
            { note: 'C2', key: 'i', frequency: 261.63, white: true },
            { note: 'C#2', key: '9', frequency: 277.18, white: false },
            { note: 'D2', key: 'o', frequency: 293.66, white: true },
            { note: 'D#2', key: '0', frequency: 311.13, white: false },
            { note: 'E2', key: 'p', frequency: 329.63, white: true },
            { note: 'F2', key: '[', frequency: 349.23, white: true },
            { note: 'F#2', key: '=', frequency: 369.99, white: false },
            { note: 'G2', key: ']', frequency: 392.00, white: true },
            { note: 'G#2', key: '\\', frequency: 415.30, white: false },
            { note: 'A2', key: 'a', frequency: 440.00, white: true },
            { note: 'A#2', key: 's', frequency: 466.16, white: false },
            { note: 'B2', key: 'd', frequency: 493.88, white: true },
            // Third Octave
            { note: 'C3', key: 'f', frequency: 523.25, white: true },
            { note: 'C#3', key: 'g', frequency: 554.37, white: false },
            { note: 'D3', key: 'h', frequency: 587.33, white: true },
            { note: 'D#3', key: 'j', frequency: 622.25, white: false },
            { note: 'E3', key: 'k', frequency: 659.25, white: true },
            { note: 'F3', key: 'l', frequency: 698.46, white: true },
            { note: 'F#3', key: ';', frequency: 739.99, white: false },
            { note: 'G3', key: "'", frequency: 783.99, white: true },
            { note: 'G#3', key: 'z', frequency: 830.61, white: false },
            { note: 'A3', key: 'x', frequency: 880.00, white: true },
            { note: 'A#3', key: 'c', frequency: 932.33, white: false },
            { note: 'B3', key: 'v', frequency: 987.77, white: true },
            // Fourth Octave
            { note: 'C4', key: 'b', frequency: 1046.50, white: true },
            { note: 'C#4', key: 'n', frequency: 1108.73, white: false },
            { note: 'D4', key: 'm', frequency: 1174.66, white: true },
            { note: 'D#4', key: ',', frequency: 1244.51, white: false },
            { note: 'E4', key: '.', frequency: 1318.51, white: true },
            { note: 'F4', key: '/', frequency: 1396.91, white: true },
            // Additional keys for mobile - numbers and special keys
            { note: 'G4', key: '1', frequency: 1567.98, white: true },
            { note: 'G#4', key: '4', frequency: 1661.22, white: false },
            { note: 'A4', key: '8', frequency: 1760.00, white: true },
        ];

        // Create white keys container
        const whiteKeysContainer = document.createElement('div');
        whiteKeysContainer.className = 'white-keys';
        
        // Create black keys container
        const blackKeysContainer = document.createElement('div');
        blackKeysContainer.className = 'black-keys';

        // First pass: create all white keys and track their positions
        const whiteKeyPositions = {};
        let whiteKeyCount = 0;
        
        keys.forEach((keyConfig, index) => {
            if (keyConfig.white) {
                const key = document.createElement('div');
                key.className = 'piano-key white-key';
                key.dataset.note = keyConfig.note;
                key.dataset.frequency = keyConfig.frequency;
                key.dataset.key = keyConfig.key;
                
                // Display note label (remove octave number for display)
                const noteLabel = keyConfig.note.replace(/[0-9]/g, '');
                key.textContent = noteLabel;
                
                // Add keyboard shortcut hint
                const keyHint = document.createElement('div');
                keyHint.style.cssText = `
                    position: absolute;
                    top: 10px;
                    font-size: 0.7rem;
                    color: #999;
                    font-weight: 400;
                `;
                keyHint.textContent = keyConfig.key.toUpperCase();
                key.appendChild(keyHint);
                
                // Mouse events
                key.addEventListener('mousedown', () => this.playNote(keyConfig.frequency, keyConfig.note, key));
                key.addEventListener('mouseup', () => this.stopNote(keyConfig.note));
                key.addEventListener('mouseleave', () => this.stopNote(keyConfig.note));
                
                // Touch events
                key.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.playNote(keyConfig.frequency, keyConfig.note, key);
                });
                key.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.stopNote(keyConfig.note);
                });
                
                whiteKeysContainer.appendChild(key);
                whiteKeyPositions[keyConfig.note] = whiteKeyCount * 65;
                whiteKeyCount++;
            }
        });
        
        // Second pass: create black keys positioned correctly
        keys.forEach((keyConfig, index) => {
            if (!keyConfig.white) {
                const key = document.createElement('div');
                key.className = 'piano-key black-key';
                key.dataset.note = keyConfig.note;
                key.dataset.frequency = keyConfig.frequency;
                key.dataset.key = keyConfig.key;
                
                // Calculate position based on the white key before it
                const noteName = keyConfig.note.replace(/[0-9]/g, '');
                const octave = parseInt(keyConfig.note.replace(/\D/g, '')) || 1;
                
                // Find the white key this black key should be positioned after
                let baseNote = '';
                let offset = 0;
                
                if (noteName === 'C#') {
                    baseNote = `C${octave}`;
                    offset = 0.65; // Position after C, slightly to the right
                } else if (noteName === 'D#') {
                    baseNote = `D${octave}`;
                    offset = 0.65;
                } else if (noteName === 'F#') {
                    baseNote = `F${octave}`;
                    offset = 0.65;
                } else if (noteName === 'G#') {
                    baseNote = `G${octave}`;
                    offset = 0.65;
                } else if (noteName === 'A#') {
                    baseNote = `A${octave}`;
                    offset = 0.65;
                }
                
                // Find position of base white key
                let position = 0;
                if (whiteKeyPositions[baseNote] !== undefined) {
                    position = whiteKeyPositions[baseNote] + (offset * 65);
                } else {
                    // Fallback: count white keys before this black key
                    const whiteKeysBefore = keys.slice(0, index).filter(k => k.white);
                    position = whiteKeysBefore.length * 65 + 40;
                }
                
                key.style.left = `${position}px`;
                
                // Mouse events
                key.addEventListener('mousedown', () => this.playNote(keyConfig.frequency, keyConfig.note, key));
                key.addEventListener('mouseup', () => this.stopNote(keyConfig.note));
                key.addEventListener('mouseleave', () => this.stopNote(keyConfig.note));
                
                // Touch events
                key.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.playNote(keyConfig.frequency, keyConfig.note, key);
                });
                key.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.stopNote(keyConfig.note);
                });
                
                blackKeysContainer.appendChild(key);
            }
        });

        keyboard.appendChild(whiteKeysContainer);
        keyboard.appendChild(blackKeysContainer);

        // Keyboard events
        // Store references to event handlers so we can remove them
        this.keyboardKeyDownHandler = (e) => {
            // Don't capture keys if keyboard mode is disabled
            if (!this.keyboardModeEnabled) return;
            
            // Don't capture keys if user is typing in an input field
            const activeElement = document.activeElement;
            if (activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.tagName === 'SELECT' ||
                activeElement.isContentEditable
            )) {
                return;
            }
            
            const key = keys.find(k => k.key === e.key.toLowerCase());
            if (key) {
                e.preventDefault();
                const keyElement = keyboard.querySelector(`[data-key="${key.key}"]`);
                if (keyElement && !this.oscillators[key.note]) {
                    this.playNote(key.frequency, key.note, keyElement);
                }
            }
        };

        this.keyboardKeyUpHandler = (e) => {
            // Don't capture keys if keyboard mode is disabled
            if (!this.keyboardModeEnabled) return;
            
            // Don't capture keys if user is typing in an input field
            const activeElement = document.activeElement;
            if (activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.tagName === 'SELECT' ||
                activeElement.isContentEditable
            )) {
                return;
            }
            
            const key = keys.find(k => k.key === e.key.toLowerCase());
            if (key) {
                e.preventDefault();
                this.stopNote(key.note);
            }
        };

        document.addEventListener('keydown', this.keyboardKeyDownHandler);
        document.addEventListener('keyup', this.keyboardKeyUpHandler);
    }

    playNote(frequency, note, keyElement) {
        if (!this.audioContext) return;
        if (this.oscillators[note]) return;

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        // Handle chord mode
        if (this.chordModeEnabled && this.currentChord) {
            this.playChord(this.currentChord, keyElement);
            return;
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        // Set oscillator type based on instrument
        const oscType = (this.getOscillatorType && typeof this.getOscillatorType === 'function') 
            ? this.getOscillatorType() 
            : 'sine';
        oscillator.type = oscType;
        oscillator.frequency.value = frequency;
        
        // Create effects chain
        let lastNode = gainNode;
        
        // Add delay if enabled
        if (this.delayAmount > 0) {
            const delayNode = this.audioContext.createDelay();
            const delayGain = this.audioContext.createGain();
            delayNode.delayTime.value = 0.3;
            delayGain.gain.value = this.delayAmount / 100;
            delayNode.connect(delayGain);
            delayGain.connect(gainNode);
            lastNode = delayGain;
        }
        
        // Add reverb if enabled
        if (this.reverbAmount > 0) {
            const convolver = this.audioContext.createConvolver();
            const reverbGain = this.audioContext.createGain();
            reverbGain.gain.value = this.reverbAmount / 100;
            // Simple reverb using delay
            const reverbDelay = this.audioContext.createDelay();
            reverbDelay.delayTime.value = 0.5;
            const reverbFeedback = this.audioContext.createGain();
            reverbFeedback.gain.value = 0.3;
            reverbDelay.connect(reverbFeedback);
            reverbFeedback.connect(reverbDelay);
            reverbDelay.connect(reverbGain);
            gainNode.connect(reverbDelay);
            lastNode = reverbGain;
        }
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        oscillator.connect(gainNode);
        lastNode.connect(this.audioContext.destination);

        oscillator.start();
        this.oscillators[note] = { oscillator, gainNode };

        if (keyElement) {
            keyElement.classList.add('active');
        }

        // Update visual feedback
        this.updateCurrentNote(note);

        if (this.isRecording) {
            this.recordedNotes.push({
                note,
                frequency,
                startTime: Date.now(),
                duration: null
            });
        }
    }

    getOscillatorType() {
        const types = {
            'piano': 'sine',
            'organ': 'square',
            'synth': 'sawtooth',
            'strings': 'triangle'
        };
        return types[this.instrumentType] || 'sine';
    }

    stopNote(note) {
        if (this.oscillators[note]) {
            const { oscillator, gainNode } = this.oscillators[note];
            
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            oscillator.stop(this.audioContext.currentTime + 0.1);
            
            delete this.oscillators[note];

            // Remove visual feedback
            const keyElement = document.querySelector(`[data-note="${note}"]`);
            if (keyElement) {
                keyElement.classList.remove('active');
            }

            // Update recorded note duration
            if (this.isRecording && this.recordedNotes.length > 0) {
                const lastNote = this.recordedNotes[this.recordedNotes.length - 1];
                if (lastNote.note === note && !lastNote.duration) {
                    lastNote.duration = Date.now() - lastNote.startTime;
                }
            }
        }
    }

    setupControls() {
        const clearBtn = document.getElementById('clearPiano');
        const recordBtn = document.getElementById('recordPiano');
        const playBtn = document.getElementById('playRecorded');
        const beatBtn = document.getElementById('playBeat');
        const keyboardToggle = document.getElementById('keyboardToggle');
        const keyboardStatus = document.getElementById('keyboardStatus');

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                // Stop all notes
                Object.keys(this.oscillators).forEach(note => this.stopNote(note));
                this.recordedNotes = [];
                recordBtn.textContent = 'Record';
                this.isRecording = false;
            });
        }

        if (recordBtn) {
            recordBtn.addEventListener('click', () => {
                this.isRecording = !this.isRecording;
                if (this.isRecording) {
                    this.recordedNotes = [];
                    recordBtn.textContent = 'Stop Recording';
                    recordBtn.style.background = 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)';
                } else {
                    recordBtn.textContent = 'Record';
                    recordBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }
            });
        }

        if (playBtn) {
            playBtn.addEventListener('click', () => {
                if (this.recordedNotes.length === 0) {
                    alert('No recorded notes. Record something first!');
                    return;
                }
                this.playRecorded();
            });
        }

        if (beatBtn) {
            beatBtn.addEventListener('click', () => {
                this.toggleBeat();
            });
        }

        if (keyboardToggle && keyboardStatus) {
            keyboardToggle.addEventListener('click', () => {
                this.keyboardModeEnabled = !this.keyboardModeEnabled;
                keyboardStatus.textContent = this.keyboardModeEnabled ? 'ON' : 'OFF';
                
                if (this.keyboardModeEnabled) {
                    keyboardToggle.style.background = 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)';
                    keyboardToggle.title = 'Keyboard piano mode: ON - Click to turn OFF. You can now play piano with your keyboard (Q-P, A-L). Typing in forms will still work normally.';
                } else {
                    keyboardToggle.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    keyboardToggle.title = 'Keyboard piano mode: OFF - Click to turn ON';
                }
            });
        }
    }

    playRecorded() {
        if (this.recordedNotes.length === 0) return;

        this.recordedNotes.forEach((recordedNote, index) => {
            const delay = index === 0 ? 0 : recordedNote.startTime - this.recordedNotes[0].startTime;
            
            setTimeout(() => {
                const keyElement = document.querySelector(`[data-note="${recordedNote.note}"]`);
                this.playNote(recordedNote.frequency, recordedNote.note, keyElement);
                
                if (recordedNote.duration) {
                    setTimeout(() => {
                        this.stopNote(recordedNote.note);
                    }, recordedNote.duration);
                } else {
                    setTimeout(() => {
                        this.stopNote(recordedNote.note);
                    }, 500);
                }
            }, delay);
        });
    }

    setupVolumeControl() {
        const volumeSlider = document.getElementById('pianoVolume');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.volume = e.target.value / 100;
                // Update beat volume too
                if (this.beatGainNode) {
                    this.beatGainNode.gain.value = (e.target.value / 100) * 0.3;
                }
            });
        }
    }

    // Beat/Backing track functionality
    initBeat() {
        this.beatOscillator = null;
        this.beatGainNode = null;
        this.isBeatPlaying = false;
        this.beatPattern = 'kick'; // 'kick', 'hihat', 'snare', 'off'
        this.beatTimeoutId = null;
        this.scheduledBeats = [];
    }

    playBeat() {
        if (!this.audioContext) return;
        if (this.isBeatPlaying) return;

        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.isBeatPlaying = true;
        const beatBtn = document.getElementById('playBeat');
        if (beatBtn) {
            beatBtn.textContent = '⏹️ Stop Beat';
            beatBtn.style.background = 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)';
        }

        // Create more lively drum sounds
        const playKick = (time) => {
            if (!this.isBeatPlaying) return;
            
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(80, time);
            osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);
            
            gain.gain.setValueAtTime(0.5 * this.volume, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.start(time);
            osc.stop(time + 0.4);
        };

        const playHiHat = (time, isOpen = false) => {
            if (!this.isBeatPlaying) return;
            
            const bufferSize = this.audioContext.sampleRate * (isOpen ? 0.2 : 0.05);
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
            }
            
            const noise = this.audioContext.createBufferSource();
            const filter = this.audioContext.createBiquadFilter();
            const gain = this.audioContext.createGain();
            
            noise.buffer = buffer;
            filter.type = 'highpass';
            filter.frequency.value = 8000;
            filter.Q.value = 1;
            
            noise.connect(filter);
            filter.connect(gain);
            
            gain.gain.setValueAtTime((isOpen ? 0.2 : 0.18) * this.volume, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + (isOpen ? 0.2 : 0.08));
            
            gain.connect(this.audioContext.destination);
            noise.start(time);
            noise.stop(time + (isOpen ? 0.2 : 0.08));
        };

        const playSnare = (time) => {
            if (!this.isBeatPlaying) return;
            
            // Snare with noise and tone
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'square';
            osc.frequency.setValueAtTime(250, time);
            osc.frequency.exponentialRampToValueAtTime(150, time + 0.08);
            
            gain.gain.setValueAtTime(0.35 * this.volume, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.start(time);
            osc.stop(time + 0.2);
            
            // Add snare noise
            const bufferSize = this.audioContext.sampleRate * 0.15;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
            }
            
            const noise = this.audioContext.createBufferSource();
            const filter = this.audioContext.createBiquadFilter();
            const noiseGain = this.audioContext.createGain();
            
            noise.buffer = buffer;
            filter.type = 'bandpass';
            filter.frequency.value = 2000;
            filter.Q.value = 2;
            
            noise.connect(filter);
            filter.connect(noiseGain);
            
            noiseGain.gain.setValueAtTime(0.25 * this.volume, time);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
            
            noiseGain.connect(this.audioContext.destination);
            noise.start(time);
            noise.stop(time + 0.15);
        };

        const playOpenHiHat = (time) => {
            playHiHat(time, true);
        };

        // More lively 4/4 beat pattern at 120 BPM with variations
        const bpm = 120;
        const beatInterval = 60 / bpm; // 0.5 seconds per beat
        const sixteenthNote = beatInterval / 4; // 0.125 seconds
        let beatCount = 0;
        
        const scheduleBeat = () => {
            if (!this.isBeatPlaying) {
                return;
            }
            
            const currentTime = this.audioContext.currentTime;
            const startTime = currentTime;
            
            // Kick on beats 1 and 3 (strong)
            if (beatCount % 4 === 0 || beatCount % 4 === 2) {
                playKick(startTime);
            }
            
            // Snare on beats 2 and 4
            if (beatCount % 4 === 1 || beatCount % 4 === 3) {
                playSnare(startTime);
            }
            
            // Hi-hat pattern - more lively with variations
            if (beatCount % 4 === 0) {
                // Beat 1: Hi-hat on the beat
                playHiHat(startTime);
                playHiHat(startTime + sixteenthNote * 2);
            } else if (beatCount % 4 === 1) {
                // Beat 2: Hi-hat with off-beat
                playHiHat(startTime);
                playHiHat(startTime + sixteenthNote * 2);
                playHiHat(startTime + sixteenthNote * 3);
            } else if (beatCount % 4 === 2) {
                // Beat 3: Hi-hat pattern
                playHiHat(startTime);
                playHiHat(startTime + sixteenthNote * 1.5);
                playHiHat(startTime + sixteenthNote * 3);
            } else {
                // Beat 4: Hi-hat with accent
                playHiHat(startTime);
                playHiHat(startTime + sixteenthNote * 2);
                playOpenHiHat(startTime + sixteenthNote * 3.5);
            }
            
            beatCount++;
            
            // Schedule next beat
            if (this.isBeatPlaying) {
                this.beatTimeoutId = setTimeout(() => {
                    scheduleBeat();
                }, beatInterval * 1000);
            }
        };

        // Start the pattern immediately
        scheduleBeat();
    }

    stopBeat() {
        // Stop the beat immediately
        this.isBeatPlaying = false;
        
        // Clear any scheduled beats
        if (this.beatTimeoutId) {
            clearTimeout(this.beatTimeoutId);
            this.beatTimeoutId = null;
        }
        
        // Update button
        const beatBtn = document.getElementById('playBeat');
        if (beatBtn) {
            beatBtn.textContent = '🎵 Play Beat';
            beatBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    }

    toggleBeat() {
        if (this.isBeatPlaying) {
            this.stopBeat();
        } else {
            this.playBeat();
        }
    }
}

// Initialize piano when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pianoInstance = new Piano();
    
    // Setup all beginner-friendly features after piano is initialized
    setTimeout(() => {
        if (window.pianoInstance && typeof window.pianoInstance.setupHelperTabs === 'function') {
            window.pianoInstance.setupHelperTabs();
        }
        if (window.pianoInstance && typeof window.pianoInstance.setupMetronome === 'function') {
            window.pianoInstance.setupMetronome();
        }
        if (window.pianoInstance && typeof window.pianoInstance.setupChordMode === 'function') {
            window.pianoInstance.setupChordMode();
        }
        if (window.pianoInstance && typeof window.pianoInstance.setupMelodies === 'function') {
            window.pianoInstance.setupMelodies();
        }
        if (window.pianoInstance && typeof window.pianoInstance.setupEffects === 'function') {
            window.pianoInstance.setupEffects();
        }
        if (window.pianoInstance && typeof window.pianoInstance.setupAdvancedFeatures === 'function') {
            window.pianoInstance.setupAdvancedFeatures();
        }
        if (window.pianoInstance && typeof window.pianoInstance.setupVisualFeedback === 'function') {
            window.pianoInstance.setupVisualFeedback();
        }
        if (window.pianoInstance && typeof window.pianoInstance.setupVirtualKeyboard === 'function') {
            window.pianoInstance.setupVirtualKeyboard();
        }
        if (window.pianoInstance && typeof window.pianoInstance.setupScaleHelper === 'function') {
            window.pianoInstance.setupScaleHelper();
        }
    }, 200);
});

