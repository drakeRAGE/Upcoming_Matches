import React from 'react';
import moment from 'moment';

const MatchesGrid = ({ matches }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => (
                <div
                    key={match.id}
                    className="relative bg-gray-900/90 rounded-xl overflow-hidden shadow-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 group hover:shadow-blue-500/30 hover:scale-[1.02]"
                >
                    {/* Match status ribbon */}
                    <div className="absolute top-8 right-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                        {match.status?.long || 'UPCOMING'}
                    </div>

                    {/* League header */}
                    <div className="bg-gray-800/70 p-2 flex items-center justify-between border-b border-blue-600/50 backdrop-blur-sm">
                        {/* Logo on the left */}
                        {match.league?.logo && (
                            <div className="bg-white/10 p-3 rounded-full shadow-md border border-gray-500/30 flex-shrink-0 mr-6">
                                <img
                                    src={match.league.logo}
                                    alt={match.league.name}
                                    className="h-12 w-12 object-contain"
                                />
                            </div>
                        )}

                        {/* Text centered */}
                        <div className="flex-grow text-center">
                            <h3 className="font-bold text-white text-lg tracking-wide leading-tight">{match.league?.name}</h3>
                            <div className="flex items-center justify-center mt-2">
                                {match.country?.flag && (
                                    <img
                                        src={match.country.flag}
                                        alt={match.country.name}
                                        className="h-5 w-7 object-contain rounded border border-gray-500 mr-2"
                                    />
                                )}
                                <span className="text-sm text-gray-300">{match.country?.name}</span>
                            </div>
                        </div>
                        {/* Placeholder for right side if needed, or leave empty */}
                        <div className="w-21 flex-shrink-0"></div>
                    </div>

                    {/* Match content */}
                    <div className="p-6">
                        <div className="text-center mb-6 bg-gray-800/60 rounded-lg py-3 px-4 border border-gray-700/50 shadow-inner">
                            <p className="text-blue-400 font-medium text-sm">
                                {moment(match.date).format('dddd, MMMM Do')}
                            </p>
                            <p className="text-white text-2xl font-bold tracking-tight">
                                {moment(match.date).format('h:mm A')}
                            </p>
                        </div>

                        {/* Teams matchup */}
                        <div className="flex items-center justify-between w-full">
                            {/* Home Team */}
                            <div className="flex flex-col items-center w-5/12 text-center">
                                <div className="relative mb-3">
                                    <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                                    <div className="bg-white/10 p-3 rounded-full relative z-10 border border-gray-600/50 shadow-xl hover:border-blue-500 transition-all transform group-hover:scale-105">
                                        <img
                                            src={match.teams.home.logo}
                                            alt={match.teams.home.name}
                                            className="h-20 w-20 object-contain"
                                        />
                                    </div>
                                </div>
                                <p className="font-bold text-white text-base truncate px-2 mt-2">
                                    {match.teams.home.name}
                                </p>
                            </div>

                            {/* VS Separator */}
                            <div className="flex flex-col items-center justify-center w-2/12">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-600/40 rounded-full blur-md"></div>
                                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-xl shadow-lg relative z-10 border border-blue-500/50 transform group-hover:scale-110 transition-all">
                                        VS
                                    </div>
                                </div>
                            </div>

                            {/* Away Team */}
                            <div className="flex flex-col items-center w-5/12 text-center">
                                <div className="relative mb-3">
                                    <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                                    <div className="bg-white/10 p-3 rounded-full relative z-10 border border-gray-600/50 shadow-xl hover:border-blue-500 transition-all transform group-hover:scale-105">
                                        <img
                                            src={match.teams.away.logo}
                                            alt={match.teams.away.name}
                                            className="h-20 w-20 mx-auto object-contain"
                                        />
                                    </div>
                                </div>
                                <p className="font-bold text-white text-base truncate px-2 mt-2">
                                    {match.teams.away.name}
                                </p>
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
    );
};

export default MatchesGrid;