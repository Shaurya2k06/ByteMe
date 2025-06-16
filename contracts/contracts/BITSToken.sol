// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BITS is ERC20, Ownable {
    // Autopay functionality
    struct AutopaySubscription {
        bool isActive;
        uint256 amount;
        uint256 lastPayment;
        uint256 interval; // in seconds (e.g., 2592000 for 30 days)
    }
    
    mapping(address => mapping(address => AutopaySubscription)) public autopaySubscriptions;
    mapping(address => bool) public authorizedCollectors;
    
    event AutopayEnabled(address indexed payer, address indexed collector, uint256 amount, uint256 interval);
    event AutopayDisabled(address indexed payer, address indexed collector);
    event AutopayExecuted(address indexed payer, address indexed collector, uint256 amount);
    event CollectorAuthorized(address indexed collector);
    event CollectorRevoked(address indexed collector);

    constructor(address initialOwner) ERC20("BITSToken", "BITS") Ownable(initialOwner) {
        _mint(initialOwner, 1000000000 * (10**uint256(decimals())));
        // Authorize the initial owner as a collector (admin)
        authorizedCollectors[initialOwner] = true;
    }

    modifier onlyAuthorizedCollector() {
        require(authorizedCollectors[msg.sender], "BITS: Not an authorized collector");
        _;
    }

    /**
     * @dev Authorize an address to collect autopay fees
     */
    function authorizeCollector(address collector) public onlyOwner {
        authorizedCollectors[collector] = true;
        emit CollectorAuthorized(collector);
    }

    /**
     * @dev Revoke collector authorization
     */
    function revokeCollector(address collector) public onlyOwner {
        authorizedCollectors[collector] = false;
        emit CollectorRevoked(collector);
    }

    /**
     * @dev Enable autopay for a specific collector
     * @param collector The address that will collect the payments
     * @param amount The amount to be deducted each interval
     * @param interval The time interval between payments (in seconds)
     */
    function enableAutopay(address collector, uint256 amount, uint256 interval) public {
        require(authorizedCollectors[collector], "BITS: Collector not authorized");
        require(amount > 0, "BITS: Amount must be greater than 0");
        require(interval > 0, "BITS: Interval must be greater than 0");
        
        autopaySubscriptions[msg.sender][collector] = AutopaySubscription({
            isActive: true,
            amount: amount,
            lastPayment: block.timestamp,
            interval: interval
        });
        
        emit AutopayEnabled(msg.sender, collector, amount, interval);
    }

    /**
     * @dev Disable autopay for a specific collector
     */
    function disableAutopay(address collector) public {
        autopaySubscriptions[msg.sender][collector].isActive = false;
        emit AutopayDisabled(msg.sender, collector);
    }

    /**
     * @dev Check if autopay is due for a user
     */
    function isAutopayDue(address payer, address collector) public view returns (bool) {
        AutopaySubscription memory subscription = autopaySubscriptions[payer][collector];
        if (!subscription.isActive) return false;
        
        return block.timestamp >= subscription.lastPayment + subscription.interval;
    }

    /**
     * @dev Execute autopay for a user (can be called by anyone, but only authorized collectors receive funds)
     */
    function executeAutopay(address payer, address collector) public returns (bool) {
        require(authorizedCollectors[collector], "BITS: Collector not authorized");
        
        AutopaySubscription storage subscription = autopaySubscriptions[payer][collector];
        require(subscription.isActive, "BITS: Autopay not active");
        require(isAutopayDue(payer, collector), "BITS: Autopay not due yet");
        require(balanceOf(payer) >= subscription.amount, "BITS: Insufficient balance");
        
        // Update last payment timestamp
        subscription.lastPayment = block.timestamp;
        
        // Execute the transfer
        _transfer(payer, collector, subscription.amount);
        
        emit AutopayExecuted(payer, collector, subscription.amount);
        return true;
    }

    /**
     * @dev Execute autopay for multiple users at once (batch processing)
     */
    function executeAutopayBatch(address[] calldata payers, address collector) public onlyAuthorizedCollector {
        for (uint i = 0; i < payers.length; i++) {
            if (isAutopayDue(payers[i], collector) && balanceOf(payers[i]) >= autopaySubscriptions[payers[i]][collector].amount) {
                executeAutopay(payers[i], collector);
            }
        }
    }

    /**
     * @dev Get autopay subscription details
     */
    function getAutopaySubscription(address payer, address collector) public view returns (
        bool isActive,
        uint256 amount,
        uint256 lastPayment,
        uint256 interval,
        uint256 nextPaymentDue
    ) {
        AutopaySubscription memory subscription = autopaySubscriptions[payer][collector];
        return (
            subscription.isActive,
            subscription.amount,
            subscription.lastPayment,
            subscription.interval,
            subscription.lastPayment + subscription.interval
        );
    }

    /**
     * @dev Creates `amount` new tokens and assigns them to `to`.
     * Emits a {Transfer} event with `from` set to the zero address.
     * Requirements:
     * - `to` cannot be the zero address.
     * - Only callable by the contract owner.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Destroys `amount` tokens from the caller.
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, deducting from the caller's
     * allowance. See {ERC20-_burn} and {ERC20-allowance}.
     * Requirements:
     * - the caller must have allowance for ``accounts``'s tokens of at least
     * `amount`.
     */
    function burnFrom(address account, uint256 amount) public {
        _spendAllowance(account, msg.sender, amount);
        _burn(account, amount);
    }

    function withdrawStuckBITS() public onlyOwner {
        uint256 balance = balanceOf(address(this));
        require(balance > 0, "BITSToken: No BITSTokens to withdraw from contract");
        _transfer(address(this), owner(), balance);
    }

    /**
     * @dev Allows the contract owner to withdraw any other ERC20 tokens
     * that were mistakenly sent to this contract's address.
     * @param tokenContract The address of the ERC20 token to withdraw.
     */
    function withdrawStuckERC20(IERC20 tokenContract) public onlyOwner {
        require(address(tokenContract) != address(0), "BITSToken: Token address cannot be zero");
        uint256 balance = tokenContract.balanceOf(address(this));
        require(balance > 0, "BITSToken: No tokens of this type to withdraw from contract");
        bool success = tokenContract.transfer(owner(), balance);
        require(success, "BITSToken: ERC20 token transfer failed");
    }
}