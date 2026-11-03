import './ExploreContainer.css';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <section className="home-content">
      <h1>{name}</h1>
      <img
        className="home-photo"
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
        alt="Paisaje natural"
      />
      <table className="home-table">
        <thead>
          <tr>
            <th>Columna 1</th>
            <th>Columna 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fila 1 - Dato A</td>
            <td>Fila 1 - Dato B</td>
          </tr>
          <tr>
            <td>Fila 2 - Dato A</td>
            <td>Fila 2 - Dato B</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default ExploreContainer;
