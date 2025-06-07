import { useCallback, useEffect, useState } from "react";
import { fetchCryptoStaking } from "./CryptoStaking";
import { fetchCryptoList } from "./CryptoList";
import { StakingData } from "../models/CoinData";

const EXPIRATION_TIME = 1000 * 60 * 10;

export const useStakingData = (
  title: string,
  perPage: number,
  typeFetch: "top" | "all"
) => {
  const [data, setData] = useState<StakingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const coins = await fetchCryptoList(1, 100, "usd");
      const coinIds = coins.map((coin) => coin.id);
      const coinData = await fetchCryptoStaking(coinIds);

      const stakingById: Record<string, StakingData> = {};
      coinData.forEach((coin) => {
        stakingById[coin.id] = { coinData: [coin] };
      });

      const stakingArray = Object.values(stakingById);
      setData(stakingArray);

      localStorage.setItem(
        title,
        JSON.stringify({ data: stakingById, timestamp: Date.now() })
      );
    } catch (error) {
      console.error("Erro ao buscar staking:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [title]);

  useEffect(() => {
    const cached = localStorage.getItem(title);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const expired = Date.now() - timestamp > EXPIRATION_TIME;
      if (!expired) {
        setData(Object.values(data));
        setLoading(false);
        return;
      }
    }
    fetchData();
  }, [fetchData, title]);

  const totalPages = Math.ceil(data.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = data.slice(startIndex, startIndex + perPage);

  const topData = data.slice(0, 3);

  return {
    loading,
    currentPage,
    setCurrentPage,
    paginatedData,
    topData,
    totalPages,
  };
};
