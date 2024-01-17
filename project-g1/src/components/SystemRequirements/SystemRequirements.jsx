import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import GraphicsCards from './GraphicsCards';
import Processors from './Processors';
import './SystemRequirements.css'

function SystemRequirements({ systemRequirements, onChange }) {
  const [processors, setProcessors] = useState([]);
  const [graphicsCards, setGraphicsCards] = useState([]);

  useEffect(() => {
    const fetchProcessors = async () => {
      const database = getDatabase();
      const processorsRef = ref(database, 'processors');

      onValue(processorsRef, (snapshot) => {
        const processorsData = snapshot.val();
        if (processorsData) {
          const processorsArray = [];

          Object.keys(processorsData).forEach((manufacturer) => {
            Object.entries(processorsData[manufacturer]).forEach(([id, name]) => {
              processorsArray.push({ id, name, manufacturer });
            });
          });

          setProcessors(processorsArray);
        }
      });
    };

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

    fetchProcessors();
    fetchGraphicsCards();
  }, []);

  return (
    <div className='system-requirements-container'>
      <h3>Requisitos do Sistema (PC)</h3>
      <table>
        <tbody>
          <tr>
            <td>
              <GraphicsCards
                minRequirements={systemRequirements}
                recRequirements={systemRequirements}
                onChange={onChange}
                graphicsCards={graphicsCards}
              />
            </td>
            <td>
              <Processors
                minRequirements={systemRequirements}
                recRequirements={systemRequirements}
                onChange={onChange}
                processors={processors}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>
                RAM Mínima:
                <input
                  type="text"
                  name="minRam"
                  value={systemRequirements.minRam}
                  onChange={onChange}
                />
              </label>
            </td>
            <td>
              <label>
                RAM Recomendada:
                <input
                  type="text"
                  name="recRam"
                  value={systemRequirements.recRam}
                  onChange={onChange}
                />
              </label>
            </td>
          </tr>
          <tr>
            <td>
              <label>
                Armazenamento Mínimo:
                <input
                  type="text"
                  name="minStorage"
                  value={systemRequirements.minStorage}
                  onChange={onChange}
                />
              </label>
            </td>
            <td>
              <label>
                Armazenamento Recomendado:
                <input
                  type="text"
                  name="recStorage"
                  value={systemRequirements.recStorage}
                  onChange={onChange}
                />
              </label>
            </td>
          </tr>
          {/* Adicione mais linhas para outros requisitos, se necessário */}
        </tbody>
      </table>
    </div>
  );
}

export default SystemRequirements;
