import React from 'react';
import { auth, db } from '../../../../firebase';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es'); // Establecer el idioma globalmente

const Reservas = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [lista, setLista] = React.useState([]);
  const [busqueda, setBusqueda] = React.useState('');

  React.useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  React.useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const data = await db.collection('Alojamientos').get();
        const arrayData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const AlojamientosDisponibles = arrayData.filter((alojamiento) => alojamiento.Disponibilidad === true);
        setLista(AlojamientosDisponibles);
      } catch (error) {
        console.error(error);
      }
    };

    obtenerDatos();
  }, []);

  const ReservarAlojamiento = async (elemento) => {
    try {
      const usuario = user.email;

      await db.collection(usuario).add({
        idalojamiento: elemento.id,
        Nombres: elemento.Nombre,
        Precio: elemento.Precio,
        Descripcion: elemento.Descripcion,
        Direccion: elemento.Direccion,
        Imagen: elemento.Imagen,
        MetroCuadrado: elemento.MetroCuadrado,
        Requisitos: elemento.Requisitos,
        FechaCreacion: elemento.FechaCreacion
      });

      await db.collection('Alojamientos').doc(elemento.id).update({
        Disponibilidad: false,
      });

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'El Alojamiento ha sido reservado',
        showConfirmButton: false,
        timer: 1500
      });

      const listaFiltrada = lista.filter((nuevalista) => nuevalista.id !== elemento.id);
      setLista(listaFiltrada);
    } catch (error) {
      console.error(error);
    }
  };

  const BuscarAlojamiento = (e) => {
    setBusqueda(e.target.value);
  };

  const listaFiltrada = lista.filter((elemento) =>
    elemento.Nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className='Reservas'>
      <div className="titulo-seccion">
        <h2>Reservar Alojamientos</h2>
      </div>

      <div className="busqueda">
        <input
          className='form-control'
          type="text"
          placeholder="Buscar Alojamiento"
          value={busqueda}
          onChange={BuscarAlojamiento}
        />
      </div>

      <div className="contenedor-cards">
        <div className="card-grid">
          {listaFiltrada.length === 0 ? (
            <p>No se encontraron Alojamientos.</p>
          ) : (
            listaFiltrada.map((elemento) => (
              <div className="card" key={elemento.id}>
                <div className="card-body">
                  {elemento.Imagen && <img src={elemento.Imagen} alt={elemento.Nombre} className="cardimg" />}
                  <h5 className="card-title">Nombre: {elemento.Nombre}</h5>
                  <p className="card-text">Dirección: {elemento.Direccion}</p>
                  <p className="card-text">Descripción: {elemento.Descripcion}</p>
                  <p className="card-text">Precio: ${elemento.Precio}</p>
                  <p className="card-text">Metros Cuadrados: {elemento.MetroCuadrado} m²</p>
                  <p className="card-text">Requisitos: {elemento.Requisitos}</p>
                  {elemento.FechaCreacion ? (
                    <p className="card-text">Subido hace: {moment(elemento.FechaCreacion.toDate ? elemento.FechaCreacion.toDate() : elemento.FechaCreacion).fromNow()}</p>
                  ) : (
                    <p className="card-text">Fecha de creación no disponible</p>
                  )}
                </div>
                <div className="card-footer">
                  <button
                    onClick={() => ReservarAlojamiento(elemento)}
                    className="btn btn-primary me-2"
                  >
                    Reservar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reservas;