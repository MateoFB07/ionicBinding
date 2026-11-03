import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const About: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ textAlign: 'center' }}>
        <h2>¡Hola! Bienvenido a la página About.</h2>
        <p>Esta es la vista creada para la actividad de clase.</p>
      </IonContent>
    </IonPage>
  );
};

export default About;
