import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

function Processors({ minRequirements, recRequirements, onChange }) {
  const [processors, setProcessors] = useState([]);

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

    fetchProcessors();
  }, []);

  return (
    <div className='field'>
      <h3>Processadorores</h3>
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
                name="minProcessor1"
                value={minRequirements.minProcessor1}
                onChange={onChange}
              >
                <option value="">Selecione...</option>
                {processors.map((processor) => (
                  <option key={processor.id} value={processor.name}>
                    {`${processor.manufacturer} ${processor.name}`}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <select
                name="recProcessor1"
                value={recRequirements.recProcessor1}
                onChange={onChange}
              >
                <option value="">Selecione...</option>
                {processors.map((processor) => (
                  <option key={processor.id} value={processor.name}>
                    {`${processor.manufacturer} ${processor.name}`}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <select
                name="minProcessor2"
                value={minRequirements.minProcessor2}
                onChange={onChange}
              >
                <option value="">Selecione...</option>
                {processors.map((processor) => (
                  <option key={processor.id} value={processor.name}>
                    {`${processor.manufacturer} ${processor.name}`}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <select
                name="recProcessor2"
                value={recRequirements.recProcessor2}
                onChange={onChange}
              >
                <option value="">Selecione...</option>
                {processors.map((processor) => (
                  <option key={processor.id} value={processor.name}>
                    {`${processor.manufacturer} ${processor.name}`}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          {/* Adicione mais linhas para outros requisitos, como RAM, placa de vídeo, etc. */}
        </tbody>
      </table>
    </div>
  );
}

export default Processors;
