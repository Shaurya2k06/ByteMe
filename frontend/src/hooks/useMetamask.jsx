import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

export function useMetaMask() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected! Please install MetaMask.")
      window.open('https://metamask.io/download/', '_blank')
      return
    }

    if (!window.ethereum.isMetaMask) {
      toast.error("Please use MetaMask!")
      return
    }

    try {
      setIsLoading(true)
      
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      })

      if (accounts.length > 0) {
        setAccount(accounts[0])
        setIsConnected(true)
        
        const chainId = await window.ethereum.request({
          method: "eth_chainId"
        })
        setChainId(chainId)
        
        toast.success("Connected to MetaMask successfully!")
      } else {
        toast.error("No accounts found")
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error)
      
      if (error.code === 4001) {
        toast.error("Connection rejected by user")
      } else if (error.code === -32002) {
        toast.error("Connection request already pending")
      } else {
        toast.error("Failed to connect to MetaMask")
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAccount(null)
    setIsConnected(false)
    setChainId(null)
    toast.info("Disconnected from MetaMask")
  }, [])

  const switchNetwork = useCallback(async (targetChainId) => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      })
    } catch (switchError) {
      console.error('Error switching network:', switchError)
      toast.error('Failed to switch network')
    }
  }, [])

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (window.ethereum && window.ethereum.isMetaMask) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts"
          })
          
          if (accounts.length > 0) {
            setAccount(accounts[0])
            setIsConnected(true)
            
            const chainId = await window.ethereum.request({
              method: "eth_chainId"
            })
            setChainId(chainId)
          }
        } catch (error) {
          console.error("Error checking connection:", error)
        }
      }
    }
    
    checkConnection()

    // Setup event listeners
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        console.log('Accounts changed:', accounts)
        if (accounts.length === 0) {
          disconnect()
        } else if (accounts[0] !== account) {
          setAccount(accounts[0])
          setIsConnected(true)
          toast.info("Account changed")
        }
      }

      const handleChainChanged = (chainId) => {
        console.log('Chain changed:', chainId)
        setChainId(chainId)
        toast.info("Network changed")
        // Optionally reload the page to reset state
        // window.location.reload()
      }

      const handleDisconnect = (error) => {
        console.log('MetaMask disconnected:', error)
        disconnect()
      }

      // Add event listeners
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
      window.ethereum.on("disconnect", handleDisconnect)

      // Cleanup listeners
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
          window.ethereum.removeListener("chainChanged", handleChainChanged)
          window.ethereum.removeListener("disconnect", handleDisconnect)
        }
      }
    }
  }, [account, disconnect])

  // Helper function to get network name
  const getNetworkName = useCallback((chainId) => {
    switch (chainId) {
      case '0x1': return 'Ethereum Mainnet'
      case '0xaa36a7': return 'Sepolia Testnet'
      case '0x539': return 'Localhost 8545'
      case '0x7a69': return 'Localhost 8545'
      default: return `Unknown Network (${chainId})`
    }
  }, [])

  // Helper function to format address
  const formatAddress = useCallback((address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [])

  return {
    isConnected,
    account,
    chainId,
    isLoading,
    connect,
    disconnect,
    switchNetwork,
    getNetworkName,
    formatAddress
  }
}