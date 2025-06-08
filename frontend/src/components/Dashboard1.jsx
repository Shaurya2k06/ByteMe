import { useEffect, useRef, useState } from "react";
import NavBar1 from "./NavBar1";
import { useMetaMask } from "../hooks/useMetamask";
import { ethers } from 'ethers';
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Title,
  Tooltip,
  Legend
);

const AdminBalance = () => {
  const { isConnected, account } = useMetaMask();
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BITS_CONTRACT_ADDRESS = "0xEE43baf1A0D54439B684150ec377Bb6d7D58c4bC"; 
  

  const BITS_ABI = [
    {
      "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
      "name": "balanceOf",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const fetchBalance = async () => {
    if (!isConnected || !account || !window.ethereum) {
      setBalance("0");
      return;
    }

    try {
      setLoading(true);
      setError(null);


      const provider = new ethers.providers.Web3Provider(window.ethereum);
   
      const network = await provider.getNetwork();
      console.log("Connected to network:", network.name, network.chainId);

      const contract = new ethers.Contract(
        BITS_CONTRACT_ADDRESS,
        BITS_ABI,
        provider
      );

      const balanceWei = await Promise.race([
        contract.balanceOf(account),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Request timeout")), 10000)
        )
      ]);

      const balanceFormatted = ethers.utils.formatUnits(balanceWei, 18);
      
      const balanceNumber = parseFloat(balanceFormatted);
      setBalance(balanceNumber.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }));

    } catch (err) {
      console.error("Detailed error:", err);
      
      // More specific error messages
      let errorMessage = "Failed to fetch balance";
      if (err.message.includes("timeout")) {
        errorMessage = "Request timeout";
      } else if (err.message.includes("network")) {
        errorMessage = "Network error";
      } else if (err.message.includes("contract")) {
        errorMessage = "Contract not found";
      } else if (err.message.includes("Ethers")) {
        errorMessage = "Ethers.js not loaded";
      }
      
      setError(errorMessage);
      setBalance("Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && account) {
      const timer = setTimeout(() => {
        fetchBalance();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, account]);

  const handleRefresh = () => {
    fetchBalance();
  };

  return (
    <div className="flex-1 min-w-[250px] bg-white rounded-lg p-4 shadow-md flex flex-col justify-between gap-2 hover:shadow-2xl transition-all duration-300 h-[200px] sm:h-[221px]">
      <div className="flex items-center justify-between">
        <h3 className="text-[24px] sm:text-[32px] font-semibold text-gray-800 leading-[100%]">
          Admin Balance
        </h3>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          title="Refresh balance"
        >
          <svg
            className={`w-4 h-4 text-gray-600 ${loading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {!isConnected ? (
          <div className="text-center">
            <span className="text-lg text-gray-500">Connect Wallet</span>
            <p className="text-xs text-gray-400">Connect to view balance</p>
          </div>
        ) : loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
            <span className="text-sm text-gray-600">Loading...</span>
          </div>
        ) : error ? (
          <div className="text-center">
            <span className="text-lg text-red-500">Error</span>
            <p className="text-xs text-red-400">{error}</p>
            <button 
              onClick={handleRefresh}
              className="text-xs text-blue-600 hover:underline mt-1"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[24px] sm:text-[32px] font-bold text-gray-800 leading-[100%]">
              {balance}
            </span>
            <span className="text-sm sm:text-base text-gray-600">BITS</span>
          </div>
        )}

        {isConnected && account && (
          <p className="text-xs text-gray-400 truncate">
            {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        )}
      </div>
    </div>
  );
};

const TotalTransactions = () => {
  return (
    <div className="flex-1 min-w-[250px] bg-white rounded-lg p-4 shadow-md flex flex-col justify-between gap-2 hover:shadow-2xl transition-all duration-300 h-[200px] sm:h-[221px]">
      <h3 className="text-[24px] sm:text-[32px] font-semibold text-gray-800 leading-[100%]">
        Total Transactions
      </h3>
      <div className="flex items-center gap-2">
        <span className="text-[24px] sm:text-[32px] font-bold text-gray-800 leading-[100%]">
          20,000
        </span>
        <span className="text-sm sm:text-base text-green-600">+2.3%</span>
      </div>
    </div>
  );
};

const CoinFlow = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Volume of Tokens",
            data: [
              2000, 3000, 2500, 6000, 9000, 7000, 4000, 5000, 4500, 4000, 3500,
              4000,
            ],
            borderColor: "#007bff",
            backgroundColor: "rgba(0, 123, 255, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Volume of Tokens",
            },
          },
          x: {
            title: {
              display: true,
              text: "Time",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, []);

  return (
    <div className="w-full bg-white rounded-lg p-4 shadow-md flex flex-col gap-2 hover:shadow-2xl transition-all duration-300 min-h-[300px]">
      <div className="flex gap-2 items-center">
        <img src="/uparraow.svg" alt="logo" className="w-10 h-10" />
        <h3 className="text-[24px] sm:text-[32px] font-semibold text-gray-800">
          Coin Flow
        </h3>
      </div>
      <div className="w-full h-[250px] sm:h-[300px]">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

const SendTokens = () => {
  const { isConnected, account } = useMetaMask();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const BITS_CONTRACT_ADDRESS = "0xEE43baf1A0D54439B684150ec377Bb6d7D58c4bC";
  
  const BITS_ABI = [
    {
      "inputs": [
        {"internalType": "address", "name": "to", "type": "address"},
        {"internalType": "uint256", "name": "amount", "type": "uint256"}
      ],
      "name": "transfer",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
      "name": "balanceOf",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const validateAddress = (address) => {
    try {
      return ethers.utils.isAddress(address);
    } catch {
      return false;
    }
  };

  const handleSendTokens = async () => {
    if (!isConnected || !account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!recipientAddress.trim()) {
      setError('Please enter a recipient address');
      return;
    }

    if (!validateAddress(recipientAddress)) {
      setError('Please enter a valid wallet address');
      return;
    }

    if (!tokenAmount || parseFloat(tokenAmount) <= 0) {
      setError('Please enter a valid token amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(
        BITS_CONTRACT_ADDRESS,
        BITS_ABI,
        signer
      );

      // Check sender's balance first
      const balance = await contract.balanceOf(account);
      const balanceFormatted = parseFloat(ethers.utils.formatUnits(balance, 18));
      const amountToSend = parseFloat(tokenAmount);

      if (amountToSend > balanceFormatted) {
        setError(`Insufficient balance. You have ${balanceFormatted.toFixed(2)} BITS`);
        return;
      }

      // Convert amount to wei (18 decimals)
      const amountWei = ethers.utils.parseUnits(tokenAmount, 18);

      // Send the transaction
      const tx = await contract.transfer(recipientAddress, amountWei);
      
      setSuccess('Transaction sent! Waiting for confirmation...');
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        setSuccess(`Successfully sent ${tokenAmount} BITS to ${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`);
        // Clear form
        setRecipientAddress('');
        setTokenAmount('');
      } else {
        setError('Transaction failed');
      }

    } catch (err) {
      console.error('Send tokens error:', err);
      
      let errorMessage = 'Failed to send tokens';
      if (err.code === 4001) {
        errorMessage = 'Transaction rejected by user';
      } else if (err.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient ETH for gas fees';
      } else if (err.message.includes('gas')) {
        errorMessage = 'Gas estimation failed';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md flex flex-col gap-4 hover:shadow-2xl transition-all duration-300 w-full">
      <div className="flex gap-2 items-center">
        <img src="/telegram.svg" alt="logo" className="w-[27px] h-[27px]" />
        <h3 className="text-lg font-semibold text-gray-800">Send Tokens</h3>
      </div>
      
      {!isConnected ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Connect your wallet to send tokens</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-800">Wallet Address</label>
            <input
              type="text"
              placeholder="Enter recipient wallet address"
              value={recipientAddress}
              onChange={(e) => {
                setRecipientAddress(e.target.value);
                clearMessages();
              }}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-800">No. of Tokens</label>
            <input
              type="number"
              placeholder="Enter number of tokens"
              value={tokenAmount}
              onChange={(e) => {
                setTokenAmount(e.target.value);
                clearMessages();
              }}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              step="0.01"
              min="0"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-2">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-2">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          <button 
            onClick={handleSendTokens}
            disabled={loading || !recipientAddress || !tokenAmount}
            className="bg-blue-600 text-white rounded-md p-2 text-base hover:bg-blue-700 active:scale-95 transition-transform duration-100 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              'SEND'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const ImagePlaceholder = () => {
  return (
    <div className="w-full flex justify-center items-center py-4">
      <img
        src="/dashboardimage.svg"
        alt="logo"
        className="hover:animate-wave transition-all duration-500 transform origin-bottom h-[150px] sm:h-[200px] object-contain"
      />
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100 overflow-x-hidden">
      <div className="flex flex-col lg:flex-row gap-4 p-4">
        <div className="w-full lg:w-[70%] flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-10">
            <AdminBalance />
            <TotalTransactions />
          </div>
          <CoinFlow />
        </div>
        <div className="w-full lg:w-[30%] flex flex-col gap-4">
          <ImagePlaceholder />
          <SendTokens />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
