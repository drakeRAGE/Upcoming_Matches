import React from 'react';
import moment from 'moment';

const DateSettings = ({
    selectedDate,
    setSelectedDate,
    fetchMatches,
    loading,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy
}) => {
    const today = moment().format('YYYY-MM-DD');

    return (
        <div className="bg-black/50 p-6 rounded-2xl shadow-xl border border-white/10 mx-auto mb-10 max-w-5xl">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                {/* Date Picker */}
                <div className="flex flex-col md:flex-row items-center gap-2">
                    <label htmlFor="match-date" className="text-lg font-medium text-white">
                        Select Date:
                    </label>
                    <input
                        type="date"
                        id="match-date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-5 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        min={today}
                    />
                </div>

                {/* Search Input */}
                <div className="flex flex-col md:flex-row items-center gap-2">
                    <label htmlFor="search-term" className="text-lg font-medium text-white sr-only md:not-sr-only">
                        Search:
                    </label>
                    <input
                        type="text"
                        id="search-term"
                        placeholder="Search teams, leagues..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-5 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Sort Dropdown */}
                <div className="flex flex-col md:flex-row items-center gap-2">
                    <label htmlFor="sort-by" className="text-lg font-medium text-white sr-only md:not-sr-only">
                        Sort by:
                    </label>
                    <select
                        id="sort-by"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-5 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                    >
                        <option value="date">Date & Time</option>
                        <option value="league">League</option>
                        <option value="homeTeam">Home Team</option>
                    </select>
                </div>

                {/* Find Matches Button */}
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
    );
};

export default DateSettings;