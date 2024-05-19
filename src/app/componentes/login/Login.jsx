import React, { useState, useCallback } from 'react';
import { auth, db } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/Login.css'; // Asegúrate de tener el CSS en el mismo directorio o ajusta la ruta según sea necesario

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState(null);
    const [modoRegistro, setModoRegistro] = useState(false);
    const [active, setActive] = useState(false);

    const handleRegisterClick = () => {
        setActive(true);
        setModoRegistro(true);
    };

    const handleLoginClick = () => {
        setActive(false);
        setModoRegistro(false);
    };

    const guardarDatos = (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Ingrese el email');
            return;
        }
        if (!pass.trim()) {
            setError('Ingrese el Password');
            return;
        }
        if (pass.length < 6) {
            setError('Password debe ser mayor a 6 caracteres');
            return;
        }
        setError(null);
        if (modoRegistro) {
            registrar();
        } else {
            login();
        }
    };

    const login = useCallback(async () => {
        try {
            const res = await auth.signInWithEmailAndPassword(email, pass);
            const userSnapshot = await db.collection('Usuarios').doc(res.user.email).get();
            const userData = userSnapshot.data();

            if (userData && userData.Rol === 'Usuario') {
                navigate('/reservas');
            } else if (userData && userData.Rol === 'Admin') {
                navigate('/admin');
            }

            setEmail('');
            setPass('');
            setError('');
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                setError('Pass no coincide');
            } else if (error.code === 'auth/user-not-found') {
                setError('usuario no registrado');
            }
        }
    }, [email, pass, navigate]);

    const registrar = useCallback(async () => {
        try {
            const res = await auth.createUserWithEmailAndPassword(email, pass);
            await db.collection('Usuarios').doc(res.user.email).set({
                email: res.user.email,
                id: res.user.uid,
                Rol: "Usuario"
            });
            setEmail('');
            setPass('');
            setError('');
        } catch (error) {
            if (error.code === 'auth/invalid-email') {
                setError('Email inválido');
            } else if (error.code === 'auth/email-already-in-use') {
                setError('Email ya registrado');
            }
        }
    }, [email, pass]);

    return (
        <div className="contenerpadretodo">
        <div className="containerprinlogin">
            <div className={`container ${active ? 'active' : ''}`} id="container">
                <div className="form-container sign-up">
                    <form onSubmit={guardarDatos}>
                        <h1>Crear Cuenta</h1>
                        {error && <div className='alert alert-danger'>{error}</div>}
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value.trim())} 
                        />
                        <input 
                            type="password" 
                            placeholder="Contraseña" 
                            value={pass} 
                            onChange={e => setPass(e.target.value.trim())} 
                        />
                        <button type="submit">Registrate</button>
                    </form>
                </div>
                <div className="form-container sign-in">
                    <form onSubmit={guardarDatos}>
                        <h1>Ingresar</h1>
                        {error && <div className='alert alert-danger'>{error}</div>}
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value.trim())} 
                        />
                        <input 
                            type="password" 
                            placeholder="Contraseña" 
                            value={pass} 
                            onChange={e => setPass(e.target.value.trim())} 
                        />
                        <a href="#">Olvidaste tu contraseña?</a>
                        <button type="submit">Ingresar</button>
                    </form>
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Bienvenido de vuelta</h1>
                            <p>Es un placer que vuelvas </p>
                            <button className="hidden" id="login" onClick={handleLoginClick}>Ingresar</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hola, Aun no tines cuenta</h1>
                            <p>Resgistrate y unete a nuestro grupo de HELP US!</p>
                            <button className="hidden" id="register" onClick={handleRegisterClick}>Registrase</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Login;
