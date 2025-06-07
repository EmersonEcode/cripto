import { StakingData } from "../../models/CoinData";
import { formatMoney } from "../../utils/format";
import { StakingCard } from "./StakingCard/StakingCard";

interface TopStakingProps {
  topStakingData: StakingData[];
  styleContainer: React.CSSProperties;
  styleContainerData: React.CSSProperties;
  styleCard: React.CSSProperties;
  typeFetch: string;
}

export const TopStakingContent: React.FC<TopStakingProps> = ({
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
            key={`${data.coinData[0].id}-${index}`}
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




