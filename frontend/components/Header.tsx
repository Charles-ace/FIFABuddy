"use client";

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { getSupportedConnector, xlayerMainnet, xlayerTestnet } from "@/lib/wagmi";
import { useNetwork } from "@/lib/NetworkContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const pathname = usePathname();
  const { mode, activeChain, isTestnet, toggleNetwork } = useNetwork();

  const isCorrectNetwork = chainId === activeChain.id;

  const handleConnect = async () => {
    const connector = getSupportedConnector(connectors);
    if (!connector) return;
    try {
      await connectAsync({ connector, chainId: activeChain.id });
    } catch (error) {
      console.error("Wallet connection failed", error);
    }
  };

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
        <span className="brand-text">DOTBALL</span>
      </Link>

      <nav className="nav-links">
        <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
          World Cup 2022
        </Link>
        <a href="#news" className="nav-link">Latest News</a>
        <a href="#predictions" className="nav-link">Predictions</a>
        <a href="#favourites" className="nav-link">Favourites</a>
      </nav>

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
            onClick={handleConnect}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
