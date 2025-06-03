import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { ConvertCoin } from "../../ConvertCoin/ConvertCoin";

interface MiniChartProps {
  coinId: string;
}

const CACHE_EXPIRATION_TIME = 1000 * 60 * 15; // 15 minutos

const formatMoney = (value: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const MiniChart: React.FC<MiniChartProps> = ({ coinId }) => {
  const [priceData, setPriceData] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);
  const [gradientColor, setGradientColor] = useState<string>("#00ff99");
  const [loading, setLoading] = useState<boolean>(true);

  const cacheKey = `crypto-chart-${coinId}`;

  const getCachedData = (key: string) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const isValid = Date.now() - parsed.timestamp < CACHE_EXPIRATION_TIME;
      return isValid ? parsed.data : null;
    } catch (e) {
      console.warn("Erro ao ler cache:", e);
      return null;
    }
  };

  const applyChartData = (sparkline: number[], price: number, change: number) => {
    setPriceData(sparkline);
    setCurrentPrice(price);
    setPercentageChange(change);
    setGradientColor(change >= 0 ? "#5eee26" : "#ff3e3e");
  };

  const fetchDataWithCache = async () => {
    const cached = getCachedData(cacheKey);
    if (cached) {
      applyChartData(cached.sparkline, cached.currentPrice, cached.percentageChange);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: true,
        },
      });

      const sparklineUSD = response.data.market_data.sparkline_7d.price;

      const convertedSparkline = await Promise.all(
        sparklineUSD.map(async (item) => {
          try {
            return await ConvertCoin(item);
          } catch (e) {
            console.warn("Erro na conversão:", e);
            return 0;
          }
        })
      );

      const firstPrice = convertedSparkline[0];
      const lastPrice = convertedSparkline[convertedSparkline.length - 1];
      const change = ((lastPrice - firstPrice) / firstPrice) * 100;

      applyChartData(convertedSparkline, lastPrice, change);

      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: {
            sparkline: convertedSparkline,
            currentPrice: lastPrice,
            percentageChange: change,
          },
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      const fallback = getCachedData(cacheKey);
      if (fallback) {
        applyChartData(fallback.sparkline, fallback.currentPrice, fallback.percentageChange);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    setPriceData([]);
    fetchDataWithCache();

    const intervalId = setInterval(fetchDataWithCache, 1000 * 60 * 5);
    return () => clearInterval(intervalId);
  }, [coinId]);

  const options = {
    chart: {
      id: "sparkline-chart",
      sparkline: { enabled: true },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      foreColor: "#fff",
      background: "transparent",
    },
    stroke: {
      curve: "smooth",
      width: 3,
      lineCap: "round",
    },
    title: {
      text: 'variação de preço nos últimos 7 dias',
      align: 'right',
      style: {
        fontSize: 10,
        color: '#ffffff60'
      }
    
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: [gradientColor],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.2,
        stops: [0, 100],
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: "monospace",
      },
      y: {
        formatter: formatMoney,
      },
    },
    markers: {
      size: 0,
      colors: ["#000"],
      strokeColors: gradientColor,
      strokeWidth: 2,
      hover: { size: 4 },
    },
    grid: {
      show: false,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    yaxis: { show: false },
    xaxis: {
      show: false,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: { show: false },
      tooltip: { enabled: false },
    },
    theme: { mode: "dark" },
  };

  const series = [{ name: "Preço", data: priceData }];

  if (loading || priceData.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "8px",
        }}
      >
        <div className="pulse-effect" style={{
          width: "40px",
          height: "20px",
          background: "linear-gradient(90deg, #0080ff, #00ffff)",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }} />
        <div style={{ color: "#ffffff99", fontSize: "12px", marginLeft: "8px" }}>
          Carregando gráfico...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: "100%",
      height: "80%",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at center, rgba(75, 2, 70, 0.1) 0%, transparent 70%)",
        zIndex: 0,
      }}></div>

      <ReactApexChart
        key={coinId}
        options={options}
        series={series}
        type="area"
        height="100%"
        width="100%"
      />

      <div style={{
        position: "absolute",
        top: "-50%",
        left: "-50%",
        right: "-50%",
        bottom: "-50%",
        background: `radial-gradient(circle at center, ${gradientColor} 0%, transparent 70%)`,
        opacity: 0.15,
        zIndex: -1,
        fontSize: 10,
        animation: "rotate 20s linear infinite",
        transformOrigin: "center center",
      }}></div>
    </div>
  );
};
