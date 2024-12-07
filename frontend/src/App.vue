<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-logo">
        <h1>Coinflip</h1>
      </div>
      <div class="navbar-buttons">
        <span v-if="walletAddress" class="eth-balance">
          {{ ethBalance }} ETH
        </span>
        <button v-if="!walletAddress" @click="connectWallet" class="connect-wallet-button">
          Connect Wallet
        </button>
        <span v-else class="wallet-address">
          {{ truncatedWalletAddress }}
        </span>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <div class="game-container">
        <h2>COINFLIP</h2>

        <!-- Coinflip GIF -->
        <div class="gif-container">
          <img
            src="https://freight.cargo.site/t/original/i/8c26cb1e6d8b7aead75057ad75428318b5e604d054e018e62d7b3a628c6bb70b/coinflip_01.gif"
            alt="Coinflip GIF"
            class="coinflip-gif"
            height="150px"
            width="150px"
          />
        </div>

        <!-- Game Content -->
        <div class="game-ui">
          <div class="play-options">
            <h3>I like</h3>
            <div class="choices">
              <button
                class="choice-button"
                :class="{ selected: selectedChoice === 'Heads' }"
                @click="selectChoice('Heads')"
              >
                Heads
              </button>
              <button
                class="choice-button"
                :class="{ selected: selectedChoice === 'Tails' }"
                @click="selectChoice('Tails')"
              >
                Tails
              </button>
            </div>
            <h3>For</h3>
            <div class="amounts">
              <div class="row">
                <button
                  class="amount-button"
                  :class="{ selected: selectedBet === 0.001 }"
                  @click="selectBet(0.001)"
                >
                  0.001
                </button>
                <button
                  class="amount-button"
                  :class="{ selected: selectedBet === 0.005 }"
                  @click="selectBet(0.005)"
                >
                  0.005
                </button>
                <button
                  class="amount-button"
                  :class="{ selected: selectedBet === 0.01 }"
                  @click="selectBet(0.01)"
                >
                  0.01
                </button>
              </div>
              <div class="row">
                <button
                  class="amount-button"
                  :class="{ selected: selectedBet === 0.02 }"
                  @click="selectBet(0.02)"
                >
                  0.02
                </button>
                <button
                  class="amount-button"
                  :class="{ selected: selectedBet === 0.05 }"
                  @click="selectBet(0.05)"
                >
                  0.05
                </button>
                <button
                  class="amount-button"
                  :class="{ selected: selectedBet === 0.1 }"
                  @click="selectBet(0.1)"
                >
                  0.1
                </button>
              </div>
            </div>
            <div class="spacer"></div>
            <button class="action-button" @click="executeFlip">
              Double Or Nothing
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Web3 from "web3"; // Import Web3.js
import abi from "./abi.json"; // Import ABI file

