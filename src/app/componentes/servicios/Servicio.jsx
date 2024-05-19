import { useState } from 'react';
import '../../../assets/css/Servicio.css';
import MapsViews from './MapsViews';
import Reservas from './alojamientos/Reservas';

const Servicio = () => {
  const [center, setCenter] = useState({ lat: 10.994360364475032, lng: -74.790640111464 });

  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
    switch (selectedOption) {
      case 'unicuc':
        setCenter({ lat: 10.994360364475032, lng: -74.790640111464 });
        break;
      case 'uninorte':
        setCenter({ lat: 11.0191085168354, lng: -74.85114239964439 });
        break;
      case 'uniatlantico':
        setCenter({ lat: 11.01962225540215, lng: -74.87345166222372 });
        break;
      case 'unilibre':
        setCenter({ lat: 10.988669438921363, lng: -74.78858479109316 });
        break;
      case 'unilsimon':
        setCenter({ lat: 10.994596463617176, lng: -74.7919150469129 });
        break;
      case 'uniameri':
        setCenter({ lat: 10.991433777401259, lng: -74.80706694691298 });
        break;
      case 'unicul':
        setCenter({ lat: 10.994823935839403, lng: -74.79110666225696 });
        break;
      case 'cooritsa':
        setCenter({ lat: 10.98668975015035, lng: -74.78765726225708 });
        break;
      case 'coorsena':
        setCenter({ lat: 10.994393298638252, lng: -74.80783647436333 });
        break;
      default:
        break;
    }
  };

  return (
    <div className="ContainerServicios">
      <div className="titulop">
        <h1>¿Estas buscando alojamiento?</h1>
      </div>
      <div className="buscaropciones">
        <h3>Selecciona una Universidad o corporación de Barranquilla:</h3>
        <select id="universidades" onChange={handleSelectChange}>
          <option value="unicuc">Universidad de la Costa (CUC)</option>
          <option value="uninorte">Universidad del Norte</option>
          <option value="uniatlantico">Universidad del Atlántico(Puerto)</option>
          <option value="unilibre">Universidad Libre</option>
          <option value="unilsimon">Universidad Simon Bolivar</option>
          <option value="uniameri">Universidad Americana</option>
          <option value="unicul">Universidad Latinoamericana(CUL)</option>
          <option value="cooritsa">Corporación ITSA</option>
          <option value="coorsena">Corporación SENA</option>
        </select>
      </div>
      <div className="mapcontainerprin">
        <div className="mapacontainer">
          <MapsViews center={center} />
         
        </div>

      </div>
      <div>
        <br /><br />
      <Reservas/>
      <br />
      </div>
    </div>
  );
};

export default Servicio;
