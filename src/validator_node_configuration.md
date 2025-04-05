# Validator Node Configuration

## Overview
This document outlines the configuration settings for the validator nodes in the Burn and Mint Token ecosystem. Proper configuration is essential for ensuring the reliability and performance of the network.

## Hardware Requirements
- **CPU**: Minimum 4 cores
- **RAM**: Minimum 16 GB
- **Storage**: SSD with at least 500 GB of available space
- **Network**: Stable internet connection with a minimum of 1 Mbps upload/download speed

## Software Requirements
- **Operating System**: Ubuntu 20.04 LTS or later
- **Node Software**: Latest version of the Ethereum client (e.g., Geth, OpenEthereum)
- **Docker**: For containerized deployments

## Configuration Steps
1. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install -y software-properties-common
   sudo add-apt-repository ppa:ethereum/ethereum
   sudo apt update
   sudo apt install -y geth
   ```

2. **Create a User for the Node**
   ```bash
   sudo adduser validator
   ```

3. **Configure Geth**
   Create a configuration file at `/etc/systemd/system/geth.service` with the following content:
   ```ini
   [Unit]
   Description=Geth Ethereum Node
   After=network.target

   [Service]
   User=validator
   ExecStart=/usr/bin/geth --syncmode "fast" --cache=2048 --rpc --rpcaddr "0.0.0.0" --rpcport "8545" --rpcapi "eth,web3,personal" --allow-insecure-unlock
   Restart=always
   RestartSec=3

   [Install]
   WantedBy=multi-user.target
   ```

4. **Start the Node**
   ```bash
   sudo systemctl enable geth
   sudo systemctl start geth
   ```

5. **Monitoring and Maintenance**
   - Use `journalctl -u geth` to monitor logs.
   - Regularly check the node's performance and update the software as needed.

## Conclusion
Following this configuration guide will help ensure that your validator node operates efficiently and reliably within the Burn and Mint Token ecosystem.
