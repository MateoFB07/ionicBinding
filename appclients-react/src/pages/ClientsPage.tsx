import { useEffect, useState, type JSX } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';

import type { Client } from '../interfaces/Client';
import { ClientsService } from '../services/ClientService';

export default function ClientsPage(): JSX.Element {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('clients'); // Para revisar que hace la conexión bien.
  
  useEffect(() => {
    let isMounted = true;

    const loadClients = async () => {
      try {
        const data = await ClientsService.getClients();
        if (isMounted) {
          setClients(data);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los clientes.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadClients();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="container mt-4">
      <h2>Clientes</h2>
      <Link to="/new-client" className="btn btn-primary mb-3">
        Nuevo Cliente
      </Link>

      {isLoading && <p role="status">Cargando clientes...</p>}
      {error && <p role="alert">Error al cargar clientes: {error}</p>}

      {!isLoading && !error && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>...</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
        </div>
      </IonContent>
    </IonPage>
  );
}
