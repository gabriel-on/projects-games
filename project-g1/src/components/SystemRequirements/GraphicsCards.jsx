import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

function GraphicsCards({ minRequirements, recRequirements, onChange }) {
  const [graphicsCards, setGraphicsCards] = useState([]);

  useEffect(() => {
    const fetchGraphicsCards = async () => {
      const database = getDatabase();
      const graphicsCardsRef = ref(database, 'graphicsCards');

      onValue(graphicsCardsRef, (snapshot) => {
        const graphicsCardsData = snapshot.val();
        if (graphicsCardsData) {
          const graphicsCardsArray = [];

          Object.keys(graphicsCardsData).forEach((manufacturer) => {
            Object.entries(graphicsCardsData[manufacturer]).forEach(([id, name]) => {
              graphicsCardsArray.push({ id, name, manufacturer });
            });
          });

          setGraphicsCards(graphicsCardsArray);
        }
      });
    };

    fetchGraphicsCards();
  }, []);

  return (
    <div className='field'>
      <h3>Placas de Vídeo</h3>
      <table>
        <thead>
          <tr>
            <th>Mínimos</th>
            <th>Recomendados</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <select
                name="minGraphicsCard1"
                value={minRequirements.minGraphicsCard1}
                onChange={onChange}
              >
                <option value="">Selecione...</option>
                {graphicsCards.map((graphicsCard) => (
                  <option key={graphicsCard.id} value={graphicsCard.name}>
                    {`${graphicsCard.manufacturer} ${graphicsCard.name}`}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <select
                name="recGraphicsCard1"
                value={recRequirements.recGraphicsCard1}
                onChange={onChange}
              >
                <option value="">Selecione...</option>
                {graphicsCards.map((graphicsCard) => (
                  <option key={graphicsCard.id} value={graphicsCard.name}>
                    {`${graphicsCard.manufacturer} ${graphicsCard.name}`}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <select
                name="minGraphicsCard2"
                value={minRequirements.minGraphicsCard2}
                onChange={onChange}
              >
                <option value="">Selecione...</option>
                {graphicsCards.map((graphicsCard) => (
                  <option key={graphicsCard.id} value={graphicsCard.name}>
                    {`${graphicsCard.manufacturer} ${graphicsCard.name}`}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <select
                name="recGraphicsCard2"
                value={recRequirements.recGraphicsCard2}
                onChange={onChange}
              >
                <option value="">Selecione...</option>
                {graphicsCards.map((graphicsCard) => (
                  <option key={graphicsCard.id} value={graphicsCard.name}>
                    {`${graphicsCard.manufacturer} ${graphicsCard.name}`}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          {/* Adicione mais linhas para outros requisitos de placa de vídeo, se necessário */}
        </tbody>
      </table>
    </div>
  );
}

export default GraphicsCards;