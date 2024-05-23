import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../../firebase'; // Asegúrate de importar storage
import '../../../../assets/css/registro.css';
import Swal from 'sweetalert2';

const Registro = () => {
  const [lista, setLista] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [disponibilidad, setDisponibilidad] = useState(true);
  const [precio, setPrecio] = useState('');
  const [direccion, setDireccion] = useState('');
  const [id, setId] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [error, setError] = useState(null);
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const data = await db.collection('Alojamientos').get();
        const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLista(arrayData);
      } catch (error) {
        console.error(error);
      }
    };
    obtenerDatos();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!imagen) return '';
    const storageRef = storage.ref();
    const fileRef = storageRef.child(`images/${imagen.name}`);
    await fileRef.put(imagen);
    return await fileRef.getDownloadURL();
  };

  const guardarDatos = async (e) => {
    e.preventDefault();
    if (!nombre || !direccion || !descripcion || !precio) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const imageUrl = await uploadImage();

    try {
      const dato = await db.collection('Alojamientos').add({
        Nombre: nombre,
        Disponibilidad: true,
        Descripcion: descripcion,
        Precio: precio,
        Direccion: direccion,
        Imagen: imageUrl
      });

      setLista([...lista, {
        Nombre: nombre,
        Disponibilidad: true,
        Descripcion: descripcion,
        Precio: precio,
        Direccion: direccion,
        Imagen: imageUrl,
        id: dato.id
      }]);

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'El Alojamiento se ha registrado con éxito',
        showConfirmButton: false,
        timer: 1500
      });

      setNombre('');
      setDireccion('');
      setDescripcion('');
      setPrecio('');
      setImagen(null);
      setError(null);
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarDato = async (elemento) => {
    if (modoEdicion) {
      setError('No puede eliminar mientras edita el usuario.');
      return;
    }

    if (elemento.Disponibilidad === false) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'El alojamiento que desea eliminar se encuentra actualmente Reservado',
        showConfirmButton: true,
      });
      return;
    }

    try {
      await db.collection('Alojamientos').doc(elemento.id).delete();
      const listaFiltrada = lista.filter(alojamiento => alojamiento.id !== elemento.id);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'El Alojamiento se ha eliminado con éxito',
        showConfirmButton: false,
        timer: 1500
      });
      setLista(listaFiltrada);
    } catch (error) {
      console.error(error);
    }
  };

  const editar = (elemento) => {
    setModoEdicion(true);
    setNombre(elemento.Nombre);
    setDireccion(elemento.Direccion);
    setDescripcion(elemento.Descripcion);
    setPrecio(elemento.Precio);
    setId(elemento.id);
    setDisponibilidad(elemento.Disponibilidad);
    setImagen(null); // reset image field
  };

  const editarDatos = async (e) => {
    e.preventDefault();
    if (!nombre || !direccion || !descripcion || !precio) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const imageUrl = await uploadImage();

    try {
      await db.collection('Alojamientos').doc(id).update({
        Nombre: nombre,
        Disponibilidad: disponibilidad,
        Descripcion: descripcion,
        Precio: precio,
        Direccion: direccion,
        ...(imageUrl && { Imagen: imageUrl }) // only update image if a new one was uploaded
      });

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'El alojamiento ha sido editado',
        showConfirmButton: false,
        timer: 1500
      });

      const listaEditada = lista.map(elemento =>
        elemento.id === id ? { id, Nombre: nombre, Disponibilidad: disponibilidad, Direccion: direccion, Descripcion: descripcion, Precio: precio, ...(imageUrl && { Imagen: imageUrl }) } : elemento
      );

      setLista(listaEditada);
      setModoEdicion(false);
      setNombre('');
      setDireccion('');
      setDescripcion('');
      setPrecio('');
      setImagen(null);
      setError(null);
    } catch (error) {
      console.error(error);
    }
  };

  const buscarLibro = (e) => {
    setBusqueda(e.target.value);
  };

  const listaFiltrada = lista.filter((elemento) =>
    elemento.Nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className='Registro-libro'>
      {modoEdicion ? <h2 className='text-center text-success'>Editando Alojamiento</h2> : <h2 className='text-center text-primary'>Registro Alojamientos</h2>}
      <form onSubmit={modoEdicion ? editarDatos : guardarDatos}>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <input type="text" placeholder='Ingrese el Nombre' className='form-control mb-2' onChange={(e) => { setNombre(e.target.value) }} value={nombre} />
        <input type="text" placeholder='Ingrese la Direccion' className='form-control mb-2' onChange={(e) => { setDireccion(e.target.value) }} value={direccion} />
        <input type="text" placeholder='Ingrese la Descripción' className='form-control mb-2' onChange={(e) => { setDescripcion(e.target.value) }} value={descripcion} />
        <input type="number" placeholder='Ingrese el Precio' className='form-control mb-2' onChange={(e) => { setPrecio(e.target.value.trim()) }} value={precio} />
        <input type="file" className='form-control mb-2' onChange={handleImageChange} />

        <div className='d-grid gap-2'>
          {modoEdicion ? <button type='submit' className='btn btn-outline-success'>Editar</button> : <button type='submit' className='btn btn-outline-info'>Registrar</button>}
        </div>
      </form>

      <h2 className='text-center'>Listado de Alojamientos Registrados</h2>

      <div className="busqueda">
        <input className='form-control' type="text" placeholder="Buscar alojamiento" value={busqueda} onChange={buscarLibro} />
      </div>

      <div className="contenedor-cards">
        <div className="card-grid">
          {listaFiltrada.map((elemento) => (
            <div className="card" key={elemento.id}>
              <div className="card-body">
                               
                {elemento.Imagen && <img src={elemento.Imagen} alt={elemento.Nombre} className="cardimg" />}
               
                <h5 className="card-title">Nombre: {elemento.Nombre}</h5>
                <p className="card-text">Direccion: {elemento.Direccion}</p>
                <p className="card-text">Descripción: {elemento.Descripcion}</p>
                <p className="card-text">Precio: ${elemento.Precio}</p>
                
                <p className="card-text">Estado: {elemento.Disponibilidad ? "Disponible" : "Reservado"}</p>
              </div>
              <div className="card-footer">
                <button onClick={() => eliminarDato(elemento)} className="btn btn-danger me-2" id='btneli'>Eliminar</button>
                <button onClick={() => editar(elemento)} className="btn btn-warning me-2" id='btnedi'>Editar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Registro;