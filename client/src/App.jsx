import { useState, useEffect } from 'react';
import StandingsTable from './components/StandingsTable';

export default function FootballStandings() {
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  
  // Fetch available competitions when component mounts
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/competitions`);
        if (!response.ok) {
          throw new Error('Failed to fetch competitions');
        }
        const data = await response.json();
        // Process data as before
        setCompetitions(data.competitions);
      } catch (err) {
        setError("Failed to fetch competitions. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompetitions();
  }, []);
  
  // Fetch standings for the selected competition
  const fetchStandings = async (competitionId) => {
    try {
      setLoading(true);
      setError(null)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/competitions/${competitionId}/standings`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch standings');
      }
      
      const data = await response.json();
      
      if (data.standings && data.standings.length > 0) {
        // Get the total league standings (typically the first item in the standings array)
        const leagueStandings = data.standings.find(s => s.type === 'TOTAL') || data.standings[0];
        setStandings(leagueStandings.table);
      } else {
        setStandings([]);
        setError("No standings data available for this competition.");
      }
    } catch (err) {
      setError("Failed to fetch standings. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCompetitionSelect = (event) => {
    const competitionId = event.target.value;
    const selected = competitions.find(comp => comp.id === parseInt(competitionId));
    setSelectedCompetition(selected);
    if (selected) {
      fetchStandings(selected.id);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400 mb-2">Football League Standings</h1>
          <p className="text-gray-400">Select a competition to view the current standings</p>
        </header>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="w-full max-w-lg mx-auto">
            <label className="block text-white mb-2">Select Competition</label>
            <select 
              className="w-full bg-gray-700 text-white rounded-md p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleCompetitionSelect}
              defaultValue=""
            >
              <option value="" disabled>Choose a competition</option>
              {competitions.map(comp => (
                <option key={comp.id} value={comp.id}>
                  {comp.name} ({comp.area.name})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {loading && (
          <div className="flex justify-center my-8">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900 border border-red-700 text-white px-4 py-3 rounded-md my-4">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {selectedCompetition && standings.length > 0 && !loading && (
          <div className="bg-gray-800 rounded-lg shadow-lg p-2 sm:p-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-400">
              {selectedCompetition.name} Standings
            </h2>
            
            <StandingsTable standings={standings} />
          </div>
        )}
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Powered by <a href="https://www.football-data.org/" className="text-blue-400 hover:underline">football-data.org</a></p>
        </footer>
      </div>
    </div>
  );
}

