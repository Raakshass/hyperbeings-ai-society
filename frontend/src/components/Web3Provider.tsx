import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';

interface Web3ContextType {
  account: string | null;
  provider: BrowserProvider | null;
  signer: ethers.Signer | null;
  contract: Contract | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  balance: string;
  chainId: number | null;
  mintAIBeing: (name: string, traits: any, economicStyle: string) => Promise<any>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

// Contract ABI (simplified - will be updated after deployment)
const contractABI = [
  "function mintAIBeing(address to, string memory name, uint256 creativity, uint256 socialness, uint256 riskTaking, uint256 ambition, uint256 empathy, string memory economicStyle, string memory tokenURI) public returns (uint256)",
  "function getAIBeing(uint256 tokenId) external view returns (tuple(string name, uint256 creativity, uint256 socialness, uint256 riskTaking, uint256 ambition, uint256 empathy, uint256 wallet, uint256 reputation, uint256 birthTime, string economicStyle, bool isActive, uint256 totalEarnings, uint256 collaborations))",
  "function getUserBeings(address user) external view returns (uint256[] memory)",
  "function getSocietyStats() external view returns (uint256, uint256, uint256, uint256)",
  "event AIBeingMinted(uint256 indexed tokenId, address indexed owner, string name, string economicStyle)"
];

// Placeholder contract address (will be updated after deployment)
const CONTRACT_ADDRESS = "0x6b94D66D6DDfF5993504076C30334A19da1a28c0";

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        console.log('🔄 Connecting to wallet...');
        
        // ethers v6 syntax
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        const network = await provider.getNetwork();

        // Create contract instance (only if contract address is valid)
        let contract = null;
        if (CONTRACT_ADDRESS !== "0x6b94D66D6DDfF5993504076C30334A19da1a28c0") {
          contract = new Contract(CONTRACT_ADDRESS, contractABI, signer);
          console.log('📄 Contract instance created');
        } else {
          console.log('⚠️ Contract not deployed yet - using placeholder address');
        }

        setProvider(provider);
        setSigner(signer);
        setAccount(address);
        setContract(contract);
        setBalance(ethers.formatEther(balance)); // v6 syntax
        setChainId(Number(network.chainId)); // v6 returns bigint, convert to number
        setIsConnected(true);

        console.log('✅ Wallet connected:', address);
        console.log('📍 Network:', network.name, 'Chain ID:', network.chainId);
        console.log('💰 Balance:', ethers.formatEther(balance), 'ETH');
      } catch (error) {
        console.error('❌ Wallet connection failed:', error);
        alert('Failed to connect wallet. Please try again.');
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet!');
      console.log('❌ No Web3 wallet detected');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setBalance('0');
    setChainId(null);
    setIsConnected(false);
    console.log('🔓 Wallet disconnected');
  };

  const mintAIBeing = async (name: string, traits: any, economicStyle: string) => {
    if (!contract || !account) {
      throw new Error('Wallet not connected or contract not available');
    }

    try {
      console.log('🎭 Minting AI Being:', name, traits, economicStyle);
      
      // Create metadata for the NFT
      const metadata = {
        name: name,
        description: `An autonomous AI being with ${economicStyle} economic style`,
        traits: traits,
        economicStyle: economicStyle,
        image: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
        external_url: "https://hyperbeings.ai",
        attributes: [
          { trait_type: "Creativity", value: traits.creativity },
          { trait_type: "Social Skills", value: traits.socialness },
          { trait_type: "Risk Taking", value: traits.riskTaking },
          { trait_type: "Ambition", value: traits.ambition },
          { trait_type: "Empathy", value: traits.empathy },
          { trait_type: "Economic Style", value: economicStyle }
        ]
      };

      const tokenURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;

      const tx = await contract.mintAIBeing(
        account,
        name,
        traits.creativity,
        traits.socialness,
        traits.riskTaking,
        traits.ambition,
        traits.empathy,
        economicStyle,
        tokenURI
      );

      console.log('📄 Transaction sent:', tx.hash);
      console.log('⏳ Waiting for confirmation...');
      
      const receipt = await tx.wait();
      console.log('✅ AI Being minted successfully!', receipt);

      return receipt;
    } catch (error) {
      console.error('❌ Minting failed:', error);
      throw error;
    }
  };

  // Auto-connect if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            console.log('🔄 Auto-connecting to previously connected wallet...');
            await connectWallet();
          }
        } catch (error) {
          console.error('Auto-connect failed:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          connectWallet();
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [account]);

  return (
    <Web3Context.Provider value={{
      account,
      provider,
      signer,
      contract,
      isConnected,
      connectWallet,
      disconnectWallet,
      balance,
      chainId,
      mintAIBeing
    }}>
      {children}
    </Web3Context.Provider>
  );
};
