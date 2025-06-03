// CryptoStaking.ts
import { CoinData } from "../models/CoinData";

export const fetchCryptoStaking = async (ids: string[]): Promise<CoinData[]> => {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&ids=${ids.join(",")}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados de staking:", error);
    return [];
  }
};
