import { base64ToArrayBuffer } from '../converter';

export async function playL16ViaWebAudio(data: string, sampleRate = 24000) {
    const audioArrayBuffer = base64ToArrayBuffer(data);
    const audioContext = new window.AudioContext({ sampleRate });
    const numberOfChannels = 1;
    const bytesPerSample = 2; // 16-bit audio

    // Create a new AudioBuffer to hold the decoded audio
    const audioBuffer = audioContext.createBuffer(
        numberOfChannels,
        audioArrayBuffer.byteLength / bytesPerSample, // frame length
        sampleRate
    );

    // Get the raw PCM data and copy it to the AudioBuffer
    const nowBuffering = audioBuffer.getChannelData(0); // For mono
    const dataView = new DataView(audioArrayBuffer);
    for (let i = 0; i < nowBuffering.length; i++) {
        // Read 16-bit signed integer and normalize to -1.0 to 1.0
        nowBuffering[i] = dataView.getInt16(i * bytesPerSample, true) / 32768;
    }

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0); // Play immediately
}