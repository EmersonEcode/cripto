import React, { useState, useEffect, useCallback } from "react";
import { fetchCryptoStaking } from "./CryptoStaking";
import { fetchCryptoList } from "./CryptoList";
import { StakingCard } from "../components/TopStaking/StakingCard/StakingCard";
import { CoinData, StakingData } from "../models/CoinData";
import { FiRefreshCw } from "react-icons/fi";
import { PaginationStakList } from "../components/StakList/PaginationStakList/PaginationStakList";

const EXPIRATION_TIME = 1000 * 60 * 10; // 10 minutos

const formatMoney = (value: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  }).format(value);

interface TopStakingProps {
  topStakingData: StakingData[];
  styleContainer: React.CSSProperties;
  styleContainerData: React.CSSProperties;
  styleCard: React.CSSProperties;
  typeFetch: string;
}

const TopStaking: React.FC<TopStakingProps> = ({
  topStakingData,
  styleContainer,
  styleContainerData,
  styleCard,
  typeFetch,
}) => (
  <section style={styleContainer}>

    <div style={styleContainerData}>
      {topStakingData.map((data, index) =>
        data.coinData && data.coinData.length > 0 ? (
          <StakingCard
            style={styleCard}
            key={index}
            logo={data.coinData[0].image}
            typeMechanism={"Proof"}
            nameCrypto={data.coinData[0].name}
            rewardRate={"0,00%"}
            variation={data.coinData[0].price_change_percentage_24h}
            price={formatMoney(data.coinData[0].current_price)}
            symbol={data.coinData[0].symbol}
            id={data.coinData[0].id}
          />
        ) : (
          <p key={index} style={{ color: "white" }}>
            Dados não disponíveis para esta moeda
          </p>
        )
      )}
    </div>
  </section>
);

interface TopStakingContainerProps {
  perPage?: number;
  stakingQuatidade?: number;
  titleDataLocalStoreged: string;
  typeFetch?: "top" | "all";
  styleContainer: React.CSSProperties;
  styleContainerData: React.CSSProperties;
  styleCard: React.CSSProperties;
}

export const TopStakingContainer: React.FC<TopStakingContainerProps> = ({
  perPage = 0,
  stakingQuatidade = 0,
  titleDataLocalStoreged,
  typeFetch = "all",
  styleContainer,
  styleContainerData,
  styleCard,
}) => {
  const [allData, setAllData] = useState<StakingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAndCacheData = useCallback(async () => {
    setLoading(true);
    try {
      const coins = await fetchCryptoList(1, 200, "usd");
      const coinIds = coins.map((coin) => coin.id);
      const coinData: CoinData[] = await fetchCryptoStaking(coinIds);

      const stakingById: Record<string, StakingData> = {};
      coinData.forEach((coin) => {
        stakingById[coin.id] = { coinData: [coin] };
      });

      const stakingArray = Object.values(stakingById);
      setAllData(stakingArray);

      localStorage.setItem(
        titleDataLocalStoreged,
        JSON.stringify({
          data: stakingById,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Erro ao buscar dados de staking:", error);
      setAllData([]);
    } finally {
      setLoading(false);
    }
  }, [titleDataLocalStoreged]);

  useEffect(() => {
    const cached = localStorage.getItem(titleDataLocalStoreged);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > EXPIRATION_TIME;

      if (!isExpired && typeof data === "object") {
        const stakingArray: StakingData[] = Object.values(data);
        setAllData(stakingArray);
        setLoading(false);
        return;
      }
    }
    fetchAndCacheData();
  }, [fetchAndCacheData, titleDataLocalStoreged]);

  const topStakingData = allData.slice(0, 3);
  const listData = allData.slice(0);
  const totalPages = Math.ceil(listData.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = listData.slice(startIndex, startIndex + perPage);

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          padding: "2%",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "white",
        }}
      >
        Carregando...
      </div>
    );
  }

  return (
    <>
      {totalPages > 1 && typeFetch !== "top" && (
        <PaginationStakList
          currentPage={currentPage}
          changePage={changePage}
          totalPages={totalPages}
        />
      )}

      {typeFetch === "top" ? (
        <TopStaking
          typeFetch={typeFetch}
          topStakingData={topStakingData}
          styleContainer={styleContainer}
          styleContainerData={styleContainerData}
          styleCard={styleCard}
        />
      ) : paginatedData.length > 0 ? (
        <TopStaking
          typeFetch={typeFetch}
          topStakingData={paginatedData}
          styleContainer={styleContainer}
          styleContainerData={styleContainerData}
          styleCard={styleCard}
        />
      ) : (
        <p style={{ color: "white", padding: "2%" }}>
          Nenhum dado disponível.
        </p>
      )}
    </>
  );
};
