import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import AlithChat from './AlithChat';
import WalletConnection from './WalletConnection';
import { useWeb3 } from './Web3Provider';

interface AIBeing {
  name: string;
  wallet: number;
  reputation: number;
  experienceLevel: number;
  economicStyle: string;
  traits: {
    creativity: number;
    socialness: number;
    riskTaking: number;
    ambition: number;
    empathy: number;
  };
  age: string;
  successRate: string;
  dominantTrait: string;
}

interface SocietyStats {
  totalPopulation: number;
  totalWealth: number;
  averageReputation: number;
  activeCollaborations: number;
  totalInteractions: number;
}

interface SocietyOverview {
  societyStats: SocietyStats;
  topEarners: Array<{ name: string; wallet: number }>;
  mostReputable: Array<{ name: string; reputation: number }>;
  activeProjects: Array<any>;
  recentInteractions: Array<any>;
}

const Dashboard: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [beings, setBeings] = useState<AIBeing[]>([]);
  const [society, setSociety] = useState<SocietyOverview | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [newBeingName, setNewBeingName] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  // Web3 functionality
  const { isConnected: isWalletConnected, mintAIBeing, account } = useWeb3();

  // Trait customization states
  const [showTraitCustomizer, setShowTraitCustomizer] = useState(false);
  const [customTraits, setCustomTraits] = useState({
    creativity: 50,
    socialness: 50,
    riskTaking: 50,
    ambition: 50,
    empathy: 50
  });
  const [alithRecommendedTraits, setAlithRecommendedTraits] = useState<any>(null);
  const [traitSource, setTraitSource] = useState<'random' | 'custom' | 'alith'>('random');

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      addLog('Connected to HyperBeings network');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      addLog('Disconnected from network');
    });

    newSocket.on('society-update', (data: SocietyOverview) => {
      setSociety(data);
      addLog(`Society updated: ${data?.societyStats?.totalPopulation || 0} beings, ${data?.societyStats?.totalWealth || 0} total wealth`);
    });

    newSocket.on('beings-update', (data: AIBeing[]) => {
      setBeings(data || []);
    });

    newSocket.on('new-being', (data: any) => {
      addLog(`${data?.name || 'Unknown'} joined the society!`);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  // Handle Alith trait recommendations
  const handleAlithTraitRecommendation = (traits: any) => {
    setAlithRecommendedTraits(traits);
    setTraitSource('alith');
    addLog(`🧠 Alith recommended optimal traits for ${newBeingName || 'your next AI being'}`);
  };

  const createBeing = async () => {
    if (newBeingName.trim() && socket) {
      let finalTraits;
      let traitSourceText = '';

      // Priority order: Custom > Alith Recommended > Random
      if (traitSource === 'custom') {
        finalTraits = customTraits;
        traitSourceText = '🎯 Using custom traits';
      } else if (traitSource === 'alith' && alithRecommendedTraits) {
        finalTraits = alithRecommendedTraits;
        traitSourceText = '🧠 Using Alith recommended traits';
      } else {
        finalTraits = {
          creativity: Math.floor(Math.random() * 100),
          socialness: Math.floor(Math.random() * 100),
          riskTaking: Math.floor(Math.random() * 100),
          ambition: Math.floor(Math.random() * 100),
          empathy: Math.floor(Math.random() * 100)
        };
        traitSourceText = '🎲 Using randomly generated traits';
      }

      // Determine economic style based on traits
      const getEconomicStyle = (traits: any) => {
        if (traits.riskTaking > 70 && traits.ambition > 60) return "entrepreneur";
        if (traits.creativity > 80) return "creator";
        if (traits.socialness > 75) return "collaborator";
        if (traits.riskTaking < 30) return "saver";
        return "balanced";
      };

      const economicStyle = getEconomicStyle(finalTraits);

      // Create AI being in backend
      socket.emit('create-being', {
        name: newBeingName.trim(),
        traits: finalTraits
      });

      addLog(`Creating ${newBeingName} - ${traitSourceText}`);

      // Try to mint as NFT if wallet is connected
      if (isWalletConnected && account) {
        try {
          addLog(`🎭 Minting ${newBeingName} as NFT on Hyperion...`);
          await mintAIBeing(newBeingName.trim(), finalTraits, economicStyle);
          addLog(`✅ ${newBeingName} minted as NFT successfully!`);
          addLog(`💎 Check your NFT on Hyperion Explorer`);
        } catch (error) {
          console.error('NFT minting failed:', error);
          addLog(`❌ NFT minting failed: ${error instanceof Error ? error.message : 'Transaction failed'}`);
        }
      } else if (!isWalletConnected) {
        addLog(`💡 Connect wallet to mint ${newBeingName} as NFT`);
      }

      // Reset states
      setNewBeingName('');
      setShowTraitCustomizer(false);
      setAlithRecommendedTraits(null);
      setTraitSource('random');
    }
  };

  const toggleSimulation = () => {
    if (socket) {
      if (simulationRunning) {
        socket.emit('stop-simulation');
        setSimulationRunning(false);
        addLog('Simulation paused');
      } else {
        socket.emit('start-simulation');
        setSimulationRunning(true);
        addLog('Real-time simulation started');
      }
    }
  };

  const useCustomTraits = () => {
    setTraitSource('custom');
    setShowTraitCustomizer(false);
    addLog(`🎯 Custom traits ready for ${newBeingName || 'next AI being'}`);
  };

  const resetToRandomTraits = () => {
    setTraitSource('random');
    setAlithRecommendedTraits(null);
    setShowTraitCustomizer(false);
    addLog('🎲 Reset to random trait generation');
  };

  const getTraitColor = (value: number): string => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTraitColorClass = (value: number): string => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    if (value >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getEconomicStyleEmoji = (style: string): string => {
    switch (style) {
      case 'entrepreneur': return '🚀';
      case 'creator': return '🎨';
      case 'saver': return '💰';
      case 'collaborator': return '🤝';
      default: return '⚖️';
    }
  };

  const getCurrentTraits = () => {
    if (traitSource === 'custom') return customTraits;
    if (traitSource === 'alith' && alithRecommendedTraits) return alithRecommendedTraits;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black bg-opacity-30 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🤖</div>
              <div>
                <h1 className="text-3xl font-bold text-white">HyperBeings</h1>
                <p className="text-blue-200">Autonomous AI Society on Hyperion</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                isConnected 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white animate-pulse'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-300'}`} />
                <span className="text-sm font-medium">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              {/* Wallet Status */}
              {isWalletConnected && account && (
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-600 text-white">
                  <div className="w-2 h-2 rounded-full bg-blue-300" />
                  <span className="text-sm font-medium">
                    🔗 {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Society Stats */}
          <div className="lg:col-span-2">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                🏛️ Society Overview
              </h3>
              {society?.societyStats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-600 bg-opacity-30 rounded-xl">
                    <div className="text-3xl font-bold text-white">{society.societyStats.totalPopulation || 0}</div>
                    <div className="text-blue-200 text-sm">AI Beings</div>
                  </div>
                  <div className="text-center p-4 bg-green-600 bg-opacity-30 rounded-xl">
                    <div className="text-3xl font-bold text-white">{society.societyStats.totalWealth || 0}</div>
                    <div className="text-green-200 text-sm">Total Wealth</div>
                  </div>
                  <div className="text-center p-4 bg-purple-600 bg-opacity-30 rounded-xl">
                    <div className="text-3xl font-bold text-white">{society.societyStats.averageReputation || 0}</div>
                    <div className="text-purple-200 text-sm">Avg Reputation</div>
                  </div>
                  <div className="text-center p-4 bg-orange-600 bg-opacity-30 rounded-xl">
                    <div className="text-3xl font-bold text-white">{society.societyStats.activeCollaborations || 0}</div>
                    <div className="text-orange-200 text-sm">Active Projects</div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-600 bg-opacity-30 rounded-xl">
                    <div className="text-3xl font-bold text-gray-400">-</div>
                    <div className="text-gray-400 text-sm">Loading...</div>
                  </div>
                  <div className="text-center p-4 bg-gray-600 bg-opacity-30 rounded-xl">
                    <div className="text-3xl font-bold text-gray-400">-</div>
                    <div className="text-gray-400 text-sm">Loading...</div>
                  </div>
                  <div className="text-center p-4 bg-gray-600 bg-opacity-30 rounded-xl">
                    <div className="text-3xl font-bold text-gray-400">-</div>
                    <div className="text-gray-400 text-sm">Loading...</div>
                  </div>
                  <div className="text-center p-4 bg-gray-600 bg-opacity-30 rounded-xl">
                    <div className="text-3xl font-bold text-gray-400">-</div>
                    <div className="text-gray-400 text-sm">Loading...</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                ⚙️ Controls
              </h3>
              <div className="space-y-4">
                
                {/* NFT Minting Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-opacity-20 border border-blue-500 rounded-xl p-4">
                  <h4 className="text-white font-bold mb-3 flex items-center">
                    🎭 Create AI Being {isWalletConnected && <span className="ml-2 text-xs bg-green-600 px-2 py-1 rounded-full">💎 NFT Enabled</span>}
                  </h4>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter AI Being Name (e.g., Luna, Max, Aria)"
                      value={newBeingName}
                      onChange={(e) => setNewBeingName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && createBeing()}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    {/* Trait Source Indicator */}
                    {traitSource !== 'random' && (
                      <div className="p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-300">
                            {traitSource === 'custom' ? '🎯 Custom Traits Active' : '🧠 Alith Recommended Traits'}
                          </span>
                          <button
                            onClick={resetToRandomTraits}
                            className="text-xs text-gray-400 hover:text-white"
                          >
                            Reset
                          </button>
                        </div>
                        {getCurrentTraits() && (
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            {Object.entries(getCurrentTraits()!).map(([trait, value]) => (
                              <div key={trait} className="flex justify-between">
                                <span className="text-gray-400 capitalize">{trait.slice(0, 4)}</span>
                                <span className={getTraitColorClass(value as number)}>{value as number}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Trait Customizer */}
                    {showTraitCustomizer && (
                      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
                        <h5 className="text-white font-bold mb-3">🎯 Customize Personality Traits</h5>
                        <div className="space-y-3">
                          {Object.entries(customTraits).map(([trait, value]) => (
                            <div key={trait}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-300 capitalize">{trait}</span>
                                <span className={`font-medium ${getTraitColorClass(value)}`}>{value}</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={value}
                                onChange={(e) => setCustomTraits(prev => ({
                                  ...prev,
                                  [trait]: parseInt(e.target.value)
                                }))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <button
                            onClick={() => setShowTraitCustomizer(false)}
                            className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={useCustomTraits}
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                          >
                            Use These Traits
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={createBeing}
                      disabled={!newBeingName.trim()}
                      className={`w-full py-3 rounded-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-2 ${
                        !newBeingName.trim() 
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                          : isWalletConnected
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isWalletConnected ? (
                        <>
                          <span>🎭</span>
                          <span>Create & Mint NFT</span>
                          <span>💎</span>
                        </>
                      ) : (
                        <>
                          <span>🎭</span>
                          <span>Create AI Being</span>
                        </>
                      )}
                    </button>

                    {/* Trait Control Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowTraitCustomizer(!showTraitCustomizer)}
                        className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm"
                      >
                        🎯 {showTraitCustomizer ? 'Hide' : 'Custom'} Traits
                      </button>
                    </div>
                    
                    {!isWalletConnected && (
                      <p className="text-center text-sm text-gray-400">
                        💡 Connect wallet above to mint as NFT
                      </p>
                    )}
                    
                    {isWalletConnected && (
                      <p className="text-center text-sm text-green-400">
                        ✨ Your AI being will be minted as a unique NFT on Hyperion!
                      </p>
                    )}
                  </div>
                </div>

                {/* Simulation Controls */}
                <div className="border border-gray-600 rounded-xl p-4">
                  <h4 className="text-white font-bold mb-3">🔄 Simulation Controls</h4>
                  <button
                    onClick={toggleSimulation}
                    className={`w-full py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                      simulationRunning
                        ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse-slow'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {simulationRunning ? '⏸️ Pause Simulation' : '▶️ Start Simulation'}
                  </button>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">📋 Activity Log</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {logs.length > 0 ? logs.map((log, index) => (
                  <div key={index} className="text-sm text-gray-300 font-mono bg-gray-900 bg-opacity-50 px-3 py-2 rounded">
                    {log}
                  </div>
                )) : (
                  <div className="text-gray-400 text-sm">No activity yet...</div>
                )}
              </div>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="lg:col-span-1">
            <WalletConnection />
          </div>

          {/* Alith AI Assistant */}
          <div className="lg:col-span-1">
            <AlithChat 
              isConnected={isConnected} 
              newBeingName={newBeingName}
              onTraitsRecommended={handleAlithTraitRecommendation}
            />
          </div>
        </div>

        {/* AI Beings Grid */}
        <div className="mt-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              👥 AI Beings ({beings ? beings.length : 0})
              {isWalletConnected && (
                <span className="ml-2 px-3 py-1 bg-blue-600 bg-opacity-30 text-blue-200 text-sm rounded-full">
                  💎 NFT Enabled
                </span>
              )}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beings && beings.length > 0 ? beings.map((being, index) => (
                <div key={index} className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 border border-gray-600 hover:border-blue-500 transition-all card-hover">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-white">{being.name || 'Unknown Being'}</h4>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                        {getEconomicStyleEmoji(being.economicStyle || 'balanced')} {being.economicStyle || 'balanced'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">💰 Wealth:</span>
                      <span className="text-white font-bold">{being.wallet || 0} tokens</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">⭐ Reputation:</span>
                      <span className="text-white font-bold">{being.reputation || 0}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">📈 Success Rate:</span>
                      <span className="text-white font-bold">{being.successRate || '0%'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">🎂 Age:</span>
                      <span className="text-white font-bold">{being.age || '0 minutes old'}</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold text-gray-300 mb-3">Personality Traits</h5>
                    <div className="space-y-2">
                      {being.traits && Object.entries(being.traits).map(([trait, value]) => (
                        <div key={trait}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400 capitalize">{trait}</span>
                            <span className="text-white font-medium">{value || 0}</span>
                          </div>
                          <div className="trait-bar">
                            <div 
                              className={`trait-fill ${getTraitColor(value || 0)}`}
                              style={{ width: `${value || 0}%` }}
                            />
                          </div>
                        </div>
                      ))}
                      {!being.traits && (
                        <div className="text-gray-400 text-sm">Loading traits...</div>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🤖</div>
                  <div className="text-gray-400 text-xl mb-2">No AI beings yet</div>
                  <div className="text-gray-500 text-sm">Create your first AI being to get started!</div>
                  <div className="text-gray-600 text-xs mt-2">
                    {isConnected ? 'Connected to backend' : 'Connecting to backend...'}
                  </div>
                  {isWalletConnected && (
                    <div className="text-blue-400 text-xs mt-1">
                      💎 Wallet connected - new beings will be minted as NFTs!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        {society && society.topEarners && society.mostReputable && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">🏆 Top Earners</h3>
              <div className="space-y-3">
                {society.topEarners && society.topEarners.length > 0 ? society.topEarners.map((earner, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-yellow-600 bg-opacity-20 rounded-lg">
                    <span className="text-white font-medium">#{index + 1} {earner.name || 'Unknown'}</span>
                    <span className="text-yellow-300 font-bold">{earner.wallet || 0} tokens</span>
                  </div>
                )) : (
                  <div className="text-gray-400 text-sm text-center py-4">No top earners yet</div>
                )}
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">⭐ Most Reputable</h3>
              <div className="space-y-3">
                {society.mostReputable && society.mostReputable.length > 0 ? society.mostReputable.map((reputable, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-purple-600 bg-opacity-20 rounded-lg">
                    <span className="text-white font-medium">#{index + 1} {reputable.name || 'Unknown'}</span>
                    <span className="text-purple-300 font-bold">{reputable.reputation || 0} rep</span>
                  </div>
                )) : (
                  <div className="text-gray-400 text-sm text-center py-4">No reputable beings yet</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
