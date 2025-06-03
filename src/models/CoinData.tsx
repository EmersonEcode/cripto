export interface CoinData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    price_change_percentage_24h: number;
  }
  
  export interface StakingData {
    coinData: CoinData[] | null;
  }
  