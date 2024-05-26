import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../../../../firebase';
import Swal from 'sweetalert2';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const MisAlojamientos = () => {
    const [lista, setLista] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [disponibilidad, setDisponibilidad] = useState(true);
    const [precio, setPrecio] = useState('');
    const [direccion, setDireccion] = useState('');
    const [metroCuadrado, setMetroCuadrado] = useState('');
    const [requisitos, setRequisitos] = useState('');
    const [id, setId] = useState('');
    const [modoEdicion, setModoEdicion] = useState(false);
    const [error, setError] = useState(null);
    const [imagen, setImagen] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                setUser(user);
                const data = await db.collection('Alojamientos').where('owner', '==', user.email).get();
                const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLista(arrayData);
            }
        };

        fetchUserData();
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
        if (!nombre || !direccion || !descripcion || !precio || !metroCuadrado || !requisitos) {
            setError("Todos los campos son obligatorios");
            return;
        }

        const imageUrl = await uploadImage();
        const fechaCreacion = new Date();

        try {
            const dato = await db.collection('Alojamientos').add({
                Nombre: nombre,
                Disponibilidad: true,
                Descripcion: descripcion,
                Precio: precio,
                Direccion: direccion,
                MetroCuadrado: metroCuadrado,
                Requisitos: requisitos,
                Imagen: imageUrl,
                FechaCreacion: fechaCreacion,
                owner: user.email
            });

            setLista([...lista, {
                Nombre: nombre,
                Disponibilidad: true,
                Descripcion: descripcion,
                Precio: precio,
                Direccion: direccion,
                MetroCuadrado: metroCuadrado,
                Requisitos: requisitos,
                Imagen: imageUrl,
                FechaCreacion: fechaCreacion,
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
            setMetroCuadrado('');
            setRequisitos('');
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
        setMetroCuadrado(elemento.MetroCuadrado);
        setRequisitos(elemento.Requisitos);
        setId(elemento.id);
        setDisponibilidad(elemento.Disponibilidad);
        setImagen(null);
    };

    const editarDatos = async (e) => {
        e.preventDefault();
        if (!nombre || !direccion || !descripcion || !precio || !metroCuadrado || !requisitos) {
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
                MetroCuadrado: metroCuadrado,
                Requisitos: requisitos,
                ...(imageUrl && { Imagen: imageUrl })
            });

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'El alojamiento ha sido editado',
                showConfirmButton: false,
                timer: 1500
            });

            const listaEditada = lista.map(elemento =>
                elemento.id === id ? { id, Nombre: nombre, Disponibilidad: disponibilidad, Direccion: direccion, Descripcion: descripcion, Precio: precio, MetroCuadrado: metroCuadrado, Requisitos: requisitos, ...(imageUrl && { Imagen: imageUrl }) } : elemento
            );

            setLista(listaEditada);
            setModoEdicion(false);
            setNombre('');
            setDireccion('');
            setDescripcion('');
            setPrecio('');
            setMetroCuadrado('');
            setRequisitos('');
            setImagen(null);
            setError(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='MisAlojamientos'>
            {modoEdicion ? <h2 className='text-center text-success'>Editando Alojamiento</h2> : <h2 className='text-center text-primary'>Mis Alojamientos</h2>}
            <form onSubmit={modoEdicion ? editarDatos : guardarDatos}>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <input type="text" placeholder='Ingrese el Nombre' className='form-control mb-2' onChange={(e) => { setNombre(e.target.value) }} value={nombre} />
                <input type="text" placeholder='Ingrese la Direccion' className='form-control mb-2' onChange={(e) => { setDireccion(e.target.value) }} value={direccion} />
                <input type="text" placeholder='Ingrese la Descripción' className='form-control mb-2' onChange={(e) => { setDescripcion(e.target.value) }} value={descripcion} />
                <input type="number" placeholder='Ingrese el Precio' className='form-control mb-2' onChange={(e) => { setPrecio(e.target.value.trim()) }} value={precio} />
                <input type="number" placeholder='Ingrese los Metros Cuadrados' className='form-control mb-2' onChange={(e) => { setMetroCuadrado(e.target.value) }} value={metroCuadrado} />
                <input type="text" placeholder='Ingrese los Requisitos' className='form-control mb-2' onChange={(e) => { setRequisitos(e.target.value) }} value={requisitos} />
                <input type="file" className='form-control mb-2' onChange={handleImageChange} />

                <div className='d-grid gap-2'>
                    {modoEdicion ? <button type='submit' className='btn btn-outline-success'>Editar</button> : <button type='submit' className='btn btn-outline-info'>Registrar</button>}
                </div>
            </form>

            <h2 className='text-center mt-4'>Listado de Mis Alojamientos</h2>
            <div className="container-card">
                <div className="card-grid">
                    {lista.map((elemento) => (
                        <div className="card" key={elemento.id}>
                            <div className="card-body">
                                {elemento.Imagen && <img src={elemento.Imagen} alt={elemento.Nombre} className="cardimg" />}
                                <h5 className="card-title">Nombre: {elemento.Nombre}</h5>
                                <p className="card-text">Dirección: {elemento.Direccion}</p>
                                <p className="card-text">Descripción: {elemento.Descripcion}</p>
                                <p className="card-text">Precio: ${elemento.Precio}</p>
                                <p className="card-text">Metros Cuadrados: {elemento.MetroCuadrado} m²</p>
                                <p className="card-text">Requisitos: {elemento.Requisitos}</p>
                                <p className="card-text">Estado: {elemento.Disponibilidad ? "Disponible" : "Reservado"}</p>
                                {elemento.FechaCreacion ? (
                                    <p className="card-text">Subido hace: {moment(elemento.FechaCreacion.toDate ? elemento.FechaCreacion.toDate() : elemento.FechaCreacion).fromNow()}</p>
                                ) : (
                                    <p className="card-text">Fecha de creación no disponible</p>
                                )}
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

export default MisAlojamientos;
