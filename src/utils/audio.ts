// Web Audio API sounds for physical feedback
class SoundEffects {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public playClick() {
    try {
      this.initCtx();
      if (!this.ctx || !this.enabled) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Ignore audio errors
    }
  }

  public playPaymentSuccess() {
    try {
      this.initCtx();
      if (!this.ctx || !this.enabled) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        
        gain.gain.setValueAtTime(0, now + i * 0.09);
        gain.gain.linearRampToValueAtTime(0.12, now + i * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.35);
        
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.36);
      });
    } catch {
      // Ignore audio errors
    }
  }

  public playPrintDone() {
    try {
      this.initCtx();
      if (!this.ctx || !this.enabled) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      
      const now = this.ctx.currentTime;
      // Soft modern chime
      [587.33, 880, 1174.66].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        
        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.15, now + i * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.6);
        
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.65);
      });
    } catch {
      // Ignore audio errors
    }
  }
}

export const soundEffects = new SoundEffects();