export default {
  name: "App",
  data() {
    return {
      walletAddress: null,
      selectedChoice: null,
      selectedBet: null,
      ethBalance: "0",
      contractAddress: "0x6727C33563Aa920AFdea1f34Ec21d102Cc30A471",
      web3: null,
      contract: null,
    };
  },
  computed: {
    truncatedWalletAddress() {
      return this.walletAddress ? `...${this.walletAddress.slice(-6)}` : "";
    },
  },
  methods: {
    async connectWallet() {
      if (typeof window.ethereum !== "undefined") {
        try {
          this.web3 = new Web3(window.ethereum);
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          this.walletAddress = accounts[0];
          console.log("Wallet connected:", this.walletAddress);

          this.contract = new this.web3.eth.Contract(abi, this.contractAddress);

          await this.updateEthBalance();
          await this.switchToRequiredNetwork();
        } catch (error) {
          console.error("Error connecting wallet:", error);
        }
      } else {
        alert("MetaMask is not installed. Please install it to use this dApp.");
      }
    },
    async updateEthBalance() {
      try {
        const balance = await this.web3.eth.getBalance(this.walletAddress);
        this.ethBalance = this.web3.utils.fromWei(balance, "ether");
      } catch (error) {
        console.error("Failed to fetch ETH balance:", error);
      }
    },
    async switchToRequiredNetwork() {
      const requiredChainId = "0x14a34"; // Base Sepolia network
      const requiredNetwork = {
        chainId: requiredChainId,
        chainName: "Base Sepolia",
        nativeCurrency: {
          name: "Sepolia ETH",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: ["https://sepolia.base.org"],
        blockExplorerUrls: ["https://sepolia.basescan.org"],
      };

      try {
        const chainId = await this.web3.eth.getChainId();
        if (chainId !== parseInt(requiredChainId, 16)) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: requiredChainId }],
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              // Add the network if it doesn't exist
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [requiredNetwork],
              });
            } else {
              console.error("Failed to switch the network:", switchError);
            }
          }
        }
      } catch (error) {
        console.error("Error checking or switching network:", error);
      }
    },
    selectChoice(choice) {
      this.selectedChoice = choice;
      console.log("Selected Choice:", this.selectedChoice);
    },
    selectBet(bet) {
      this.selectedBet = bet;
      console.log("Selected Bet:", this.selectedBet);
    },
    async executeFlip() {
      if (!this.walletAddress) {
        alert("Please connect your wallet first.");
        return;
      }

      if (!this.selectedChoice || !this.selectedBet) {
        alert("Please select a side and a bet amount.");
        return;
      }

      try {
        console.log("Executing flip...");
        await this.contract.methods
        .flip()
        .send({
          from: this.walletAddress,
          value: this.web3.utils.toWei(this.selectedBet.toString(), "ether"),
        })
        .on("transactionHash", (hash) => {
          console.log("Transaction Hash:", hash);
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          if (confirmationNumber === 1) { // Wait for the first confirmation
            console.log("Transaction confirmed:", receipt);
          }
        })

        const previousBalance = this.ethBalance
        await this.updateEthBalance();
        if(this.ethBalance>previousBalance){
          alert("YOU WON")
        }else {
          alert("YOU LOST")
        }


      } catch (error) {
        console.error("Error executing flip:", error);
        alert("Transaction failed. Please try again.");
      }
    },
  },
};
</script>

<style>
/* General Styles */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #f2f2f2; /* Light gray background */
}

/* Navbar Styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em 2em;
  background-color: #ffffff;
  border-bottom: 1px solid #eee;
}

.navbar-logo h1 {
  margin: 0;
  font-size: 1.5em;
  color: #333;
}

.navbar-buttons {
  display: flex;
  align-items: center;
  gap: 1em;
}

.connect-wallet-button {
  padding: 0.5em 1em;
  font-size: 1em;
  color: #ffffff;
  background-color: #d4af37;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.connect-wallet-button:hover {
  background-color: #b68b2f;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.wallet-address {
  font-size: 1em;
  color: #333;
  padding: 0.5em 1em;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.eth-balance {
  font-size: 1em;
  color: #333;
  background-color: #f8f9fa;
  padding: 0.5em 1em;
  border-radius: 5px;
}

/* Game Container */
.game-container {
  max-width: 1000px;
  margin: 3em auto;
  background-color: #ffffff; /* White background for the game container */
  padding: 3em;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2); /* Stronger shadow */
}

/* GIF Container */
.gif-container {
  display: flex;
  justify-content: center;
  margin: 1.5em 0;
}

.coinflip-gif {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}

/* Main Content Styles */
.main-content {
  text-align: center;
}

.instructions {
  text-align: left;
  display: inline-block;
  margin: 1em auto;
  font-size: 1em;
  line-height: 1.5;
  color: #555;
}

/* Play Options */
.play-options {
  margin-top: 2em;
}

.choices,
.amounts {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
}

.amounts .row {
  display: flex;
  gap: 0.5em;
}

.spacer {
  height: 1.5em;
}

.choice-button,
.amount-button,
.action-button {
  padding: 0.5em 1em;
  font-size: 1em;
  color: #ffffff;
  background-color: #d4af37;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.choice-button.selected,
.amount-button.selected {
  background-color: #6c757d;
  color: #ffffff;
}

.choice-button:hover,
.amount-button:hover,
.action-button:hover {
  background-color: #b68b2f;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
