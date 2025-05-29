import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

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
      // Log the raw data received from the backend
      console.log("Raw data received from backend:", rawMatches);

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
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8 drop-shadow-sm">Upcoming Basketball Matches</h1>

      {/* Date Picker and Fetch Button */}
      <div className="flex justify-center items-center mb-12 space-x-4">
        <label htmlFor="match-date" className="text-lg font-medium text-gray-700">Select Date:</label>
        <input
          type="date"
          id="match-date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          // min={today} // Restrict selection to today and future dates
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        />
        <button
          onClick={() => fetchMatches(selectedDate)}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
          disabled={loading} // Disable button while loading
        >
          Fetch Matches
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-between border border-gray-200 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
          >
            {/* League and Country Info */}
            <div className="flex items-center justify-center mb-5 text-gray-600 text-sm font-medium border-b pb-4 border-gray-100">
              {/* We already filtered, so these should exist, but adding ?. for safety */}
              {match.league?.logo && <img src={match.league.logo} alt={match.league.name} className="h-6 w-6 object-contain mr-2" />}
              <span className="text-gray-800">{match.league?.name || 'Unknown League'}</span>
              <span className="mx-2 text-gray-400">|</span>
              {match.country?.flag && <img src={match.country.flag} alt={match.country.name} className="h-4 w-6 object-contain ml-1 border border-gray-300 rounded" />}
              <span className="ml-1 text-gray-800">{match.country?.name || 'Unknown Country'}</span>
            </div>

            {/* Teams and VS */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 text-center flex flex-col items-center px-2">
                {/* We already filtered, so these should exist */}
                <img src={match.teams.home.logo} alt={match.teams.home.name} className="h-24 w-24 object-contain mx-auto mb-3" />
                <p className="font-bold text-xl text-gray-800 truncate w-full">{match.teams.home.name || 'Home Team'}</p>
              </div>
              <div className="mx-4 flex flex-col items-center text-gray-700 font-bold text-3xl">
                VS
                {match.status?.short && <span className="text-sm text-gray-500 mt-2 font-normal">{match.status.short}</span>}
              </div>
              <div className="flex-1 text-center flex flex-col items-center px-2">
                {/* We already filtered, so these should exist */}
                <img src={match.teams.away.logo} alt={match.teams.away.name} className="h-24 w-24 object-contain mx-auto mb-3" />
                <p className="font-bold text-xl text-gray-800 truncate w-full">{match.teams.away.name || 'Away Team'}</p>
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