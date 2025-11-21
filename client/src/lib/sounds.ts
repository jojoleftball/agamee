class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private bgMusic: HTMLAudioElement | null = null;
  private isMuted: boolean = false;

  constructor() {
    this.loadSound('merge', '/sounds/success.mp3');
    this.loadSound('click', '/sounds/hit.mp3');
    this.loadSound('background', '/sounds/background.mp3');
  }

  private loadSound(name: string, path: string) {
    const audio = new Audio(path);
    audio.preload = 'auto';
    this.sounds.set(name, audio);
    
    if (name === 'background') {
      this.bgMusic = audio;
      audio.loop = true;
      audio.volume = 0.3;
    }
  }

  play(name: string, volume: number = 1.0) {
    if (this.isMuted) return;
    
    const sound = this.sounds.get(name);
    if (sound) {
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = volume;
      clone.play().catch(() => {});
    }
  }

  playBackground() {
    if (this.bgMusic && !this.isMuted) {
      this.bgMusic.play().catch(() => {});
    }
  }

  stopBackground() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.bgMusic) {
      this.bgMusic.pause();
    } else if (!this.isMuted && this.bgMusic) {
      this.bgMusic.play().catch(() => {});
    }
    return this.isMuted;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.bgMusic) {
      this.bgMusic.pause();
    } else if (!muted && this.bgMusic) {
      this.bgMusic.play().catch(() => {});
    }
  }
}

export const soundManager = new SoundManager();
