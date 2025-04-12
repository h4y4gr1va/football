import React from 'react';

export default function StandingsTable({ standings }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-700 text-gray-200 border-b-2 border-gray-600">
            <th className="text-center p-3 w-12">#</th>
            <th className="text-left p-3">Team</th>
            <th className="text-center p-3 w-12">MP</th>
            <th className="text-center p-3 w-12">W</th>
            <th className="text-center p-3 w-12">D</th>
            <th className="text-center p-3 w-12">L</th>
            <th className="text-center p-3 w-12">GF</th>
            <th className="text-center p-3 w-12">GA</th>
            <th className="text-center p-3 w-12">GD</th>
            <th className="text-center p-3 w-16">Pts</th>
            <th className="text-center p-3 w-24">Form</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing) => {
            const goalDifference = standing.goalsFor - standing.goalsAgainst;
            
            // Determine row color based on position for visual grouping
            // (Champions League, Europa League, Relegation, etc.)
            let rowClass = "border-b border-gray-700 hover:bg-gray-700";
            if (standing.position <= 4) rowClass += " bg-gradient-to-r from-blue-900/20 to-transparent";
            else if (standing.position <= 6) rowClass += " bg-gradient-to-r from-orange-900/20 to-transparent";
            else if (standing.position >= standings.length - 3) rowClass += " bg-gradient-to-r from-red-900/20 to-transparent";
            
            return (
              <tr key={standing.position} className={rowClass}>
                <td className="text-center p-3 font-semibold">{standing.position}</td>
                <td className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex-shrink-0">
                      <img 
                        src={standing.team.crest} 
                        alt={`${standing.team.name} logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/api/placeholder/32/32";
                        }}
                      />
                    </div>
                    <span className="font-medium">{standing.team.name}</span>
                  </div>
                </td>
                <td className="text-center p-3">{standing.playedGames}</td>
                <td className="text-center p-3">{standing.won}</td>
                <td className="text-center p-3">{standing.draw}</td>
                <td className="text-center p-3">{standing.lost}</td>
                <td className="text-center p-3">{standing.goalsFor}</td>
                <td className="text-center p-3">{standing.goalsAgainst}</td>
                <td className={`text-center p-3 ${goalDifference > 0 ? 'text-green-400' : goalDifference < 0 ? 'text-red-400' : ''}`}>
                  {goalDifference > 0 ? `+${goalDifference}` : goalDifference}
                </td>
                <td className="text-center p-3 font-bold text-lg">{standing.points}</td>
                <td className="text-center p-3">
                  <div className="flex justify-center space-x-1">
                    {standing.form && standing.form.split(',').map((result, index) => {
                      let bgColor = "bg-gray-500";
                      if (result === "W") bgColor = "bg-green-500";
                      else if (result === "L") bgColor = "bg-red-500";
                      else if (result === "D") bgColor = "bg-yellow-500";
                      
                      return (
                        <div 
                          key={index} 
                          className={`w-6 h-6 ${bgColor} rounded-full flex items-center justify-center text-xs font-bold`}
                          title={result === "W" ? "Win" : result === "L" ? "Loss" : "Draw"}
                        >
                          {result}
                        </div>
                      );
                    })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-400 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-900/20 to-transparent mr-2"></div>
          <span>Champions League</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-orange-900/20 to-transparent mr-2"></div>
          <span>Europa League</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-red-900/20 to-transparent mr-2"></div>
          <span>Relegation</span>
        </div>
      </div>
      
      <div className="mt-4 text-gray-400 text-sm">
        <p>MP: Matches Played, W: Won, D: Draw, L: Lost, GF: Goals For, GA: Goals Against, GD: Goal Difference, Pts: Points</p>
      </div>
    </div>
  );
}