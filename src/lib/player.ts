// Web Audio API engine for high-quality audio playback with EQ

class AudioEngine {
  private _audioContext: AudioContext | null = null;
  private _audioElement: HTMLAudioElement | null = null;
  private _bassFilter: BiquadFilterNode | null = null;
  private _midFilter: BiquadFilterNode | null = null;
  private _trebleFilter: BiquadFilterNode | null = null;
  private _gainNode: GainNode | null = null;
  private _analyserNode: AnalyserNode | null = null;
  private _onTimeUpdate: ((time: number) => void) | null = null;
  private _onEnded: (() => void) | null = null;
  private _onLoad: (() => void) | null = null;

  get isInitialized(): boolean {
    return this._audioElement !== null;
  }

  get audioContext(): AudioContext | null {
    return this._audioContext;
  }

  get analyser(): AnalyserNode | null {
    return this._analyserNode;
  }

  init(): void {
    if (this._audioElement) return;

    this._audioElement = new Audio();
    this._audioElement.crossOrigin = 'anonymous';
    this._audioElement.preload = 'auto';

    // Set up Web Audio API chain
    this._audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = this._audioContext.createMediaElementSource(this._audioElement);

    // Create EQ filters
    this._bassFilter = this._audioContext.createBiquadFilter();
    this._bassFilter.type = 'lowshelf';
    this._bassFilter.frequency.value = 200;

    this._midFilter = this._audioContext.createBiquadFilter();
    this._midFilter.type = 'peaking';
    this._midFilter.frequency.value = 1000;
    this._midFilter.Q.value = 1;

    this._trebleFilter = this._audioContext.createBiquadFilter();
    this._trebleFilter.type = 'highshelf';
    this._trebleFilter.frequency.value = 3000;

    this._gainNode = this._audioContext.createGain();
    this._analyserNode = this._audioContext.createAnalyser();
    this._analyserNode.fftSize = 256;

    // Connect: source -> bass -> mid -> treble -> gain -> analyser -> destination
    source.connect(this._bassFilter);
    this._bassFilter.connect(this._midFilter);
    this._midFilter.connect(this._trebleFilter);
    this._trebleFilter.connect(this._gainNode);
    this._gainNode.connect(this._analyserNode);
    this._analyserNode.connect(this._audioContext.destination);

    this._audioElement.addEventListener('timeupdate', () => {
      if (this._onTimeUpdate) {
        this._onTimeUpdate(this._audioElement!.currentTime);
      }
    });

    this._audioElement.addEventListener('ended', () => {
      if (this._onEnded) this._onEnded();
    });

    this._audioElement.addEventListener('loadedmetadata', () => {
      if (this._onLoad) this._onLoad();
    });

    this._audioElement.addEventListener('error', (e) => {
      console.error('Audio element error:', e);
    });
  }

  load(url: string): void {
    if (!this._audioElement) return;
    this._audioElement.src = url;
    this._audioElement.load();
  }

  play(): void {
    if (!this._audioElement) return;
    if (this._audioContext?.state === 'suspended') {
      this._audioContext.resume();
    }
    this._audioElement.play().catch(console.error);
  }

  pause(): void {
    this._audioElement?.pause();
  }

  stop(): void {
    if (this._audioElement) {
      this._audioElement.pause();
      this._audioElement.currentTime = 0;
    }
  }

  seek(time: number): void {
    if (this._audioElement) {
      this._audioElement.currentTime = time;
    }
  }

  setVolume(volume: number): void {
    if (this._gainNode) {
      this._gainNode.gain.value = volume;
    }
  }

  setEq(bass: number, mid: number, treble: number): void {
    if (this._bassFilter) this._bassFilter.gain.value = bass;
    if (this._midFilter) this._midFilter.gain.value = mid;
    if (this._trebleFilter) this._trebleFilter.gain.value = treble;
  }

  get currentTime(): number {
    return this._audioElement?.currentTime || 0;
  }

  get duration(): number {
    return this._audioElement?.duration || 0;
  }

  get isPlaying(): boolean {
    return this._audioElement ? !this._audioElement.paused : false;
  }

  onTimeUpdate(callback: (time: number) => void): void {
    this._onTimeUpdate = callback;
  }

  onEnded(callback: () => void): void {
    this._onEnded = callback;
  }

  onLoad(callback: () => void): void {
    this._onLoad = callback;
  }

  destroy(): void {
    this._audioElement?.pause();
    this._audioElement?.remove();
    this._audioContext?.close();
    this._audioElement = null;
    this._audioContext = null;
    this._bassFilter = null;
    this._midFilter = null;
    this._trebleFilter = null;
    this._gainNode = null;
    this._analyserNode = null;
  }
}

export const audioEngine = new AudioEngine();
