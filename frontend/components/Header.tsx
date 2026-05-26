"use client";

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { activeXLayerChain, getSupportedConnector, getSupportedWalletConnectors } from "@/lib/wagmi";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const supportedConnectors = getSupportedWalletConnectors(connectors);

  const isCorrectNetwork = chainId === activeXLayerChain.id;

  const handleConnect = async (connectorId?: string) => {
    const connector = getSupportedConnector(connectors, connectorId);
    if (!connector) return;

    try {
      await connectAsync({ connector, chainId: activeXLayerChain.id });
    } catch (error) {
      console.error("Wallet connection failed", error);
    }
  };

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark" />
        <div className="brand-title">
          <span className="eyebrow">FIFABUDDY</span>
          <h1>FIFABuddy World Cup 2026 AI Agent DApp</h1>
          <p>X Layer mainnet prediction market and copy-trading dashboard</p>
        </div>
      </div>

      <div className="topbar-actions">
        <ThemeToggle />
        {isConnected && !isCorrectNetwork ? (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => switchChainAsync({ chainId: activeXLayerChain.id }).catch((error) => {
              console.error("Network switch failed", error);
            })}
          >
            Switch to X Layer Mainnet
          </button>
        ) : (
          <div className="wallet-pill">
            Network <strong>{activeXLayerChain.name}</strong>
          </div>
        )}

        {isConnected ? (
          <button type="button" className="wallet-pill wallet-pill-clickable" onClick={() => disconnect()}>
            <strong>{truncatedAddress}</strong>
            <span>Disconnect</span>
          </button>
        ) : (
          <div className="wallet-selector">
            {supportedConnectors.map((connector) => (
              <button
                key={connector.id}
                type="button"
                className="wallet-pill wallet-pill-clickable"
                onClick={() => void handleConnect(connector.id)}
              >
                <strong>Connect {connector.name}</strong>
                <span>Only supported wallet</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
