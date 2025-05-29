import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const MatchesList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/matches');
        
        // Filter matches to only include those with all required image URLs
        const filteredMatches = response.data.filter(match => 
          match.teams?.home?.logo && 
          match.teams?.away?.logo && 
          match.league?.logo && 
          match.country?.flag
        );

        setMatches(filteredMatches);

        console.log("Fetched and filtered data:", filteredMatches); // Log filtered data
        setLoading(false);
      } catch (err) {
        console.error("Error fetching matches:", err); // Log the actual error
        setError('Failed to fetch matches. Please try again later.');
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <div className="text-center py-10 text-xl font-semibold text-blue-600">Loading upcoming matches...</div>;
  if (error) return <div className="text-center py-10 text-xl font-semibold text-red-600">{error}</div>;
  if (matches.length === 0 && !loading && !error) return <div className="text-center py-10 text-xl font-semibold text-gray-700">No upcoming matches found with complete data for today.</div>;


  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12 drop-shadow-sm">Upcoming Basketball Matches</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-between border border-gray-200 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
          >
            {/* League and Country Info */}
            <div className="flex items-center justify-center mb-5 text-gray-600 text-sm font-medium border-b pb-4 border-gray-100">
                {match.league?.logo && <img src={match.league.logo} alt={match.league.name} className="h-6 w-6 object-contain mr-2" />}
                <span className="text-gray-800">{match.league?.name || 'Unknown League'}</span>
                <span className="mx-2 text-gray-400">|</span>
                {match.country?.flag && <img src={match.country.flag} alt={match.country.name} className="h-4 w-6 object-contain ml-1 border border-gray-300 rounded" />}
                <span className="ml-1 text-gray-800">{match.country?.name || 'Unknown Country'}</span>
            </div>

            {/* Teams and VS */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 text-center flex flex-col items-center px-2">
                {match.teams.home?.logo && <img src={match.teams.home.logo} alt={match.teams.home.name} className="h-24 w-24 object-contain mx-auto mb-3" />}
                <p className="font-bold text-xl text-gray-800 truncate w-full">{match.teams.home?.name || 'Home Team'}</p>
              </div>
              <div className="mx-4 flex flex-col items-center text-gray-700 font-bold text-3xl">
                VS
                {match.status?.short && <span className="text-sm text-gray-500 mt-2 font-normal">{match.status.short}</span>}
              </div>
              <div className="flex-1 text-center flex flex-col items-center px-2">
                {match.teams.away?.logo && <img src={match.teams.away.logo} alt={match.teams.away.name} className="h-24 w-24 object-contain mx-auto mb-3" />}
                <p className="font-bold text-xl text-gray-800 truncate w-full">{match.teams.away?.name || 'Away Team'}</p>
              </div>
            </div>

            {/* Date and Time */}
            <div className="text-center text-gray-700 text-md pt-4 border-t border-gray-100">
              <p className="font-semibold text-gray-800">{moment(match.date).format('MMMM Do YYYY')}</p>
              <p className="text-sm text-gray-600">{moment(match.date).format('h:mm a')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchesList;