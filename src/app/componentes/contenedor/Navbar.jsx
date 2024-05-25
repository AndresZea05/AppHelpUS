import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../../firebase";
import logo from "../../../assets/img/logo_blanco.png";
import "../../../assets/css/Cabecera.css";

const Navbar = () => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [firebaseUserData, setFirebaseUserData] = useState(null);
  const [firebaseRol, setFirebaseRol] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await db.collection('Usuarios').doc(user.email).get();
        if (userDoc.exists) {
          setFirebaseUser(user);
          setFirebaseUserData(userDoc.data());
          setFirebaseRol(userDoc.data().Rol);
        }
      } else {
        setFirebaseUser(null);
        setFirebaseUserData(null);
        setFirebaseRol(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <header className="cabecera">
        <div className="cabecera__logo">
          <img src={logo} alt="Logo" />
          <div className="nombrelogo">
            <p>HELP US!</p>
          </div>
        </div>

        <nav className="cabecera__nav">
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/servicio">Servicio</Link>
          </li>
          <li>
            {firebaseUser !== null && firebaseRol === "Admin" ? (
              <Link id="btnadmin" to="/admin">
                Admin
              </Link>
            ) : null}
          </li>
          <li>
            {firebaseUser !== null && firebaseRol === "Usuario" ? (
              <Link to="/Misreservas">
                Mis alojamientos
              </Link>
            ) : null}
          </li>
          <li>
            {firebaseUser !== null ? (
              <Link className="navbar-brand" to="/cuenta">
                Cuenta
              </Link>
            ) : (
              <Link id="btnsecion" className="btn_login iniciar-cerrarsesion" to="/login">
                Iniciar sesión
              </Link>
            )}
          </li>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
