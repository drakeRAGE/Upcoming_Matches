import React from 'react';
import orca from '../assets/orca.png'

const Navbar = () => {
    return (
        <nav className="bg-gray-900/80 backdrop-blur-sm p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <img src={orca} alt="SportsOrca Logo" className="h-8 w-8 object-contain" />
                    <div className="text-white text-2xl font-bold tracking-wide">
                        Sports<span className="text-blue-400">Orca</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;