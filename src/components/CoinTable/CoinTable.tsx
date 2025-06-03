import React, { useEffect, useState, ChangeEvent } from 'react';

type CoinData = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  ath: number;
  ath_change_percentage: number;
  circulating_supply: number;
  total_supply: number;
  max_supply?: number;
};

const CoinTable: React.FC = () => {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadData = () => {
      try {
        const storedData = localStorage.getItem('topStak');
        if (!storedData) throw new Error('No data found');
        
        const parsedData = JSON.parse(storedData);
        if (!parsedData.data) throw new Error('Invalid data structure');

        const allCoins: CoinData[] = Object.values(parsedData.data)
          .flatMap((group: any) => group.coinData)
          .sort((a: CoinData, b: CoinData) => a.market_cap_rank - b.market_cap_rank);

        setCoins(allCoins);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleRow = (rank: number) => {
    const newExpandedRows = new Set(expandedRows);
    newExpandedRows.has(rank) ? newExpandedRows.delete(rank) : newExpandedRows.add(rank);
    setExpandedRows(newExpandedRows);
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (isLoading) return <div className="loading">Loading data...</div>;

  return (
    <div className="crypto-dashboard">
      <div className="header">
        <h1>Market Overview</h1>
        <input
          type="text"
          placeholder="Search coins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Coin</th>
              <th>Price</th>
              <th>24h</th>
              <th>Volume</th>
              <th>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoins.map(coin => (
              <React.Fragment key={coin.id}>
                <tr 
                  className="main-row"
                  onClick={() => toggleRow(coin.market_cap_rank)}
                >
                  <td>{coin.market_cap_rank}</td>
                  <td className="coin-info">
                    <img src={coin.image} alt={coin.name} />
                    <div>
                      <span className="name">{coin.name}</span>
                      <span className="symbol">{coin.symbol.toUpperCase()}</span>
                    </div>
                  </td>
                  <td>{formatCurrency(coin.current_price)}</td>
                  <td className={coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </td>
                  <td>{formatCurrency(coin.total_volume)}</td>
                  <td>{formatCurrency(coin.market_cap)}</td>
                </tr>
                {expandedRows.has(coin.market_cap_rank) && (
                  <tr className="detail-row">
                    <td colSpan={6}>
                      <div className="details-grid">
                        <div>
                          <span>24h High:</span>
                          <span>{formatCurrency(coin.high_24h)}</span>
                        </div>
                        <div>
                          <span>24h Low:</span>
                          <span>{formatCurrency(coin.low_24h)}</span>
                        </div>
                        <div>
                          <span>All-Time High:</span>
                          <span>{formatCurrency(coin.ath)} ({formatPercentage(coin.ath_change_percentage)})</span>
                        </div>
                        <div>
                          <span>Circulating Supply:</span>
                          <span>{formatLargeNumber(coin.circulating_supply)} {coin.symbol.toUpperCase()}</span>
                        </div>
                        {coin.max_supply && (
                          <div>
                            <span>Max Supply:</span>
                            <span>{formatLargeNumber(coin.max_supply)} {coin.symbol.toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .crypto-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          color: #f8f9fa;
          font-family: 'Inter', sans-serif;
          margin-bottom: 50px
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        h1 {
          font-size: 1.8rem;
          font-weight: 600;
          margin: 0;
        }
        
        .search-input {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid #495057;
          background-color: #212529;
          color: #f8f9fa;
          width: 300px;
          font-size: 1rem;
          transition: all 0.2s;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #6c757d;
          box-shadow: 0 0 0 2px rgba(108, 117, 125, 0.25);
        }
        
        .table-container {
          background-color: #212529;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        thead {
          background-color: #343a40;
        }
        
        th {
          padding: 1rem;
          text-align: left;
          font-weight: 500;
          color: #adb5bd;
          text-transform: uppercase;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
        }
        
        .main-row {
          border-bottom: 1px solid #343a40;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .main-row:hover {
          background-color: #2b3035;
        }
        
        .main-row td {
          padding: 1rem;
        }
        
        .coin-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .coin-info img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
        }
        
        .name {
          font-weight: 500;
          display: block;
        }
        
        .symbol {
          color: #6c757d;
          font-size: 0.875rem;
        }
        
        .positive {
          color: #20c997;
        }
        
        .negative {
          color: #ff6b6b;
        }
        
        .detail-row {
          background-color: #2b3035;
        }
        
        .detail-row td {
          padding: 0;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
          padding: 1rem;
        }
        
        .details-grid div {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #343a40;
        }
        
        .details-grid span:first-child {
          color: #adb5bd;
        }
        
        .loading {
          text-align: center;
          padding: 2rem;
          color: #adb5bd;
        }
      `}</style>
    </div>
  );
};

export default CoinTable;