import React from 'react';
import { auth, db } from '../../../../firebase'
import { useNavigate } from 'react-router-dom';

const Reservas = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const [lista, setLista] = React.useState([]);
  const [busqueda, setBusqueda] = React.useState('');

  React.useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const data = await db.collection('Alojamientos').get();
        const arrayData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const AlojamientosDisponibles = arrayData.filter((libro) => libro.Disponibilidad === true);
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

      const datos = await db.collection(usuario).add({
        idalojamiento: elemento.id,
        Nombres: elemento.Nombre,
        Precio: elemento.Precio,
        Descripcion: elemento.Descripcion,
        Direccion: elemento.Direccion,
      });

      await db.collection('Alojamientos').doc(elemento.id).update({
        Disponibilidad: false,
      });

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'El libro ha sido reservado',
        showConfirmButton: false,
        timer: 1500
    })

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
                  <h5 className="card-title">Nombre: {elemento.Nombre}</h5>
                  <p className="card-text">Direccion: {elemento.Direccion}</p>
                  <p className="card-text">Descripción: {elemento.Descripcion}</p>
                  <p className="card-text">Precio: {elemento.Precio}</p>
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
