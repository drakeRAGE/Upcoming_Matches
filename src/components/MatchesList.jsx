import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import datafromData from './Data'; // Import the datafro

// Helper function to check if an image URL is valid
const checkImage = (url) => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false); // Resolve false if URL is null or undefined
      return;
    }
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

const MatchesList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add state for the selected date, initialized to today's date string (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  // Function to fetch matches for a specific date
  const fetchMatches = async (date) => {
    setLoading(true);
    setError(null); // Clear previous errors
    setMatches([]); // Clear previous matches

    try {
      // Pass the selected date as a query parameter
      const response = await axios.get(`http://localhost:5000/api/matches?date=${date}`);

      const rawMatches = response.data;

      const validMatches = [];

      // Check each match for valid image URLs
      for (const match of rawMatches) {
        const homeLogoValid = await checkImage(match.teams?.home?.logo);
        const awayLogoValid = await checkImage(match.teams?.away?.logo);
        const leagueLogoValid = await checkImage(match.league?.logo);
        const countryFlagValid = await checkImage(match.country?.flag);

        // Only include the match if all required images are valid
        if (homeLogoValid && awayLogoValid && leagueLogoValid && countryFlagValid) {
          validMatches.push(match);
        } else {
          // Optional: Log which match was filtered out and why
          console.warn(`Match filtered out due to invalid image URL:`, {
            id: match.id, // Assuming match has an id
            homeLogoValid,
            awayLogoValid,
            leagueLogoValid,
            countryFlagValid
          });
        }
      }

      setMatches(validMatches);

      console.log("Fetched and filtered data:", validMatches); // Log filtered data
      setLoading(false);
    } catch (err) {
      console.error("Error fetching matches:", err); // Log the actual error
      setError('Failed to fetch matches. Please try again later.');
      setLoading(false);
    }
  };

  // Fetch matches for the initial date (today) when the component mounts
  useEffect(() => {
    fetchMatches(selectedDate);
  }, []); // Empty dependency array means this runs only once on mount

  // Get today's date in YYYY-MM-DD format for the minimum date input value
  const today = moment().format('YYYY-MM-DD');

  if (loading) return <div className="text-center py-10 text-xl font-semibold text-blue-600">Loading upcoming matches...</div>;
  if (error) return <div className="text-center py-10 text-xl font-semibold text-red-600">{error}</div>;
  // Update the empty state message to be more general
  if (matches.length === 0 && !loading && !error) return <div className="text-center py-10 text-xl font-semibold text-gray-700">No matches found with complete data for the selected date.</div>;


  return (
    <div className="min-h-screen bg-[url('https://tse4.mm.bing.net/th/id/OIP.uD3NA5wuvghK6ll2aAL83AHaE1?rs=1&pid=ImgDetMain')] bg-cover bg-center bg-fixed">
      {/* Overlay */}
      <div className="min-h-screen backdrop-blur-sm">
        {/* Header section */}
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Upcoming <span className="text-blue-400">Basketball</span> Matches
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover exciting basketball games from around the world
            </p>
          </div>

          {/* Date controls */}
          <div className="bg-black/50 p-6 rounded-2xl shadow-xl border border-white/10 max-w-2xl mx-auto mb-16">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <label htmlFor="match-date" className="text-lg font-medium text-white">
                Select Date:
              </label>
              <input
                type="date"
                id="match-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-5 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                onClick={() => fetchMatches(selectedDate)}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : 'Find Matches'}
              </button>
            </div>
          </div>

          {/* Matches grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matches.map((match) => (
              <div
                key={match.id}
                className="relative bg-gray-900/80 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 group"
              >
                {/* Match status badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {match.status?.short || 'UPCOMING'}
                </div>

                {/* League header with gradient */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 flex items-center space-x-3">
                  {match.league?.logo && (
                    <div className="bg-white/10 p-1.5 rounded-lg shadow-inner">
                      <img
                        src={match.league.logo}
                        alt={match.league.name}
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-white text-sm">{match.league?.name}</h3>
                    <div className="flex items-center mt-1">
                      {match.country?.flag && (
                        <img
                          src={match.country.flag}
                          alt={match.country.name}
                          className="h-4 w-6 object-contain rounded border border-gray-500 mr-2"
                        />
                      )}
                      <span className="text-xs text-gray-300">{match.country?.name}</span>
                    </div>
                  </div>
                </div>

                {/* Match content */}
                <div className="p-6">
                  {/* Date and time */}
                  <div className="text-center mb-6">
                    <p className="text-blue-400 font-medium text-sm">
                      {moment(match.date).format('dddd, MMMM Do')}
                    </p>
                    <p className="text-white text-2xl font-bold tracking-tight">
                      {moment(match.date).format('h:mm A')}
                    </p>
                  </div>

                  {/* Teams matchup */}
                  <div className="flex flex-col items-center">
                    <div className="w-full flex justify-between items-center">
                      {/* Home team */}
                      <div className="text-center w-2/5">
                        <div className="relative mx-auto mb-3">
                          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                          <div className="bg-white/5 p-2 rounded-full relative z-10 border border-gray-600/50">
                            <img
                              src={match.teams.home.logo}
                              alt={match.teams.home.name}
                              className="h-16 w-16 mx-auto object-contain"
                            />
                          </div>
                        </div>
                        <p className="font-bold text-white text-sm truncate px-2">{match.teams.home.name}</p>
                      </div>

                      {/* VS separator */}
                      <div className="text-center w-1/5">
                        <div className="relative">
                          <div className="absolute inset-0 bg-blue-600/30 rounded-full blur-md"></div>
                          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-lg shadow-lg relative z-10">
                            VS
                          </div>
                        </div>
                      </div>

                      {/* Away team */}
                      <div className="text-center w-2/5">
                        <div className="relative mx-auto mb-3">
                          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                          <div className="bg-white/5 p-2 rounded-full relative z-10 border border-gray-600/50">
                            <img
                              src={match.teams.away.logo}
                              alt={match.teams.away.name}
                              className="h-16 w-16 mx-auto object-contain"
                            />
                          </div>
                        </div>
                        <p className="font-bold text-white text-sm truncate px-2">{match.teams.away.name}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match footer */}
                <div className="px-4 py-3 bg-gray-800/50 border-t border-gray-700 text-center">
                  <div className="flex justify-center space-x-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Venue</p>
                      <p className="text-sm text-white font-medium">TBD Arena</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Referee</p>
                      <p className="text-sm text-white font-medium">John Smith</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {matches.length === 0 && !loading && !error && (
            <div className="text-center py-16">
              <div className="inline-block p-8 bg-black/50 rounded-2xl border border-white/10 backdrop-blur-sm">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl text-white mt-4">
                  No matches found for selected date
                </p>
                <p className="text-gray-400 mt-2">
                  Try selecting a different date
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchesList;