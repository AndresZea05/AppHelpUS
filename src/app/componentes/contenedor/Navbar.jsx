import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../../firebase";
import logo from "../../../assets/img/logo_blanco.png";
import "../../../assets/css/Cabecera.css";

const Navbar = () => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [firebaseUserData, setFirebaseUserData] = useState(null);
  const [firebaseRol, setFirebaseRol] = useState(null);
  const [firebaseArrendatario, setFirebaseArrendatario] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false); // Estado para manejar el acordeón

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await db.collection('Usuarios').doc(user.email).get();
        if (userDoc.exists) {
          setFirebaseUser(user);
          setFirebaseUserData(userDoc.data());
          const userData = userDoc.data();
          setFirebaseRol(userData.Rol); // Usar el campo 'Rol' para el rol principal
          setFirebaseArrendatario(userData.rol); // Usar el campo 'rol' para verificar si es arrendatario
          console.log("User Data:", userData); // Agregar log para ver los datos del usuario
          console.log("User Role:", userData.Rol); // Agregar log para ver el rol del usuario
          console.log("User Subrole:", userData.rol); // Agregar log para ver el subrol del usuario
        }
      } else {
        setFirebaseUser(null);
        setFirebaseUserData(null);
        setFirebaseRol(null);
        setFirebaseArrendatario(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <>
      <header className="cabecera">
        <div className="cabecera__logo">
          <img src={logo} alt="Logo" />
          <div className="nombrelogo">
            <p>HELP US!</p>
          </div>
        </div>

        <button className="navbar-toggler" onClick={toggleNav}>
          ☰
        </button>

        <nav className={`cabecera__nav ${isNavOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            
            <li>
              <Link to="/servicio">Servicio</Link>
            </li>
            {firebaseUser !== null && firebaseRol === "Admin" && (
              <li>
                <Link id="btnadmin" to="/admin">
                  Admin
                </Link>
              </li>
            )}
            {firebaseUser !== null && firebaseRol === "Usuario" && (
              <li>
                <Link to="/Misreservas">
                  Mis guardados
                </Link>
              </li>
            )}
            {firebaseUser !== null && firebaseArrendatario === "Arrendatario" && (
              <li>
                <Link to="/MisAlojamientos">
                  Mis Alojamientos
                </Link>
              </li>
            )}
            {firebaseUser !== null ? (
              <li>
                <Link className="navbar-brand" to="/cuenta">
                  {firebaseUserData.imagenURL ? (
                    <img src={firebaseUserData.imagenURL} alt="Perfil" className="navbar-profile-img" />
                  ) : (
                    <div className="navbar-profile-placeholder">?</div>
                  )}
                </Link>
              </li>
            ) : (
              <li>
                <Link id="btnsecion" className="btn_login iniciar-cerrarsesion" to="/login">
                  Iniciar sesión
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
