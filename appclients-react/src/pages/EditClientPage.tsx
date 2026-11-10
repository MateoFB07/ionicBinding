import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { Client } from '../interfaces/Client';
import { ClientsService } from '../services/ClientService';

export default function EditClientPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [client, setClient] = useState<Client>({
    name: '',
    email: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadClient = async () => {
      const clientId = Number(id);

      if (!id || Number.isNaN(clientId)) {
        navigate('/clients');
        return;
      }

      try {
        const existingClient = await ClientsService.getClient(clientId);
        setClient(existingClient);
      } catch (error) {
        console.error('Error loading client', error);
        navigate('/clients');
      } finally {
        setIsLoading(false);
      }
    };

    void loadClient();
  }, [id, navigate]);

  const save = async () => {
    const clientId = Number(id);

    if (!id || Number.isNaN(clientId)) {
      return;
    }

    await ClientsService.updateClient(clientId, client);
    alert('Cliente modificado correctamente');
    navigate('/clients');
  };

  if (isLoading) {
    return <p className="container mt-4">Cargando cliente...</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Editar Cliente</h2>
      <input
        className="form-control mb-2"
        placeholder="Nombre"
        value={client.name}
        onChange={(e) => setClient({ ...client, name: e.target.value })}
      />
      <input
        className="form-control mb-2"
        placeholder="Email"
        type="email"
        value={client.email}
        onChange={(e) => setClient({ ...client, email: e.target.value })}
      />
      <input
        className="form-control mb-2"
        placeholder="Teléfono"
        type="tel"
        value={client.phone}
        onChange={(e) => setClient({ ...client, phone: e.target.value })}
      />
      <button className="btn btn-success" onClick={() => void save()}>
        Guardar cambios
      </button>
    </div>
  );
}
