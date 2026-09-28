/**
 * Procedural Web Audio Sound Generator for Ambient Focus
 * Zero external mp3/asset dependencies. Generated in real-time in the browser.
 */

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private currentTrack: string | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        Math.max(0, Math.min(1, volume)),
        this.ctx.currentTime,
        0.05
      );
    }
  }

  public stop() {
    this.activeNodes.forEach((node) => {
      if (typeof node === "number") {
        clearInterval(node);
      } else {
        try {
          if ("stop" in node && typeof (node as any).stop === "function") {
            (node as any).stop();
          }
          node.disconnect();
        } catch (e) {}
      }
    });
    this.activeNodes = [];
    this.currentTrack = null;
  }

  public play(track: "rain" | "binaural" | "ocean" | "white_noise", volume: number = 0.5) {
    if (typeof window === "undefined") return;
    this.stop();

    const ctx = this.getContext();
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    this.masterGain.connect(ctx.destination);
    this.currentTrack = track;

    if (track === "rain") {
      this.createRainSound(ctx, this.masterGain);
    } else if (track === "binaural") {
      this.createBinauralBeats(ctx, this.masterGain);
    } else if (track === "ocean") {
      this.createOceanWaves(ctx, this.masterGain);
    } else if (track === "white_noise") {
      this.createWhiteNoise(ctx, this.masterGain);
    }
  }

  private createWhiteNoise(ctx: AudioContext, destination: GainNode) {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to soften high hiss
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(destination);
    whiteNoise.start();

    this.activeNodes.push(whiteNoise, filter);
  }

  private createRainSound(ctx: AudioContext, destination: GainNode) {
    const bufferSize = 3 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;

    // Pink noise for rain
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.11;
    }

    const rainSource = ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.Q.setValueAtTime(0.7, ctx.currentTime);

    rainSource.connect(filter);
    filter.connect(destination);
    rainSource.start();

    this.activeNodes.push(rainSource, filter);
  }

  private createOceanWaves(ctx: AudioContext, destination: GainNode) {
    const bufferSize = 4 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, ctx.currentTime);

    // LFO to create swelling wave rhythm
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 sec wave cycle

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(250, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noiseSource.connect(filter);
    filter.connect(destination);

    noiseSource.start();
    lfo.start();

    this.activeNodes.push(noiseSource, filter, lfo, lfoGain);
  }

  private createBinauralBeats(ctx: AudioContext, destination: GainNode) {
    // 200 Hz base carrier, 240 Hz right ear = 40Hz Gamma Focus frequency
    const oscL = ctx.createOscillator();
    const oscR = ctx.createOscillator();

    oscL.type = "sine";
    oscR.type = "sine";
    oscL.frequency.setValueAtTime(216, ctx.currentTime);
    oscR.frequency.setValueAtTime(256, ctx.currentTime); // 40Hz differential

    // Stereo Panners
    const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    if (pannerL && pannerR) {
      pannerL.pan.setValueAtTime(-0.9, ctx.currentTime);
      pannerR.pan.setValueAtTime(0.9, ctx.currentTime);

      oscL.connect(pannerL);
      oscR.connect(pannerR);

      pannerL.connect(destination);
      pannerR.connect(destination);

      this.activeNodes.push(pannerL, pannerR);
    } else {
      oscL.connect(destination);
      oscR.connect(destination);
    }

    oscL.start();
    oscR.start();

    this.activeNodes.push(oscL, oscR);
  }

  public playChime() {
    if (typeof window === "undefined") return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  }

  public isPlaying(track: string) {
    return this.currentTrack === track;
  }
}

export const ambientSound = new AmbientSoundEngine();
