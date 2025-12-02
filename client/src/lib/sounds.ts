class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;

  constructor() {
    this.loadSound('merge', '/sounds/success.mp3');
    this.loadSound('click', '/sounds/hit.mp3');
  }

  private loadSound(name: string, path: string) {
    const audio = new Audio(path);
    audio.preload = 'auto';
    this.sounds.set(name, audio);
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

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  getMuted() {
    return this.isMuted;
  }

  playMerge() {
    this.play('merge', 0.5);
  }

  playClick() {
    this.play('click', 0.3);
  }

  playSuccess() {
    this.play('merge', 0.6);
  }
}

export const soundManager = new SoundManager();
