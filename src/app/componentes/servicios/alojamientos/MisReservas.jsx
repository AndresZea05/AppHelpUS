import React from 'react';
import { auth, db } from '../../../../firebase';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Reservas = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [lista, setLista] = React.useState([]);

  React.useEffect(() => {
    if (auth.currentUser) {
      console.log('Existe un usuario');
      setUser(auth.currentUser);
    } else {
      console.log('No existe un usuario');
      navigate('/login');
    }
  }, [navigate]);

  React.useEffect(() => {
    const obtenerDatos = async () => {
      try {
        if (user && user.email) {
          const data = await db.collection(user.email).get();
          const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setLista(arrayData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    obtenerDatos();
  }, [user]);

  const DevolverAlojamiento = async (elemento) => {
    try {
      const usuario = user.email;
      await db.collection('Alojamientos').doc(elemento.idalojamiento).update({
        Disponibilidad: true,
      });

      await db.collection(usuario).doc(elemento.id).delete();

      const listaFiltrada = lista.filter(nuevalista => nuevalista.id !== elemento.id);
      setLista(listaFiltrada);

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'El Alojamiento se ha devuelto',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='MisReservas'>
      <h3>Mis Alojamientos</h3>
     
      <div className="contenedor-cards">
        <div className="card-grid">
          {lista.length > 0 ? (
            lista.map((elemento) => (
              <div className="card" key={elemento.id}>
               
                <div className="card-body">
                {elemento.Imagen && <img src={elemento.Imagen} alt={elemento.Nombres} className="cardimg" />}
                  <h5 className="card-title">Nombre: {elemento.Nombres}</h5>
                  <p className="card-text">Dirección: {elemento.Direccion}</p>
                  <p className="card-text">Descripción: {elemento.Descripcion}</p>
                  <p className="card-text">Precio: {elemento.Precio}</p>
                </div>
                <div className="card-footer">
                  <button onClick={() => DevolverAlojamiento(elemento)} className="btn btn-warning me-2">
                    Devolver
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="NORESERVAS">No hay Alojamientos reservados</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reservas;
