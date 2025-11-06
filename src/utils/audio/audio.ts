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

export function pcm16ToWavBase64(base64Pcm: string, sampleRate = 24000, channels = 1): string {
    const pcm = Uint8Array.from(atob(base64Pcm), c => c.charCodeAt(0));
    const bytesPerSample = 2;
    const blockAlign = channels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = pcm.byteLength;
    const wavSize = 44 + dataSize;

    const header = new ArrayBuffer(44);
    const dv = new DataView(header);

    let p = 0;
    // "RIFF"
    dv.setUint32(p, 0x46464952, true); p += 4;
    // file size - 8
    dv.setUint32(p, wavSize - 8, true); p += 4;
    // "WAVE"
    dv.setUint32(p, 0x45564157, true); p += 4;
    // "fmt "
    dv.setUint32(p, 0x20746d66, true); p += 4;
    // fmt chunk size
    dv.setUint32(p, 16, true); p += 4;
    // audio format (1 = PCM)
    dv.setUint16(p, 1, true); p += 2;
    // channels
    dv.setUint16(p, channels, true); p += 2;
    // sample rate
    dv.setUint32(p, sampleRate, true); p += 4;
    // byte rate
    dv.setUint32(p, byteRate, true); p += 4;
    // block align
    dv.setUint16(p, blockAlign, true); p += 2;
    // bits per sample
    dv.setUint16(p, 16, true); p += 2;
    // "data"
    dv.setUint32(p, 0x61746164, true); p += 4;
    // data size
    dv.setUint32(p, dataSize, true); p += 4;

    // join header + pcm
    const wav = new Uint8Array(wavSize);
    wav.set(new Uint8Array(header), 0);
    wav.set(pcm, 44);

    // to base64
    let s = '';
    for (let i = 0; i < wav.length; i++) {
        s += String.fromCharCode(wav[i]);
    };

    return btoa(s);
}