import express from 'express';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };
import { extractMetadata } from './src/lib/museExtractor';

const app = express();
const port = 3000;

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/muse/import', async (req, res) => {
  const { title, description, videoId, publishDate } = req.body;
  if (!title || !videoId) return res.status(400).json({ error: 'Missing metadata' });
  
  const extracted = extractMetadata({ title, description, videoId, publishDate });
  
  // Logic to save to Firestore would go here
  res.json({ success: true, data: extracted });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
