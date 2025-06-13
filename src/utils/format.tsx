export const formatMoney = (value: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  }).format(value);


export const formatPercentage = (value: number): string => {
            return new Intl.NumberFormat('pt-BR', {
              style: 'percent',  
              minimumFractionDigits: 2,  
              maximumFractionDigits: 2,
            }).format(value);
          };