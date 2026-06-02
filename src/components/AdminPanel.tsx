import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AdminPanel() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    try {
      // For now, simulating the metadata extraction from the URL since we don't have a full YouTube API integration
      // In a real app, this should be a call to YouTube API via the server
      const response = await fetch('/api/muse/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: "Sample Anime - Episode 1", 
          description: "Official Muse Asia upload", 
          videoId: "sample123",
          publishDate: new Date().toISOString()
        }),
      });
      const data = await response.json();
      setResult(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveToLibrary = async () => {
    if (!result) return;
    try {
      await addDoc(collection(db, 'titles'), {
        ...result,
        status: 'ongoing',
        genres: ['Action'], // mock genre
        createdAt: new Date().toISOString()
      });
      alert('Saved to library!');
      setResult(null);
    } catch (e) {
      console.error(e);
      alert('Error saving');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Muse Importer</h1>
      <input 
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="Paste YouTube Link"
        className="p-2 border rounded w-full mb-4 text-black"
      />
      <button onClick={handleImport} className="bg-blue-500 text-white p-2 rounded" disabled={loading}>
        {loading ? 'Scanning...' : 'Scan Metadata'}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="text-xl font-bold">{result.title}</h2>
          <p>Type: {result.type}</p>
          {result.season && <p>Season: {result.season}</p>}
          {result.episode && <p>Episode: {result.episode}</p>}
          <button onClick={saveToLibrary} className="bg-green-500 text-white p-2 mt-4 rounded">
            Confirm and Save
          </button>
        </div>
      )}
    </div>
  );
}
