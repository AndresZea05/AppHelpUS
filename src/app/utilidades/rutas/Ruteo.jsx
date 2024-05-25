
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Inicio from '../../componentes/contenedor/Inicio';
import Login from '../../componentes/login/Login';
import Admin from '../../componentes/login/Admin';
import Reservas from '../../componentes/servicios/alojamientos/Reservas';
import MisReservas from '../../componentes/servicios/alojamientos/MisReservas';
import Servicio from '../../componentes/servicios/Servicio';
import Cuenta from '../../componentes/login/Cuenta';

const Ruteo = ({ firebaseRol }) => (
  <Routes>
    <Route path='/' element={<Inicio />} />
    <Route path='login' element={<Login />} />
    <Route path='admin' element={<Admin firebaseRol={firebaseRol} />} />
    <Route path='reservas' element={<Reservas />} />
    <Route path='Misreservas' element={<MisReservas />} />
    <Route path='servicio' element={<Servicio />} />
    <Route path='cuenta' element={<Cuenta />} />
    
  </Routes>
);

export default Ruteo;