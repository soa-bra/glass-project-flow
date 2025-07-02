import React from 'react';

interface PortfolioHealth {
  totalClients: number;
  activeContracts: number;
  renewalRate: number;
  churnRate: number;
  avgContractValue: number;
  clientSatisfaction: number;
}

interface ClientPortfolioHealthProps {
  portfolioHealth: PortfolioHealth;
}

export const ClientPortfolioHealth: React.FC<ClientPortfolioHealthProps> = ({ portfolioHealth }) => {
  return <div className="text-center text-gray-500 font-arabic">قيد التطوير</div>;
};
export const ClientSentiment = () => <div>قيد التطوير</div>;