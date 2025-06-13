import React, { useState, useEffect } from "react";
import { Calendar, Send, Eye, Clock, Wallet, RefreshCw, CheckCircle, Check } from "lucide-react";
import NavBar3 from "./components/NavBar3";
import { useMetaMask } from "./hooks/useMetamask";
import { ethers } from 'ethers';
import { motion, AnimatePresence } from "framer-motion";

const StudentDashboard = () => {
  const { isConnected, account } = useMetaMask();
  
  // Update with your new deployed contract address
  const BITS_CONTRACT_ADDRESS = "0xfEc060d0CF069ce6b1518445dB538058e9eE063d";
  const ADMIN_ACCOUNT = "0x4f91bd1143168af7268eb08b017ec785c06c0e61";
  const FEE_AMOUNT = "20000"; // 20,000 BITS

  const [walletAddress, setWalletAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [balance, setBalance] = useState("0");
  const [totalSpent, setTotalSpent] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payingFees, setPayingFees] = useState(false);
  const [feesPaid, setFeesPaid] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('feesPaid');
    const lastPayment = localStorage.getItem('lastPaymentDate');
    
    if (saved && lastPayment) {
      const paymentDate = new Date(lastPayment);
      const now = new Date();
      
      // Check if we're still in the same month
      if (paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear()) {
        return JSON.parse(saved);
      } else {
        // New month, reset fees
        localStorage.removeItem('feesPaid');
        localStorage.removeItem('lastPaymentDate');
        return false;
      }
    }
    return false;
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [sendingTokens, setSendingTokens] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [autopayEnabled, setAutopayEnabled] = useState(false);
  const [loadingAutopay, setLoadingAutopay] = useState(false);
  const [checkingAutopay, setCheckingAutopay] = useState(false);

  // Function to get current month's due date (19th of current month)
  const getCurrentFeeDueDate = () => {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 19);
    return currentMonth.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Function to get next fee due date (19th of next month)
  const getNextFeeDueDate = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 19);
    return nextMonth.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Complete BITS ABI with all autopay functions
  const BITS_ABI = [
    {
      "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
      "name": "balanceOf",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
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
      "inputs": [
        {"internalType": "address", "name": "collector", "type": "address"},
        {"internalType": "uint256", "name": "amount", "type": "uint256"},
        {"internalType": "uint256", "name": "interval", "type": "uint256"}
      ],
      "name": "enableAutopay",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "collector", "type": "address"}],
      "name": "disableAutopay",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "payer", "type": "address"},
        {"internalType": "address", "name": "collector", "type": "address"}
      ],
      "name": "getAutopaySubscription",
      "outputs": [
        {"internalType": "bool", "name": "isActive", "type": "bool"},
        {"internalType": "uint256", "name": "amount", "type": "uint256"},
        {"internalType": "uint256", "name": "lastPayment", "type": "uint256"},
        {"internalType": "uint256", "name": "interval", "type": "uint256"},
        {"internalType": "uint256", "name": "nextPaymentDue", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "payer", "type": "address"},
        {"internalType": "address", "name": "collector", "type": "address"}
      ],
      "name": "isAutopayDue",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "payer", "type": "address"},
        {"internalType": "address", "name": "collector", "type": "address"}
      ],
      "name": "executeAutopay",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "address", "name": "from", "type": "address"},
        {"indexed": true, "internalType": "address", "name": "to", "type": "address"},
        {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}
      ],
      "name": "Transfer",
      "type": "event"
    }
  ];

  // Enable autopay function
  const handleEnableAutopay = async () => {
    console.log("🚀 Enable autopay clicked");
    console.log("isConnected:", isConnected);
    console.log("account:", account);
    
    if (!isConnected || !account) {
      console.log("❌ Wallet not connected");
      setError("Please connect your wallet first");
      return;
    }

    try {
      setLoadingAutopay(true);
      setError(null);
      setSuccessMessage("");
      
      console.log("📝 Setting up autopay...");
      console.log("Account:", account);
      console.log("Admin:", ADMIN_ACCOUNT);
      console.log("Contract:", BITS_CONTRACT_ADDRESS);
      
      // Check if window.ethereum exists
      if (!window.ethereum) {
        throw new Error("MetaMask not found");
      }
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(BITS_CONTRACT_ADDRESS, BITS_ABI, signer);

      // Check contract exists
      const code = await provider.getCode(BITS_CONTRACT_ADDRESS);
      console.log("📋 Contract code exists:", code !== "0x");
      
      if (code === "0x") {
        throw new Error("Contract not found at this address");
      }

      // 30 days in seconds
      const monthlyInterval = 2592000;
      const feeAmountWei = ethers.utils.parseUnits(FEE_AMOUNT, 18);

      console.log("💰 Fee amount:", ethers.utils.formatEther(feeAmountWei), "BITS");
      console.log("⏰ Interval:", monthlyInterval, "seconds");

      // Check if admin is authorized collector
      console.log("🔍 Checking if admin is authorized...");
      const isAuthorized = await contract.authorizedCollectors(ADMIN_ACCOUNT);
      console.log("✅ Admin authorized:", isAuthorized);
      
      if (!isAuthorized) {
        throw new Error("Admin account is not an authorized collector. Please contact support.");
      }

      // Check user balance
      console.log("💳 Checking user balance...");
      const userBalance = await contract.balanceOf(account);
      console.log("💳 User balance:", ethers.utils.formatEther(userBalance), "BITS");
      
      if (userBalance.lt(feeAmountWei)) {
        throw new Error(`Insufficient BITS balance. You need at least ${FEE_AMOUNT} BITS to set up autopay.`);
      }

      // Check current autopay status
      console.log("📊 Checking current autopay status...");
      const currentSubscription = await contract.getAutopaySubscription(account, ADMIN_ACCOUNT);
      console.log("📊 Current subscription:", currentSubscription);
      
      if (currentSubscription.isActive) {
        console.log("⚠️ Autopay already enabled");
        setAutopayEnabled(true);
        setSuccessMessage('Autopay is already enabled for your account.');
        return;
      }

      setSuccessMessage('🔄 Setting up autopay... Please confirm the transaction in MetaMask.');

      console.log("📤 Calling enableAutopay...");
      console.log("Parameters:", {
        collector: ADMIN_ACCOUNT,
        amount: feeAmountWei.toString(),
        interval: monthlyInterval
      });

      // Estimate gas first
      const gasEstimate = await contract.estimateGas.enableAutopay(
        ADMIN_ACCOUNT, 
        feeAmountWei, 
        monthlyInterval
      );
      console.log("⛽ Gas estimate:", gasEstimate.toString());

      const tx = await contract.enableAutopay(
        ADMIN_ACCOUNT, 
        feeAmountWei, 
        monthlyInterval,
        {
          gasLimit: gasEstimate.mul(120).div(100) // Add 20% buffer
        }
      );
      
      console.log("📤 Transaction sent:", tx.hash);
      setSuccessMessage('⏳ Transaction submitted. Waiting for confirmation...');
      
      const receipt = await tx.wait();
      console.log("✅ Transaction confirmed:", receipt);
      
      // Verify the subscription was created
      const newSubscription = await contract.getAutopaySubscription(account, ADMIN_ACCOUNT);
      console.log("📊 New subscription:", newSubscription);
      
      setAutopayEnabled(true);
      setSuccessMessage('🎉 Autopay enabled successfully! Your fees will be automatically deducted monthly.');
      
      setTimeout(() => setSuccessMessage(""), 5000);

    } catch (err) {
      console.error('❌ Enable autopay error:', err);
      
      let errorMessage = 'Failed to enable autopay';
      
      if (err.code === 4001) {
        errorMessage = 'Transaction rejected by user';
      } else if (err.code === -32603) {
        errorMessage = 'Internal JSON-RPC error. Please try again.';
      } else if (err.message.includes('Collector not authorized')) {
        errorMessage = 'Admin account not authorized for autopay';
      } else if (err.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for gas fees';
      } else if (err.message.includes('Insufficient BITS')) {
        errorMessage = 'Insufficient BITS balance for autopay';
      } else if (err.message.includes('Contract not found')) {
        errorMessage = 'Smart contract not found. Please check the contract address.';
      } else if (err.message.includes('MetaMask not found')) {
        errorMessage = 'MetaMask not detected. Please install MetaMask.';
      } else if (err.reason) {
        errorMessage = `Contract error: ${err.reason}`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setTimeout(() => setError(""), 10000);
    } finally {
      setLoadingAutopay(false);
    }
  };

  // Disable autopay function
  const handleDisableAutopay = async () => {
    if (!isConnected || !account) return;

    try {
      setLoadingAutopay(true);
      setError(null);
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(BITS_CONTRACT_ADDRESS, BITS_ABI, signer);

      const tx = await contract.disableAutopay(ADMIN_ACCOUNT);
      await tx.wait();
      
      setAutopayEnabled(false);
      setSuccessMessage('Autopay disabled successfully.');
      
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (err) {
      console.error('Disable autopay error:', err);
      setError('Failed to disable autopay');
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoadingAutopay(false);
    }
  };

  // Check autopay status
  const checkAutopayStatus = async () => {
    if (!isConnected || !account) {
      setAutopayEnabled(false);
      return;
    }

    try {
      setCheckingAutopay(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(BITS_CONTRACT_ADDRESS, BITS_ABI, provider);

      console.log("🔍 Checking autopay status for:", account);
      const subscription = await contract.getAutopaySubscription(account, ADMIN_ACCOUNT);
      console.log("📊 Autopay subscription:", subscription);
      
      setAutopayEnabled(subscription.isActive);

      // Also check if payment is due
      if (subscription.isActive) {
        const isDue = await contract.isAutopayDue(account, ADMIN_ACCOUNT);
        console.log("⏰ Payment due:", isDue);
        
        if (isDue) {
          setSuccessMessage("💡 Your autopay payment is due. It will be processed automatically.");
        }
      }

    } catch (err) {
      console.error("❌ Error checking autopay:", err);
      setAutopayEnabled(false);
    } finally {
      setCheckingAutopay(false);
    }
  };

  // Function to fetch real transactions from Etherscan
  const fetchTransactions = async () => {
    if (!isConnected || !account) {
      setTransactions([]);
      return;
    }

    try {
      setLoadingTransactions(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Get the latest block number
      const latestBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, latestBlock - 10000); // Last ~10k blocks
      
      // Create contract instance
      const contract = new ethers.Contract(BITS_CONTRACT_ADDRESS, BITS_ABI, provider);
      
      // Get Transfer events where user is sender or receiver
      const transferFilter = contract.filters.Transfer();
      const events = await contract.queryFilter(transferFilter, fromBlock, latestBlock);
      
      // Filter events related to the current user
      const userTransactions = events
        .filter(event => 
          event.args.from.toLowerCase() === account.toLowerCase() || 
          event.args.to.toLowerCase() === account.toLowerCase()
        )
        .map(event => ({
          hash: event.transactionHash,
          from: event.args.from,
          to: event.args.to,
          value: ethers.utils.formatEther(event.args.value),
          blockNumber: event.blockNumber,
          timestamp: null // We'll fetch this below
        }))
        .slice(-10) // Get last 10 transactions
        .reverse(); // Most recent first

      // Get timestamps for each transaction
      const transactionsWithTimestamp = await Promise.all(
        userTransactions.map(async (tx) => {
          try {
            const block = await provider.getBlock(tx.blockNumber);
            return {
              ...tx,
              timestamp: new Date(block.timestamp * 1000).toLocaleString()
            };
          } catch (error) {
            console.error(`Error fetching block ${tx.blockNumber}:`, error);
            return {
              ...tx,
              timestamp: 'Unknown'
            };
          }
        })
      );

      setTransactions(transactionsWithTimestamp);

    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const fetchBalance = async () => {
    if (!isConnected || !account || !window.ethereum) {
      setBalance("0");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
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
      console.error("Error fetching balance:", err);
      setError("Failed to fetch balance");
      setBalance("Error");
      setTotalSpent("Error");
    } finally {
      setLoading(false);
    }
  };

  // Add the missing calculateTotalSpent function
  const calculateTotalSpent = async () => {
    if (!isConnected || !account) {
      setTotalSpent("0");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(BITS_CONTRACT_ADDRESS, BITS_ABI, provider);
      
      // Get the latest block number
      const latestBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, latestBlock - 50000); // Look back ~50k blocks for more history
      
      // Get Transfer events where user is the sender (spending)
      const transferFilter = contract.filters.Transfer(account, null); // From user to anyone
      const events = await contract.queryFilter(transferFilter, fromBlock, latestBlock);
      
      console.log("📊 Found", events.length, "outgoing transactions");
      
      // Calculate total spent
      let totalSpentWei = ethers.BigNumber.from(0);
      
      events.forEach(event => {
        const amount = event.args.value;
        totalSpentWei = totalSpentWei.add(amount);
        console.log("💸 Spent:", ethers.utils.formatEther(amount), "BITS to", event.args.to);
      });
      
      const totalSpentFormatted = ethers.utils.formatEther(totalSpentWei);
      console.log("💰 Total spent:", totalSpentFormatted, "BITS");
      
      setTotalSpent(totalSpentFormatted);

    } catch (error) {
      console.error("Error calculating total spent:", error);
      setTotalSpent("0");
    }
  };

  // Update your existing useEffect to include calculateTotalSpent
  useEffect(() => {
    if (isConnected && account) {
      const timer = setTimeout(() => {
        fetchBalance();
        fetchTransactions();
        calculateTotalSpent(); // Add this line
        checkAutopayStatus();
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setBalance("0");
      setTotalSpent("0");
      setTransactions([]);
      setAutopayEnabled(false);
    }
  }, [isConnected, account]);

  // Add a refresh function for manual updates
  const refreshAllData = async () => {
    if (!isConnected || !account) return;
    
    setLoading(true);
    try {
      await Promise.all([
        fetchBalance(),
        fetchTransactions(),
        calculateTotalSpent(),
        checkAutopayStatus()
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update your Total Spent display section in the JSX:
  // Find the Total Spent section and make sure it includes a refresh button:
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Wallet className="w-5 h-5 text-red-600" />
        Total Spent
      </h3>
      <button
        onClick={calculateTotalSpent}
        disabled={loading}
        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
        title="Refresh total spent"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
    <div className="text-3xl font-bold text-red-600 mb-1">
      {loading ? (
        <div className="flex items-center gap-2">
          <motion.div
            className="w-6 h-6 border-2 border-red-200 border-t-red-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          Loading...
        </div>
      ) : (
        `${parseFloat(totalSpent).toLocaleString()} BITS`
      )}
    </div>
    <p className="text-sm text-gray-500">
      Total tokens sent from your wallet
    </p>
    
    {/* Optional: Show spending breakdown */}
    {totalSpent !== "0" && !loading && (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Includes all outgoing transfers from your wallet
        </p>
      </div>
    )}
  </div>

  // Also, you can add a more detailed spending analysis function:
  const getSpendingBreakdown = async () => {
    if (!isConnected || !account) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(BITS_CONTRACT_ADDRESS, BITS_ABI, provider);
      
      const latestBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, latestBlock - 50000);
      
      const transferFilter = contract.filters.Transfer(account, null);
      const events = await contract.queryFilter(transferFilter, fromBlock, latestBlock);
      
      // Group spending by recipient
      const spendingByRecipient = {};
      let totalSpentWei = ethers.BigNumber.from(0);
      
      for (const event of events) {
        const recipient = event.args.to;
        const amount = event.args.value;
        
        totalSpentWei = totalSpentWei.add(amount);
        
        if (!spendingByRecipient[recipient]) {
          spendingByRecipient[recipient] = {
            address: recipient,
            amount: ethers.BigNumber.from(0),
            count: 0
          };
        }
        
        spendingByRecipient[recipient].amount = spendingByRecipient[recipient].amount.add(amount);
        spendingByRecipient[recipient].count++;
      }
      
      // Convert to array and sort by amount
      const sortedSpending = Object.values(spendingByRecipient)
        .map(item => ({
          ...item,
          amountFormatted: ethers.utils.formatEther(item.amount),
          isAdmin: item.address.toLowerCase() === ADMIN_ACCOUNT.toLowerCase()
        }))
        .sort((a, b) => b.amount.sub(a.amount));
      
      console.log("📊 Spending breakdown:", sortedSpending);
      console.log("💰 Total spent:", ethers.utils.formatEther(totalSpentWei), "BITS");
      
      return {
        total: ethers.utils.formatEther(totalSpentWei),
        breakdown: sortedSpending
      };
      
    } catch (error) {
      console.error("Error getting spending breakdown:", error);
      return null;
    }
  };

  // In your JSX, make sure the button looks exactly like this:
  <motion.button
    onClick={() => {
      console.log("Button clicked!", { autopayEnabled, loadingAutopay, checkingAutopay });
      if (autopayEnabled) {
        handleDisableAutopay();
      } else {
        handleEnableAutopay();
      }
    }}
    disabled={loadingAutopay || checkingAutopay}
    className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
      autopayEnabled 
        ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' 
        : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
    }`}
    whileHover={!loadingAutopay && !checkingAutopay ? { scale: 1.02 } : {}}
    whileTap={!loadingAutopay && !checkingAutopay ? { scale: 0.98 } : {}}
  >
    {loadingAutopay ? (
      <>
        <motion.div
          className="w-4 h-4 border-2 border-orange-400/30 border-t-orange-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {autopayEnabled ? 'Disabling...' : 'Setting up...'}
      </>
    ) : checkingAutopay ? (
      <>
        <motion.div
          className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        Checking autopay...
      </>
    ) : autopayEnabled ? (
      <>
        <CheckCircle className="w-4 h-4" />
        Disable Autopay
      </>
    ) : (
      <>
        <Clock className="w-4 h-4" />
        Set Up Autopay
      </>
    )}
  </motion.button>

  useEffect(() => {
    if (isConnected && account) {
      const timer = setTimeout(() => {
        fetchBalance();
        fetchTransactions(); // This should now work
        calculateTotalSpent(); // Add this line
        checkAutopayStatus();
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setBalance("0");
      setTotalSpent("0");
      setTransactions([]);
      setAutopayEnabled(false);
    }
  }, [isConnected, account]);

  const handleRefreshBalance = () => {
    fetchBalance();
    fetchTransactions(); // Also refresh transactions
  };

  const validateAddress = (address) => {
    try {
      return ethers.utils.isAddress(address);
    } catch {
      return false;
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage("");
  };

  const handleSendTokens = async () => {
    if (!isConnected || !account) {
      setSuccessMessage("");
      setError("Please connect your wallet first");
      return;
    }

    if (!walletAddress || !tokenAmount) {
      setSuccessMessage("");
      setError("Please fill in all fields");
      return;
    }

    if (!validateAddress(walletAddress)) {
      setSuccessMessage("");
      setError("Please enter a valid wallet address");
      return;
    }

    if (parseFloat(tokenAmount) <= 0) {
      setSuccessMessage("");
      setError("Please enter a valid token amount");
      return;
    }

    try {
      setSendingTokens(true);
      setError(null);
      setSuccessMessage("");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(
        BITS_CONTRACT_ADDRESS,
        BITS_ABI,
        signer
      );

      // Check balance first
      const balanceWei = await contract.balanceOf(account);
      const balanceFormatted = parseFloat(ethers.utils.formatUnits(balanceWei, 18));
      const amountToSend = parseFloat(tokenAmount);

      if (amountToSend > balanceFormatted) {
        setError(`Insufficient balance. You have ${balanceFormatted.toFixed(2)} BITS`);
        return;
      }

      // Convert amount to wei
      const amountWei = ethers.utils.parseUnits(tokenAmount, 18);
      
      // Send transaction
      const tx = await contract.transfer(walletAddress, amountWei);
      
      setSuccessMessage('Transaction sent! Waiting for confirmation...');
      
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        setSuccessMessage(`✅ Successfully sent ${tokenAmount} BITS to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`);
        setWalletAddress("");
        setTokenAmount("");
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000);
        // Refresh balance and transactions after successful transaction
        setTimeout(() => {
          fetchBalance();
          fetchTransactions();
        }, 2000);
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
      } else if (err.message.includes('transfer amount exceeds balance')) {
        errorMessage = 'Insufficient BITS balance';
      }
      
      setError(errorMessage);
    } finally {
      setSendingTokens(false);
    }
  };

  const handlePayFees = async () => {
    if (!isConnected || !account) {
      setSuccessMessage("");
      setError("Please connect your wallet first");
      return;
    }

    try {
      setPayingFees(true);
      setError(null);
      setSuccessMessage("");
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(
        BITS_CONTRACT_ADDRESS,
        BITS_ABI,
        signer
      );

      // Check if user has sufficient balance
      const balanceWei = await contract.balanceOf(account);
      const balanceFormatted = parseFloat(ethers.utils.formatUnits(balanceWei, 18));
      const feeAmountNumber = parseFloat(FEE_AMOUNT);

      if (feeAmountNumber > balanceFormatted) {
        setError(`Insufficient balance. You need ${FEE_AMOUNT} BITS but only have ${balanceFormatted.toFixed(2)} BITS`);
        return;
      }

      // Convert fee amount to wei
      const feeAmountWei = ethers.utils.parseUnits(FEE_AMOUNT, 18);
      
      // Send transaction
      const tx = await contract.transfer(ADMIN_ACCOUNT, feeAmountWei);
      
      setSuccessMessage('Fee payment transaction sent! Waiting for confirmation...');
      
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        setSuccessMessage(`🎉 Successfully paid ${FEE_AMOUNT} BITS as fees! Your next payment is due on ${getNextFeeDueDate()}.`);
        
        // Mark fees as paid and save to localStorage
        setFeesPaid(true);
        localStorage.setItem('feesPaid', 'true');
        localStorage.setItem('lastPaymentDate', new Date().toISOString());
        
        // Clear success message after 8 seconds
        setTimeout(() => setSuccessMessage(""), 8000);
        // Refresh balance and transactions after successful payment
        setTimeout(() => {
          fetchBalance();
          fetchTransactions();
        }, 2000);
      } else {
        setError('Fee payment transaction failed');
      }

    } catch (err) {
      console.error('Fee payment error:', err);
      
      let errorMessage = 'Failed to pay fees';
      if (err.code === 4001) {
        errorMessage = 'Transaction rejected by user';
      } else if (err.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient ETH for gas fees';
      } else if (err.message.includes('transfer amount exceeds balance')) {
        errorMessage = 'Insufficient BITS balance';
      }
      
      setError(errorMessage);
    } finally {
      setPayingFees(false);
    }
  };

  // Function to open transaction on Etherscan
  const openTransactionOnEtherscan = (txHash) => {
    window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <NavBar3 />

      {/* Main Content - Added pt-30 to push content down below navbar */}
      <div className="p-4 lg:p-6 pt-30">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8">
            {!isConnected && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  <strong>Connect your wallet</strong> to view your real account balance and send tokens.
                </p>
              </div>
            )}

            {/* Success Message */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-green-100 rounded-full">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-green-800 text-sm font-medium">
                      {successMessage}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
                >
                  <p className="text-red-800 text-sm font-medium">
                    {error}
                  </p>
                  <button 
                    onClick={() => setError(null)}
                    className="text-red-600 text-xs underline mt-1 hover:text-red-800"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Top Row - Balance Cards and Image */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Balance Cards */}
            <div className="lg:col-span-1 space-y-4">
              {/* Account Balance */}
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-8 h-8" />
                    <div>
                      <h3 className="text-sm font-medium opacity-90">
                        Account Balance
                      </h3>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleRefreshBalance}
                    disabled={loading || !isConnected}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200 disabled:opacity-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  </motion.button>
                </div>

                {!isConnected ? (
                  <div className="text-center py-2">
                    <p className="text-2xl font-bold opacity-70">Connect Wallet</p>
                    <p className="text-xs opacity-60 mt-1">Connect to view balance</p>
                  </div>
                ) : loading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse bg-white/20 h-8 w-32 rounded"></div>
                    <span className="text-sm opacity-70">Loading...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-2">
                    <p className="text-xl font-bold text-red-200">Error</p>
                    <p className="text-xs opacity-60">{error}</p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-3xl font-bold">
                      {balance}{" "}
                      <span className="text-sm font-normal opacity-80">BITS</span>
                    </p>
                    {account && (
                      <p className="text-xs opacity-60 font-mono mt-2 bg-white/10 px-2 py-1 rounded">
                        {account.slice(0, 6)}...{account.slice(-4)}
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>

              {/* Total Spent */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Send className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">
                      Total Spent
                    </h3>
                    {!isConnected ? (
                      <p className="text-xl font-bold text-gray-400">
                        Connect Wallet
                      </p>
                    ) : loading ? (
                      <div className="animate-pulse bg-gray-200 h-6 w-24 rounded mt-1"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">
                        {totalSpent}{" "}
                        <span className="text-sm font-normal text-gray-600">BITS</span>
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Pending Fees */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  feesPaid ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {feesPaid ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">
                    {feesPaid ? 'Fees Status' : 'Pending Fees'}
                  </h3>
                  {feesPaid ? (
                    <p className="text-2xl font-bold text-green-600">
                      Paid ✓
                    </p>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {FEE_AMOUNT.toLocaleString()}{" "}
                      <span className="text-sm font-normal text-gray-600">BITS</span>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                {feesPaid ? (
                  <>
                    <p className="text-sm text-green-600 font-medium">✅ All fees paid!</p>
                    <p className="text-sm text-gray-500">Next due: {getNextFeeDueDate()}</p>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-green-700">
                        Your account is in good standing. Thank you for your payment!
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500">Due: {getCurrentFeeDueDate()}</p>
                    <p className="text-xs text-gray-400 font-mono">
                      Admin: {ADMIN_ACCOUNT.slice(0, 8)}...{ADMIN_ACCOUNT.slice(-4)}
                    </p>
                    
                    {!isConnected ? (
                      <div className="space-y-2">
                        <button className="w-full bg-gray-100 text-gray-400 py-2 px-4 rounded-lg text-sm font-medium cursor-not-allowed">
                          Connect Wallet to Pay
                        </button>
                        <button className="w-full bg-orange-50 text-orange-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
                          Set Up Autopay
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <motion.button
                          onClick={handlePayFees}
                          disabled={payingFees}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          whileHover={!payingFees ? { scale: 1.02 } : {}}
                          whileTap={!payingFees ? { scale: 0.98 } : {}}
                        >
                          {payingFees ? (
                            <>
                              <motion.div
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              Paying Fees...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Pay Fees Now
                            </>
                          )}
                        </motion.button>
                        <button className="w-full bg-orange-50 text-orange-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
                          Set Up Autopay
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>

            {/* Dashboard Image */}
            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.img
                src="/Student Dashboard.svg"
                alt="Student Dashboard Illustration"
                className="max-w-full max-h-48 object-contain"
                whileHover={{ 
                  scale: 1.05,
                  rotate: 2,
                  transition: { duration: 0.3 }
                }}
              />
            </motion.div>
          </div>

          {/* Middle Row - Calendar & Events + Send Tokens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Calendar & Events */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex flex-col lg:flex-row gap-6 h-full">
                {/* Calendar */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    June 2025
                  </h3>
                  <div className="grid grid-cols-7 gap-2">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                      <div
                        key={idx}
                        className="text-center text-sm font-medium text-gray-500 p-2"
                      >
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((date) => (
                      <div
                        key={date}
                        className={`text-center p-2 text-sm rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                          date === 19
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        {date}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-gray-200"></div>

                {/* Events */}
                <div className="flex-1 lg:max-w-xs">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Events This Month
                  </h3>
                  <div className="space-y-4">
                  </div>
                </div>
              </div>
            </div>

            {/* Send Tokens - Updated with better styling */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Send Tokens</h3>
              </div>
              
              {!isConnected ? (
                <motion.div 
                  className="text-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="mb-4">
                    <Wallet className="w-12 h-12 text-gray-300 mx-auto" />
                  </div>
                  <p className="text-gray-500 mb-2">Connect your wallet to send tokens</p>
                  <p className="text-xs text-gray-400">You need to connect MetaMask first</p>
                </motion.div>
              ) : (
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Wallet Address
                    </label>
                    <motion.input
                      type="text"
                      placeholder="Enter recipient wallet address"
                      value={walletAddress}
                      onChange={(e) => {
                        setWalletAddress(e.target.value);
                        clearMessages();
                      }}
                      className="w-full p-3 bg-gray-50/70 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      disabled={sendingTokens}
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Number of Tokens
                    </label>
                    <motion.input
                      type="number"
                      placeholder="Enter number of tokens"
                      value={tokenAmount}
                      onChange={(e) => {
                        setTokenAmount(e.target.value);
                        clearMessages();
                      }}
                      className="w-full p-3 bg-gray-50/70 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      disabled={sendingTokens}
                      step="0.01"
                      min="0"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>

                  {/* Local success/error indicators */}
                  <AnimatePresence>
                    {error && sendingTokens === false && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          </div>
                          <p className="text-red-600 text-sm">{error}</p>
                        </div>
                      </motion.div>
                    )}

                    {successMessage && sendingTokens === false && successMessage.includes('✅') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-green-50 border border-green-200 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <p className="text-green-600 text-sm font-medium">Transaction successful!</p>
                        </div>
                      </motion.div>
                    )}

                    {successMessage && sendingTokens === false && !successMessage.includes('✅') && successMessage.includes('Transaction sent') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-600 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <p className="text-blue-600 text-sm font-medium">Processing transaction...</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button 
                    onClick={handleSendTokens}
                    disabled={sendingTokens || !walletAddress || !tokenAmount}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md group"
                    whileHover={!sendingTokens ? { scale: 1.02 } : {}}
                    whileTap={!sendingTokens ? { scale: 0.98 } : {}}
                  >
                    {sendingTokens ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        Send Tokens
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Bottom Row - Latest Transactions - Updated with real data */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Latest Transactions
                {loadingTransactions && (
                  <motion.div
                    className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-600 rounded-full ml-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </h3>
              <button 
                onClick={() => window.open(`https://etherscan.io/address/${account}`, '_blank')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                disabled={!account}
              >
                View All
              </button>
            </div>

            {!isConnected ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Connect your wallet to view transactions</p>
              </div>
            ) : loadingTransactions ? (
              <div className="text-center py-8">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex space-x-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-28"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No BITS token transactions found</p>
                <p className="text-xs text-gray-400 mt-1">Make your first transaction to see it here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx, index) => (
                  <motion.div
                    key={tx.hash}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        tx.from.toLowerCase() === account?.toLowerCase() ? 'bg-red-400' : 'bg-green-400'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {tx.from.toLowerCase() === account?.toLowerCase() ? 'Sent' : 'Received'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {tx.from.toLowerCase() === account?.toLowerCase() 
                            ? `To: ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`
                            : `From: ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`
                          }
                        </p>
                        <p className="text-xs text-gray-400">{tx.timestamp}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        tx.from.toLowerCase() === account?.toLowerCase() ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {tx.from.toLowerCase() === account?.toLowerCase() ? '-' : '+'}
                        {parseFloat(tx.value).toLocaleString()} BITS
                      </p>
                      <a
                        href={`https://etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        View <Eye className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;