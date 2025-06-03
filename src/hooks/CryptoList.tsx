// CryptoList.ts
import axios from "axios";
import { CoinData } from "../models/CoinData";

export const fetchCryptoList = async (
  page: number = 1,
  perPage: number = 10,
  typeCoin: string = 'usd'
): Promise<CoinData[]> => {
  try {
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets`,
      {
        params: {
          vs_currency: typeCoin,
          order: 'market_cap_desc',
          per_page: perPage,
          page: page,
          sparkline: false,
        },
      }
    );

    return res.data as CoinData[];
  } catch (error) {
    console.error('Erro ao buscar lista de moedas da CoinGecko:', error);
    return [];
  }
};
