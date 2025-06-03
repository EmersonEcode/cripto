import React, { useEffect, useState } from "react";
import axios from "axios";

export const CryptoChart = (coinId = 'bitcoin', days = 30) =>{
    const [chartData, setChartData] = useState<{time: string; price: number}[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchChart = async () => {
            setLoading(true)
            try{
                const res = await axios.get(
                    `/v3/coins/${coinId}/market_chart`,
                    {
                        params: {
                            vs_currency: 'brl',
                            days,
                        }
                    }

                )
                const prices = res.data.prices.map((p: [number, number]) => 
                ({
                    time: new Date(p[0]).toLocaleDateString(),
                    price: p[1]
                })

                
            )
            setChartData(prices)
            }catch(error){
                console.error('Erro ao buscar dados da CoinGenko: ', error);
            }finally{
                setLoading(false)
            }

        }
        fetchChart()
    }, [coinId, days])


    return {chartData, loading}
}