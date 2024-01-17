import React from 'react';
import '../GameDetails/SystemRequirementsTable.css'

const SystemRequirementsTable = ({ systemRequirements }) => {
  return (
    <div className='system-requirements-table-container'>
      <h2>Requisitos do Sistema (PC)</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Mínimo</th>
            <th>Recomendado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Gráficos</td>
            <td>{systemRequirements.minGraphicsCard1} / {systemRequirements.minGraphicsCard2}</td>
            <td>{systemRequirements.recGraphicsCard1} / {systemRequirements.recGraphicsCard2}</td>
          </tr>
          <tr>
            <td>Processador</td>
            <td>{systemRequirements.minProcessor1} / {systemRequirements.minProcessor2}</td>
            <td>{systemRequirements.recProcessor1} / {systemRequirements.recProcessor2}</td>
          </tr>
          <tr>
            <td>RAM</td>
            <td>{systemRequirements.minRam} GB</td>
            <td>{systemRequirements.recRam} GB</td>
          </tr>
          <tr>
            <td>Armazenamento</td>
            <td>{systemRequirements.minStorage} GB</td>
            <td>{systemRequirements.recStorage} GB</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SystemRequirementsTable;
