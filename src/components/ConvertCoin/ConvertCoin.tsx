import React from "react";
import axios, { AxiosResponse } from "axios";



const getDate = (): string => {
    const date = new Date().toLocaleDateString('en-US')
    date.replace('/', "")
    return date

}
const getDate7DaysAgo = (): string => {
    const date = new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString('en-US')
    date.replace('/', "")
    return date

}

// Função para buscar cotação
const FetchCoinCotationBRL = async (coin, days, dateInitial, dateFinal) => {
    try {
        const res = await axios.get(`https://economia.awesomeapi.com.br/json/daily/${coin}/${days}?start_date=${dateInitial}&end_date=${dateFinal}`);
        return res;
    } catch (error) {
        console.error('Erro ao pegar dados de conversão ', error);
    }
}

// Função para converter o valor, com lógica de cache no localStorage
export const ConvertCoin = async (value) => {
    let data;
    const storageKey = 'coin_cotation_usd_brl';

    // Verificar se as cotações estão no localStorage
    const cachedData = localStorage.getItem(storageKey);

    if (cachedData) {
        // Se os dados estiverem no localStorage, usamos eles diretamente
        data = JSON.parse(cachedData);
    } else {
        // Se não tiver dados no localStorage, faz a requisição
        console.log('Fazendo requisição para buscar cotação');
        const getCotation = await FetchCoinCotationBRL('USD', 7, getDate7DaysAgo(), getDate()).then(response => JSON.stringify(response));
        data = JSON.parse(getCotation);

        // Armazenar os dados no localStorage para futuras consultas
        localStorage.setItem(storageKey, JSON.stringify(data));
    }

    const valueCotation = data.data[0].high;
    return valueCotation * value;
}
