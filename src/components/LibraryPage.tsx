import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Anime {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  genres: string[];
}

export default function LibraryPage() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const q = query(collection(db, 'anime'));
        const querySnapshot = await getDocs(q);
        const data: Anime[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Anime));
        setAnimeList(data);
      } catch (e) {
        console.error("Error fetching anime:", e);
      }
    };
    fetchAnime();
  }, []);

  const filteredAnime = animeList.filter(anime => {
    const matchesSearch = anime.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || anime.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || anime.status === statusFilter;
    const matchesGenre = genreFilter === 'all' || (anime.genres && anime.genres.includes(genreFilter));
    return matchesSearch && matchesType && matchesStatus && matchesGenre;
  });

  const genres = Array.from(new Set(animeList.flatMap(a => a.genres || [])));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Library</h1>
      
      <div className="flex gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search title..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)}
          className="p-2 border rounded text-black"
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="p-2 border rounded text-black">
          <option value="all">All Types</option>
          <option value="series">Series</option>
          <option value="movie">Movie</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="p-2 border rounded text-black">
          <option value="all">All Status</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
        <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)} className="p-2 border rounded text-black">
          <option value="all">All Genres</option>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnime.map(anime => (
          <div key={anime.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold">{anime.title}</h2>
            <p className="text-gray-600">{anime.type} - {anime.status}</p>
            <p className="text-sm mt-2">{anime.genres?.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
