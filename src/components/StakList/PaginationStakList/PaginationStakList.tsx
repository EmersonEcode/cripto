import React from "react";

export const PaginationStakList = ({ currentPage, changePage, totalPages }) => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: "16px",
      gap: "12px",
      padding: '0 2%'
    }}>
      {/* Botão Anterior */}
      <button
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: "8px 16px",
          borderRadius: "6px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          background: "rgba(30, 35, 50, 0.8)",
          color: currentPage === 1 ? "rgba(255, 255, 255, 0.3)" : "#fff",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          fontWeight: "500",
          fontSize: "13px",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          ':hover:not(:disabled)': {
            background: "rgba(56, 43, 107, 0.6)",
            borderColor: "rgba(110, 0, 255, 0.4)",
            boxShadow: "0 2px 8px rgba(110, 0, 255, 0.2)"
          }
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Anterior
      </button>

      {/* Indicador de Página */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: "13px"
      }}>
        <span style={{
          background: "rgba(0, 210, 255, 0.1)",
          color: "#00d2ff",
          padding: "6px 12px",
          borderRadius: "4px",
          fontWeight: "500"
        }}>
          {currentPage}
        </span>
        <span>de</span>
        <span style={{ fontWeight: "500" }}>{totalPages}</span>
      </div>

      {/* Botão Próximo */}
      <button
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: "8px 16px",
          borderRadius: "6px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          background: "rgba(30, 35, 50, 0.8)",
          color: currentPage === totalPages ? "rgba(255, 255, 255, 0.3)" : "#fff",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          fontWeight: "500",
          fontSize: "13px",
          fontFamily: "'K2D', sans-serif",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          ':hover:not(:disabled)': {
            background: "rgba(56, 43, 107, 0.6)",
            borderColor: "rgba(110, 0, 255, 0.4)",
            boxShadow: "0 2px 8px rgba(110, 0, 255, 0.2)"
          }
        }}
      >
        Próximo
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
};