import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import './Home.css';

const Home: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .then(({ data }) => {
        if (data) setProducts(data);
      });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="gtavi-toolbar">
          <IonTitle className="fw-bold">UDITFLIX // VI</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="gtavi-bg">
        <div className="container py-5">
          <h1 className="display-5 fw-bold text-center mb-5 gtavi-title">
            Catálogo A3D
          </h1>

          <div className="row g-4">
            {products.map((item) => (
              <div key={item.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 text-white gtavi-card">
                  {/* Imagen PNG en figure */}
                  <figure className="figure m-0 gtavi-figure p-3 text-center">
                    <img
                      src={item.imagen}
                      alt={`Portada del proyecto ${item.titulo}`}
                      width="200"
                      height="180"
                      className="figure-img img-fluid mb-0"
                      style={{ height: '180px', objectFit: 'contain' }}
                    />
                  </figure>

                  <div className="card-body d-flex flex-column p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h2 className="h5 card-title fw-bold mb-0">{item.titulo}</h2>
                      <span className="badge gtavi-badge">{item.tecnologia}</span>
                    </div>

                    <p className="small text-light mb-3">
                      Autor: {item.autor}
                    </p>

                    {/* Vídeo MP4 */}
                    {(item.enlace_video || item.enlace_teaser) && (
                      <video
                        src={item.enlace_video || item.enlace_teaser}
                        controls
                        preload="metadata"
                        playsInline
                        aria-label={`Reproductor de vídeo de ${item.titulo}`}
                        className="w-100 rounded mb-3 bg-black"
                        style={{ height: '170px' }}
                      />
                    )}

                    {/* Enlace cómic */}
                    {item.enlace_comic && (
                      <a
                        href={item.enlace_comic}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm gtavi-btn mb-3"
                      >
                        Ver Cómic
                      </a>
                    )}

                    {/* Fecha */}
                    <small className="mt-auto pt-2 border-top border-secondary text-light">
                      Fecha: {new Date(item.created_at).toLocaleDateString('es-ES')}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;