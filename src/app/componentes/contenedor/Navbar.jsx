import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/img/logo_blanco.png";
import "../../../assets/css/Cabecera.css";

const Navbar = (props) => {
  const navigate = useNavigate();
  const cerrarsesion = () => {
    auth.signOut().then(() => {
      navigate("/login");
    });
  };

  // console.log("El rol es: " + props.firebaseRoles);

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
            {" "}
            {props.firebaseUser !== null && props.firebaseRol === "Admin" ? (
              <Link className="btn_login" to="/admin">
                Admin
              </Link>
            ) : null}
          </li>
          <li>
            {props.firebaseUser !== null && props.firebaseRol === "Usuario" ? (
              <Link to="/reservas">
                Reservar alojamiento
              </Link>
            ) : null}
          </li>
          <li>
            {props.firebaseUser !== null && props.firebaseRol === "Usuario" ? (
              <Link  to="/Misreservas">
                Mis alojamientos
              </Link>
            ) : null}
          </li>
          <li>
            {props.firebaseUser !== null ? (
              <Link className="navbar-brand" to="/">
                {props.firebaseUser.email}{" "}
              </Link>
            ) : (
              <Link className="navbar-brand" to="/">
                {" "}
              </Link>
            )}
          </li>
          <li>
            {props.firebaseUser !== null ? (
              <button
                className="btn_login iniciar-cerrarsesion"
                onClick={cerrarsesion}
              >
                Cerrar Sesión
              </button>
            ) : (
              <Link id="btnsecion" className="btn_login iniciar-cerrarsesion" to="/login">
                Iniciar seccion
              </Link>
            )}
          </li>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
