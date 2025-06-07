import { TopStakingContent } from "./TopStakingContent";
import { PaginationStakList } from "../StakList/PaginationStakList/PaginationStakList";
import { useStakingData } from "../../hooks/TopStakingData";

interface Props {
  perPage?: number;
  titleDataLocalStoreged: string;
  typeFetch?: "top" | "all";
  styleContainer: React.CSSProperties;
  styleContainerData: React.CSSProperties;
  styleCard: React.CSSProperties;
}

export const TopStakingContainer: React.FC<Props> = ({
  perPage = 0,
  titleDataLocalStoreged,
  typeFetch = "all",
  styleContainer,
  styleContainerData,
  styleCard,
}) => {
  const {
    loading,
    currentPage,
    setCurrentPage,
    paginatedData,
    topData,
    totalPages,
  } = useStakingData(titleDataLocalStoreged, perPage, typeFetch);

  if (loading) return <p style={{ color: "white", padding: "2%" }}>Carregando...</p>;

  const dataToShow = typeFetch === "top" ? topData : paginatedData;

  return (
    <>
      {totalPages > 1 && typeFetch !== "top" && (
        <PaginationStakList
          currentPage={currentPage}
          changePage={setCurrentPage}
          totalPages={totalPages}
        />
      )}

      {dataToShow.length > 0 ? (
        <TopStakingContent
          typeFetch={typeFetch}
          topStakingData={dataToShow}
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
