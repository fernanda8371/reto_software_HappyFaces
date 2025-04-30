"use client"

import { useLocation, useNavigate } from "react-router-dom"
import "./PrizeDetails.css"

function PrizeDetails() {
  const location = useLocation()
  const navigate = useNavigate()

  // Obtener los datos del premio desde el estado de navegación o un fallback
  const prize = location.state?.prize || {
    title: "Premio no encontrado",
    subtitle: "No se encontraron detalles para este premio.",
    image: "/images/placeholder.jpg",
    description: "Por favor, selecciona un premio válido desde el dashboard.",
  }

  return (
    <div className="prize-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        Volver
      </button>
      <div className="prize-details-card">
        <div
          className="prize-image"
          style={{ backgroundImage: `url(${prize.image})` }}
        ></div>
        <div className="prize-info">
          <h1 className="prize-title">{prize.title}</h1>
          <h2 className="prize-subtitle">{prize.subtitle}</h2>
          <p className="prize-description">
            {prize.description || "Descripción no disponible para este premio."}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrizeDetails