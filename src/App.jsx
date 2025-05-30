import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import moment from 'moment';

// Import your components
import Navbar from './components/Navbar';
import UpcomingMatchesHeader from './components/UpcomingMatchesHeader';
import DateSettings from './components/DateSettings';
import MatchesGrid from './components/MatchesGrid';
import Footer from './components/Footer';

const checkImage = (url) => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const fetchMatches = async (date) => {
    setLoading(true);
    setError(null);
    setMatches([]);

    try {
      const response = await axios.get(`http://localhost:5000/api/matches?date=${date}`);

      const rawMatches = response.data;

      const validMatches = [];
      for (const match of rawMatches) {
        // Check if essential data exists (teams, league, date)
        if (!match.teams?.home?.name || !match.teams?.away?.name || !match.league?.name || !match.date) {
          console.warn(`Match filtered out due to missing essential data:`, match);
          continue;
        }

        // Check images only if essential data is present
        const homeLogoValid = await checkImage(match.teams.home.logo);
        const awayLogoValid = await checkImage(match.teams.away.logo);
        const leagueLogoValid = await checkImage(match.league.logo);
        const countryFlagValid = await checkImage(match.country?.flag);

        // Only include the match if all REQUIRED images are valid (home/away/league logos)
        if (homeLogoValid && awayLogoValid && leagueLogoValid && countryFlagValid) {
          // validMatches.push(match);
          setMatches(prevMatches => [...prevMatches, match]);
        } else {
          console.warn(`Match filtered out due to invalid image URL:`, {
            id: match.id,
            homeLogoValid,
            awayLogoValid,
            leagueLogoValid,
            countryFlagValid
          });
        }
      }

      // setMatches(validMatches);
      console.log("Fetched and filtered data:", validMatches);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError('Failed to fetch matches. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches(selectedDate);
  }, [selectedDate]);

  const filteredAndSortedMatches = useMemo(() => {
    let currentMatches = [...matches];

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentMatches = currentMatches.filter(match =>
        match.teams.home.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        match.teams.away.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        match.league.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        match.country?.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    currentMatches.sort((a, b) => {
      if (sortBy === 'date') {
        return moment(a.date).valueOf() - moment(b.date).valueOf();
      } else if (sortBy === 'league') {
        return a.league.name.localeCompare(b.league.name);
      } else if (sortBy === 'homeTeam') {
        return a.teams.home.name.localeCompare(b.teams.home.name);
      }
      return 0;
    });

    return currentMatches;
  }, [matches, searchTerm, sortBy]);


  const today = moment().format('YYYY-MM-DD');


  return (
    <div className="min-h-screen bg-[url('https://tse4.mm.bing.net/th/id/OIP.uD3NA5wuvghK6ll2aAL83AHaE1?rs=1&pid=ImgDetMain')] bg-cover bg-center bg-fixed flex flex-col"> {/* Added flex-col here */}
      {/* Navbar */}
      <Navbar />

      <div className="min-h-screen backdrop-blur-sm flex-grow">
        <div className="container mx-auto px-6 py-12">

          {/* 1. Upcoming Matches Description */}
          <UpcomingMatchesHeader />

          {/* 2. Date , Sort and Search Component */}
          <DateSettings
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            fetchMatches={fetchMatches}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* 3. Card Component */}
          {filteredAndSortedMatches.length === 0 && !loading && !error ? (
            <div className="text-center py-10 text-xl font-semibold text-gray-700">No matches found matching your criteria for the selected date.</div>
          ) : (
            <MatchesGrid matches={filteredAndSortedMatches} />
          )}

          {/* 4. Loading and Error Handling */}
          {loading && <div className="text-center py-10 text-xl font-serif font-semibold text-blue-700">Fetching Upcoming Events...</div>}
          {error && <div className="text-center py-10 text-xl font-semibold text-red-700">{error}</div>}

        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;