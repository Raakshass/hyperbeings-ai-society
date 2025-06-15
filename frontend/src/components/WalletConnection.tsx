import React from 'react';
import { useWeb3 } from './Web3Provider';

const WalletConnection: React.FC = () => {
  const { 
    account, 
    isConnected, 
    connectWallet, 
    disconnectWallet, 
    balance, 
    chainId 
  } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 5: return 'Goerli Testnet';
      case 11155111: return 'Sepolia Testnet';
      case 1337: return 'Local Network';
      case 31337: return 'Hardhat Network';
      default: return `Chain ${chainId}`;
    }
  };

  const getNetworkColor = (chainId: number) => {
    switch (chainId) {
      case 1: return 'bg-green-600';
      case 5: return 'bg-blue-600';
      case 11155111: return 'bg-purple-600';
      case 1337:
      case 31337: return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  if (isConnected && account) {
    return (
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center">
            🔗 Web3 Wallet
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs font-medium">Connected</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 text-sm">Address:</span>
              <span className="text-white font-mono text-sm">{formatAddress(account)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 text-sm">Balance:</span>
              <span className="text-white font-bold">{parseFloat(balance).toFixed(4)} ETH</span>
            </div>
            
            {chainId && (
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Network:</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getNetworkColor(chainId)}`}></div>
                  <span className="text-white text-sm">{getNetworkName(chainId)}</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={disconnectWallet}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <span>🔓</span>
            <span>Disconnect Wallet</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
        🔗 Connect Wallet
      </h3>
      
      <div className="space-y-4">
        <p className="text-gray-300 text-sm">
          Connect your wallet to mint AI beings as NFTs and participate in the decentralized economy.
        </p>

        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">🎭 Benefits of Connecting:</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Mint AI beings as unique NFTs</li>
            <li>• Own and trade your AI beings</li>
            <li>• Participate in governance</li>
            <li>• Access premium features</li>
          </ul>
        </div>

        <button
          onClick={connectWallet}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 transform hover:scale-105"
        >
          <span>🦊</span>
          <span>Connect MetaMask</span>
        </button>

        <p className="text-gray-400 text-xs text-center">
          Make sure you have MetaMask installed and are on a supported network.
        </p>
      </div>
    </div>
  );
};

export default WalletConnection;
