import { useEffect, useState, type JSX } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';

import type { Client } from '../interfaces/Client';
import { ClientsService } from '../services/ClientService';

export default function ClientsPage(): JSX.Element {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClients = async () => {
    try {
      const data = await ClientsService.getClients();
      setClients(data);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los clientes.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (id === undefined) {
      return;
    }

    const confirmDelete = window.confirm('¿Seguro que quieres eliminar este cliente?');

    if (!confirmDelete) {
      return;
    }

    try {
      await ClientsService.deleteClient(id);
      setClients((currentClients) => currentClients.filter((client) => client.id !== id));
      alert('Cliente eliminado correctamente');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'No se pudo eliminar el cliente.');
    }
  };

  useEffect(() => {
    void loadClients();
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
                    <td>
                      <Link to={`/clients/edit/${client.id}`} className="btn btn-warning btn-sm me-2">
                        Editar
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => void handleDelete(client.id)}
                      >
                        Eliminar
                      </button>
                    </td>
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
