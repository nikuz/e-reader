import { initializeApp } from 'firebase/app';
import { getAI, GoogleAIBackend } from 'firebase/ai';
import firebaseConfig from './firebase-config.json';

const firebaseApp = initializeApp(firebaseConfig);

// Initialize the Gemini Developer API backend service
export const firebaseAi = getAI(firebaseApp, { backend: new GoogleAIBackend() });