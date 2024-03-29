"use client";

type LoadedCallback = (id: string, duration: number) => void;

export default class Track {
  id: string;
  context: AudioContext;
  buffer?: AudioBuffer;
  sourceNode?: AudioBufferSourceNode;
  gainNode?: GainNode;

  constructor(
    context: AudioContext,
    url: string,
    id: string,
    loadedCallback: LoadedCallback
  ) {
    this.id = id;
    this.context = context;

    this.load(url, loadedCallback);
  }

  load(url: string, loadedCallback: LoadedCallback) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error, status = ${response.status}`);
        }
        return response.arrayBuffer();
      })
      .then((buffer) => this.context.decodeAudioData(buffer))
      .then((decodedData) => {
        this.buffer = decodedData;
        loadedCallback(this.id, this.buffer.duration);
        this.connect();
      });
  }

  connect() {
    this.sourceNode = this.context.createBufferSource();
    if (this.buffer) {
      this.sourceNode.buffer = this.buffer;
    }
    this.gainNode = this.context.createGain();
    this.sourceNode.connect(this.gainNode).connect(this.context.destination);
    this.sourceNode.onended = () => {
      this.disconnect();
    };
  }

  play(position = 0) {
    this.connect();

    this.sourceNode?.start(0, position);
  }

  stop() {
    this.sourceNode?.stop();
  }

  disconnect() {
    this.sourceNode?.disconnect();
    this.gainNode?.disconnect();
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume;
    }
  }
}
