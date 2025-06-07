import axios from "axios";

const getDate = (): string => {
  return new Date().toLocaleDateString('en-CA').replace(/-/g, '');
}

const getDate7DaysAgo = (): string => {
  return new Date(new Date().setDate(new Date().getDate() - 7))
    .toLocaleDateString('en-CA')
    .replace(/-/g, '');
}

const FetchCoinCotationBRL = async (coin: string, days: number, dateInitial: string, dateFinal: string) => {
  try {
    const res = await axios.get(`https://economia.awesomeapi.com.br/json/daily/${coin}/${days}?start_date=${dateInitial}&end_date=${dateFinal}`);
    return res;
  } catch (error) {
    console.error('Erro ao pegar dados de conversão ', error);
    return null;
  }
}
export const ConvertCoin = async (value: number) => {
  const storageKey = "coin_cotation_usd_brl";
  const cacheExpiryMinutes = 15; // cache válido por 15 minutos

  let data = null;

  try {
    const cachedDataRaw = localStorage.getItem(storageKey);
    if (cachedDataRaw) {
      const cachedData = JSON.parse(cachedDataRaw);

      // Se cache tem timestamp e não expirou
      if (
        cachedData.timestamp &&
        (Date.now() - cachedData.timestamp < cacheExpiryMinutes * 60 * 1000) &&
        !cachedData.error
      ) {
        data = cachedData.data;
      }
    }
  } catch {
    localStorage.removeItem(storageKey);
  }

  if (!data) {
    try {
      const response = await FetchCoinCotationBRL(
        "USD",
        7,
        getDate7DaysAgo(),
        getDate()
      );

      if (!response || !response.data || !Array.isArray(response.data)) {
        // Salvar erro no cache pra evitar repetição
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            error: true,
            timestamp: Date.now(),
            data: null,
          })
        );
        console.error("Resposta inválida da API");
        return null;
      }

      data = response.data;

      localStorage.setItem(
        storageKey,
        JSON.stringify({
          error: false,
          timestamp: Date.now(),
          data,
        })
      );
    } catch (error) {
      // Erro na requisição: cache erro
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          error: true,
          timestamp: Date.now(),
          data: null,
        })
      );
      console.error("Erro ao buscar cotação:", error);
      return null;
    }
  }

  const cotation = parseFloat(data[0]?.high);
  if (isNaN(cotation)) {
    console.error("Valor de cotação inválido:", data[0]?.high);
    return null;
  }

  return cotation * value;
};
