import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/Cuenta.css';

const Cuenta = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [email, setEmail] = useState('');
    const [imagen, setImagen] = useState(null);
    const [imagenURL, setImagenURL] = useState('');
    const [modoEdicion, setModoEdicion] = useState(false);
    const [error, setError] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [activeView, setActiveView] = useState('perfil'); 
    const [cedula, setCedula] = useState('');
    const [cedulaUrl, setCedulaUrl] = useState('');
    const [certificadoPropiedad, setCertificadoPropiedad] = useState(null);
    const [certificadoUrl, setCertificadoUrl] = useState('');
    const [isArrendatario, setIsArrendatario] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await db.collection('Usuarios').doc(user.email).get();
                const userData = userDoc.data();
                setUser(userData);
                setNombre(userData.nombre);
                setApellido(userData.apellido);
                setTelefono(userData.telefono);
                setFechaNacimiento(userData.fechaNacimiento);
                setEmail(userData.email);
                setImagenURL(userData.imagenURL);
                setCedulaUrl(userData.cedulaUrl || '');
                setCertificadoUrl(userData.certificadoUrl || '');
                setIsArrendatario(userData.rol === 'Arrendatario');
            }
        };

        fetchUserData();
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImagen(e.target.files[0]);
        }
    };

    const handleCertificadoChange = (e) => {
        if (e.target.files[0]) {
            setCertificadoPropiedad(e.target.files[0]);
        }
    };

    const uploadImage = async (file, path) => {
        if (!file) return '';
        const storageRef = storage.ref();
        const fileRef = storageRef.child(path);
        await fileRef.put(file);
        return await fileRef.getDownloadURL();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        let imageUrl = imagenURL;
        if (imagen) {
            imageUrl = await uploadImage(imagen, `profile_images/${user.email}`);
        }
        try {
            await db.collection('Usuarios').doc(user.email).update({
                nombre,
                apellido,
                telefono,
                fechaNacimiento,
                email,
                imagenURL: imageUrl
            });
            setModoEdicion(false);
            setError(null);
            alert('Datos actualizados correctamente');
        } catch (error) {
            setError('Error al actualizar los datos');
        }
    };

    const handleChangePassword = async () => {
        if (!newPassword) {
            setError('Ingrese una nueva contraseña');
            return;
        }
        try {
            const user = auth.currentUser;
            await user.updatePassword(newPassword);
            setNewPassword('');
            setError(null);
            alert('Contraseña actualizada correctamente');
        } catch (error) {
            setError('Error al actualizar la contraseña');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await db.collection('Usuarios').doc(user.email).delete();
            await auth.currentUser.delete();
            navigate("/login");
        } catch (error) {
            setError('Error al eliminar la cuenta');
        }
    };

    const handleBecomeLandlord = async (e) => {
        e.preventDefault();
        const cedulaUrl = await uploadImage(cedula, `cedulas/${user.email}`);
        const certificadoUrl = await uploadImage(certificadoPropiedad, `certificados/${user.email}`);
        try {
            await db.collection('Usuarios').doc(user.email).update({
                rol: 'Arrendatario',
                cedulaUrl,
                certificadoUrl
            });
            setCedulaUrl(cedulaUrl);
            setCertificadoUrl(certificadoUrl);
            setIsArrendatario(true);
            setActiveView('perfil');
            alert('Solicitud para ser arrendatario enviada correctamente');
        } catch (error) {
            setError('Error al enviar la solicitud');
        }
    };

    const handleEditLandlordInfo = async (e) => {
        e.preventDefault();
        const cedulaUrl = await uploadImage(cedula, `cedulas/${user.email}`);
        const certificadoUrl = await uploadImage(certificadoPropiedad, `certificados/${user.email}`);
        try {
            await db.collection('Usuarios').doc(user.email).update({
                cedulaUrl,
                certificadoUrl
            });
            setCedulaUrl(cedulaUrl);
            setCertificadoUrl(certificadoUrl);
            alert('Información de arrendatario actualizada correctamente');
        } catch (error) {
            setError('Error al actualizar la información');
        }
    };

    const cerrarsesion = () => {
        auth.signOut().then(() => {
            navigate("/login");
        });
    };

    if (!user) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="cuenta-container">
            <div className="cuenta-sidebar">
                <ul>
                    <li onClick={() => setActiveView('perfil')}>Perfil</li>
                    <li onClick={() => setActiveView('contraseña')}>Contraseña</li>
                    <li onClick={() => setActiveView('arrendatario')}>Ser un arrendatario</li>
                    <li onClick={handleDeleteAccount} className="delete-account">Eliminar cuenta</li>
                </ul>
            </div>
            <div className="cuenta-main">
                <h2>Cuenta</h2>
                {activeView === 'perfil' && (
                    <form onSubmit={handleSave}>
                        <div className="profile-image">
                            {imagenURL ? <img src={imagenURL} alt="Perfil" /> : <div className="placeholder-image">Sin imagen</div>}
                            {modoEdicion && <input type="file" onChange={handleImageChange} />}
                        </div>
                        <div className="profile-info">
                            <label>Nombre</label>
                            <input 
                                type="text" 
                                value={nombre} 
                                onChange={e => setNombre(e.target.value)} 
                                disabled={!modoEdicion} 
                            />
                            <label>Apellido</label>
                            <input 
                                type="text" 
                                value={apellido} 
                                onChange={e => setApellido(e.target.value)} 
                                disabled={!modoEdicion} 
                            />
                            <label>Email</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                disabled={!modoEdicion} 
                            />
                            <label>Teléfono</label>
                            <input 
                                type="tel" 
                                value={telefono} 
                                onChange={e => setTelefono(e.target.value)} 
                                disabled={!modoEdicion} 
                            />
                            <label>Fecha de Nacimiento</label>
                            <input 
                                type="date" 
                                value={fechaNacimiento} 
                                onChange={e => setFechaNacimiento(e.target.value)} 
                                disabled={!modoEdicion} 
                            />
                        </div>
                        {error && <div className="error">{error}</div>}
                        <div className="actions">
                            {modoEdicion && <button type="submit">Guardar Cambios</button>}
                            {!modoEdicion && (
                                <button type="button" onClick={() => setModoEdicion(true)}>Modificar</button>
                            )}
                        </div>
                    </form>
                )}
                {activeView === 'contraseña' && (
                    <div className="change-password">
                        <h3>Cambiar Contraseña</h3>
                        <input 
                            type="password" 
                            placeholder="Nueva Contraseña" 
                            value={newPassword} 
                            onChange={e => setNewPassword(e.target.value)} 
                        />
                        <button onClick={handleChangePassword}>Cambiar Contraseña</button>
                    </div>
                )}
                {activeView === 'arrendatario' && (
                    <form onSubmit={isArrendatario ? handleEditLandlordInfo : handleBecomeLandlord}>
                        <h3>{isArrendatario ? 'Editar información de arrendatario' : 'Solicitud para ser arrendatario'}</h3>
                        <label>Nombre Completo</label>
                        <input 
                            type="text" 
                            value={nombre} 
                            onChange={e => setNombre(e.target.value)} 
                            required 
                        />
                        <label>Cédula</label>
                        <input 
                            type="text" 
                            value={cedula} 
                            onChange={e => setCedula(e.target.value)} 
                            required 
                        />
                        <label>Imagen de la cédula</label>
                        <input 
                            type="file" 
                            onChange={handleImageChange} 
                            required={!isArrendatario} 
                        />
                        <label>Certificado de propiedad</label>
                        <input 
                            type="file" 
                            onChange={handleCertificadoChange} 
                            required={!isArrendatario} 
                        />
                        {error && <div className="error">{error}</div>}
                        <div className="actions">
                            <button type="submit">{isArrendatario ? 'Guardar Cambios' : 'Enviar Solicitud'}</button>
                        </div>
                    </form>
                )}
                <button onClick={cerrarsesion} className="cerrar-sesion">Cerrar Sesión</button>
            </div>
        </div>
    );
};

export default Cuenta;
