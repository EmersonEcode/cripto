
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface StakingRewardRateProps {
  coinSlug: string;
}

type CachedRewardData = {
  data: {
    rewardRate: number;
  };
  timestamp: number;
};

interface GraphQLResponse {
  data: {
    assets: {
      reward: {
        annualized: number;
      } | null;
    }[];
  };
}

export const StakingRewardRate: React.FC<StakingRewardRateProps> = ({ coinSlug }) => {
  const [rewardRate, setRewardRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const cacheKey = `staking-reward-${coinSlug}`;

  const readFromCache = (): CachedRewardData | null => {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) return JSON.parse(raw) as CachedRewardData;
    } catch (e) {
      console.warn('Erro ao ler cache:', e);
    }
    return null;
  };

  const writeToCache = (rate: number) => {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ data: { rewardRate: rate }, timestamp: Date.now() })
    );
  };

  const fetchRewardRate = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    const cachedData = readFromCache();

    if (cachedData && Date.now() - cachedData.timestamp < 4 * 60 * 60 * 1000) {
      setRewardRate(cachedData.data.rewardRate);
      setLastUpdated(new Date(cachedData.timestamp));
      setLoading(false);
      return;
    }

    const query = `
      query {
        assets(where: { slug: { _eq: "${coinSlug}" } }) {
          reward {
            annualized
          }
        }
      }
    `;

    try {
      const response = await axios.post<GraphQLResponse>(
        'https://api.stakingrewards.com/graphql',
        { query },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 4a0df0cf-e10e-4317-9c7a-18fbfbd786ab`,
          },
        }
      );

      const rate = response.data?.data?.assets?.[0]?.reward?.annualized;

      if (rate == null) throw new Error('Reward rate não disponível para esta moeda');

      setRewardRate(rate);
      setLastUpdated(new Date());
      writeToCache(rate);

    } catch (err) {
      console.error('Erro ao buscar reward rate:', err);
      setError('Erro ao carregar');

      const fallbackCache = readFromCache();
      if (fallbackCache) {
        setRewardRate(fallbackCache.data.rewardRate);
        setLastUpdated(new Date(fallbackCache.timestamp));
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coinSlug) fetchRewardRate();
  }, [coinSlug]);

  const getColor = () => {
    if (rewardRate === null) return '#fff';
    if (rewardRate > 10) return '#00ff99';
    if (rewardRate > 5) return '#ffcc00';
    return '#ff3e3e';
  };

  const renderContent = () => {
    if (loading && rewardRate === null) {
      return <div style={{ color: '#fff', fontSize: '15px' }}>Carregando...</div>;
    }
    if (error) {
      return <div style={{ color: '#ff3e3e', fontSize: '15px' }}>{error}</div>;
    }
    if (rewardRate !== null) {
      return (
        <div style={{ color: getColor(), fontSize: '10px', fontWeight: 'bold' }}>
          {rewardRate.toFixed(2)}% <span style={{ fontSize: '25px' }}>APY</span>
        </div>
      );
    }
    return <div style={{ color: '#ffffff60', fontSize: '12px' }}>Não disponível</div>;
  };

  return (
    <div
      style={{
        padding: '5px',
        borderRadius: '8px',
        border: `1px solid ${getColor()}30`,
        minWidth: '140px',
        textAlign: 'center',
      }}
      aria-live="polite"
    >
      <div style={{ color: '#ffffff99', fontSize: '12px', marginBottom: '8px' }}>
        Taxa de Recompensa
      </div>

      {renderContent()}

      <div
        style={{ color: '#ffffff60', fontSize: '10px', marginTop: '8px' }}
        title={lastUpdated?.toString() || ''}
      >
        {lastUpdated
          ? `Atualizado em: ${lastUpdated.toLocaleDateString()} ${lastUpdated.toLocaleTimeString()}`
          : new Date().toLocaleDateString()}
      </div>
    </div>
  );
};
