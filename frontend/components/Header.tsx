"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { getSupportedWalletConnectors, getWalletKind, xlayerMainnet, xlayerTestnet } from "@/lib/wagmi";
import { useNetwork } from "@/lib/NetworkContext";
import Link from "next/link";

export function Header() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { activeChain, isTestnet, toggleNetwork } = useNetwork();
  
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [connectingConnectorUid, setConnectingConnectorUid] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);

  const isCorrectNetwork = chainId === activeChain.id;
  const walletConnectors = getSupportedWalletConnectors(connectors);

  const handleSwitchNetwork = async () => {
    try {
      await switchChainAsync({ chainId: activeChain.id });
    } catch (error) {
      console.error("Network switch failed", error);
    }
  };

  const handleNetworkToggleClick = async () => {
    if (isConnected) {
      try {
        const nextChainId = isTestnet ? xlayerMainnet.id : xlayerTestnet.id;
        await switchChainAsync({ chainId: nextChainId });
      } catch (error) {
        console.error("Failed to switch network in wallet", error);
      }
    } else {
      toggleNetwork();
    }
  };

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <>
      <header className="topbar">
        <Link href="/" className="brand">
          <svg
            className="brand-logo-svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="4" r="2" />
            <circle cx="12" cy="20" r="2" />
            <circle cx="4" cy="12" r="2" />
            <circle cx="20" cy="12" r="2" />
            <circle cx="7.76" cy="7.76" r="2" />
            <circle cx="16.24" cy="16.24" r="2" />
            <circle cx="7.76" cy="16.24" r="2" />
            <circle cx="16.24" cy="7.76" r="2" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
          <span className="brand-text">FIFABuddy</span>
        </Link>

        <div className="topbar-actions">
          {/* ── Network toggle pill ── */}
          <button
            type="button"
            id="network-toggle-btn"
            className={`network-toggle-pill ${isTestnet ? "testnet" : "mainnet"}`}
            onClick={handleNetworkToggleClick}
            title={`Switch to ${isTestnet ? "Mainnet" : "Testnet"}`}
          >
            <span className="network-dot" />
            <span className="network-label">{isTestnet ? "Testnet" : "Mainnet"}</span>
            <svg
              className="network-swap-icon"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 16V4m0 0L3 8m4-4l4 4" />
              <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>

          {/* ── Wallet button ── */}
          {isConnected && !isCorrectNetwork ? (
            <button
              type="button"
              className="connect-wallet-btn network-mismatch"
              onClick={handleSwitchNetwork}
            >
              Switch to {activeChain.name}
            </button>
          ) : isConnected ? (
            <button
              type="button"
              className="wallet-connected-pill"
              onClick={() => disconnect()}
              title="Click to disconnect"
            >
              <span
                className="wallet-net-badge"
                data-testnet={isTestnet ? "true" : "false"}
              >
                {isTestnet ? "TEST" : "MAIN"}
              </span>
              <strong>{truncatedAddress}</strong>
              <span style={{ fontSize: "9px", opacity: 0.7 }}>Disconnect</span>
            </button>
          ) : (
            <button
              type="button"
              className="connect-wallet-btn"
              onClick={() => setIsWalletModalOpen(true)}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      {/* ── Wallet Select Modal ── */}
      {isWalletModalOpen && (
        <div className="wallet-modal-overlay" onClick={() => setIsWalletModalOpen(false)}>
          <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wallet-modal-header">
              <h3>Connect Wallet</h3>
              <button className="wallet-modal-close" onClick={() => setIsWalletModalOpen(false)}>✕</button>
            </div>
            <p className="wallet-modal-desc">Choose how you want to connect to X Layer {isTestnet ? "Testnet" : "Mainnet"}</p>
            {walletError ? <p className="wallet-modal-error">{walletError}</p> : null}
            <div className="wallet-connectors-list">
              {walletConnectors.map((connector) => {
                const walletKind = getWalletKind(connector);
                const connectorLabel = walletKind === "okx" ? "OKX Wallet" : "MetaMask";
                const isConnecting = connectingConnectorUid === connector.uid;

                return (
                <button
                  key={connector.uid}
                  className="wallet-connector-btn"
                  disabled={isConnecting}
                  onClick={async () => {
                    setConnectingConnectorUid(connector.uid);
                    setWalletError(null);

                    try {
                      await connectAsync({ connector, chainId: activeChain.id });
                      setIsWalletModalOpen(false);
                    } catch (err) {
                      console.error("Connection error:", err);
                      setWalletError(
                        err instanceof Error
                          ? err.message
                          : `Could not connect to ${connectorLabel}. Make sure the extension is installed and unlocked.`
                      );
                    } finally {
                      setConnectingConnectorUid(null);
                    }
                  }}
                >
                  <span className="wallet-connector-name">{connectorLabel}</span>
                  <span className="wallet-connector-arrow">{isConnecting ? "..." : "→"}</span>
                </button>
              );
              })}
              {walletConnectors.length === 0 ? (
                <p className="wallet-modal-error">
                  No MetaMask or OKX provider was detected. Install one of the extensions, then reload this page.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
