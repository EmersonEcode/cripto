export interface CoinData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    price_change_percentage_24h: number;
    price?: number; // ← se existir no JSON
    reward?: number;
    tvl?: number;
    risk?: string;
  }
  
  export interface StakingData {
    coinData: CoinData[] | null;
  }
  