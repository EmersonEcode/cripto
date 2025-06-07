import React, { useEffect, useState, ChangeEvent } from 'react';
import { FaSearch } from "react-icons/fa";
import { formatMoney } from '../../utils/format';
import "./styles.css"

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
        <h1>Mercado de Ativos</h1>
        
         <div className="search-container">
           <FaSearch size={20} />
           <input
          type="text"
          placeholder="Pesquisar moedas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
         </div>
        
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
                  <td>{formatMoney(coin.current_price)}</td>
                  <td className={coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </td>
                  <td>{formatMoney(coin.total_volume)}</td>
                  <td>{formatMoney(coin.market_cap)}</td>
                </tr>
                {expandedRows.has(coin.market_cap_rank) && (
                  <tr className="detail-row">
                    <td colSpan={6}>
                      <div className="details-grid">
                        <div>
                          <span>24h High:</span>
                          <span>{formatMoney(coin.high_24h)}</span>
                        </div>
                        <div>
                          <span>24h Low:</span>
                          <span>{formatMoney(coin.low_24h)}</span>
                        </div>
                        <div>
                          <span>All-Time High:</span>
                          <span>{formatMoney(coin.ath)} ({formatPercentage(coin.ath_change_percentage)})</span>
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

      
    </div>
  );
};

export default CoinTable;