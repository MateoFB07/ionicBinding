import { useState } from 'react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Client } from '../interfaces/Client';
import { ClientsService } from '../services/ClientService';

export default function NewClientPage(): ReactElement {
  const navigate = useNavigate();
  const [client, setClient] = useState<Client>({
    name: '',
    email: '',
    phone: '',
  });

  const save = async () => {
    await ClientsService.addClient(client);
    alert('Cliente creado correctamente');
    navigate('/clients');
  };

  return (
    <div className="container mt-4">
      <h2>Nuevo Cliente</h2>
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
      <button className="btn btn-success" onClick={save}>
        Guardar
      </button>
    </div>
  );
}