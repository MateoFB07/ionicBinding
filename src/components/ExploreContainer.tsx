import React from 'react';

interface ExploreContainerProps {
  name?: string;
}

export const ExploreContainer: React.FC<ExploreContainerProps> = ({ name = 'Explorar' }) => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>{name}</h2>

      {/* Imagen */}
      <div style={{ margin: '20px 0' }}>
        <img 
          src="https://via.placeholder.com/200" 
          alt="Imagen de prueba" 
          style={{ borderRadius: '8px', maxWidth: '100%' }}
        />
      </div>

      {/* Tabla 3x2 (3 filas x 2 columnas) */}
      <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }} border={1}>
        <thead>
          <tr>
            <th>Encabezado 1</th>
            <th>Encabezado 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fila 1 - Columna 1</td>
            <td>Fila 1 - Columna 2</td>
          </tr>
          <tr>
            <td>Fila 2 - Columna 1</td>
            <td>Fila 2 - Columna 2</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};