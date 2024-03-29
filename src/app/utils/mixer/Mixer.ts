"use client";

import Track from "./Track";

export type TrackConfig = {
  url: string;
  id: string;
};

export type LoadedCallback = (duration: number) => void;
export type ProgressChangedCallback = (progress: number) => void;

export default class Mixer {
  context: AudioContext;
  tracks: Record<string, Track>;
  tracksLoaded: number;
  ready: boolean;
  duration: number;
  startedAt: number;
  progressMilliseconds: number;
  playing: boolean;
  onTracksLoaded: LoadedCallback;
  onProgressChanged: ProgressChangedCallback;

  constructor(
    trackConfig: TrackConfig[],
    onTracksLoaded: LoadedCallback,
    onProgressChanged: ProgressChangedCallback
  ) {
    this.context = new window.AudioContext();
    this.tracks = {};
    this.tracksLoaded = 0;
    this.ready = false;
    this.duration = 0;
    this.startedAt = Date.now();
    this.progressMilliseconds = 0;
    this.playing = false;
    this.onTracksLoaded = onTracksLoaded;
    this.onProgressChanged = onProgressChanged;

    trackConfig.forEach((config) => this.addTrack(config));

    window.requestAnimationFrame(() => this.updateProgress());
  }

  updateProgress() {
    if (this.playing) {
      if (this.duration < this.progressMilliseconds / 1000) {
        this.playing = false;
        this.progressMilliseconds = 0;
      } else {
        this.progressMilliseconds = Date.now() - this.startedAt;
      }
      this.onProgressChanged(this.progressMilliseconds / 1000);
    }

    window.requestAnimationFrame(() => this.updateProgress());
  }

  addTrack({ url, id }: TrackConfig) {
    const onTrackLoaded = (id: string, duration: number) => {
      this.tracksLoaded++;
      if (this.tracksLoaded === Object.values(this.tracks).length) {
        this.ready = true;
        this.duration = Math.ceil(duration);
        this.onTracksLoaded(this.duration);
      }
    };

    this.tracks[id] = new Track(this.context, url, id, onTrackLoaded);
  }

  play() {
    this.playing = true;
    this.startedAt = Date.now() - this.progressMilliseconds;
    Object.values(this.tracks).forEach((track) =>
      track.play(this.progressMilliseconds / 1000)
    );
  }

  stop() {
    this.playing = false;
    Object.values(this.tracks).forEach((track) => track.stop());
  }

  changeTrackVolume(id: string, volume: number) {
    this.tracks[id].setVolume(volume);
  }

  changePlayHead(position: number) {
    let wasPlaying = this.playing;

    if (this.playing) {
      this.stop();
    }

    this.progressMilliseconds = position * 1000;

    if (wasPlaying) {
      setTimeout(() => this.play(), 100);
    }
  }
}
