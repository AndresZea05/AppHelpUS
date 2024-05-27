import React from 'react'
import logoblanco from "../../../assets/img/Logotipo_Blanco.png";
import "../../../assets/css/Inicio.css";


const Footer = () => {
  return (
    <>
    <footer>
			<div>
				<div class="row">
					<div class="columna columna-25 columna-mobile-100">
						<img src={logoblanco} class="logo-footer"/>
						{/* <!-- <p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec libero nibh, aliquam vel consectetur maximus, elementum eu neque. Integer hendrerit fringilla est vel maximus. Nam vel porta leo.
						</p> --> */}
					</div>

					<div class="columna columna-25 columna-mobile-100">
						<h3>
							Temas relacionados
						</h3>
						<ul>
							<li>
								<a href="#">Tema 1</a>
							</li>

							<li>
								<a href="#">Tema 2</a>
							</li>

							<li>
								<a href="#">Tema 3</a>
							</li>
						</ul>
					</div>

					<div class="columna columna-25 columna-mobile-100">
						<h3>
							Datos de contacto
						</h3>
						<ul>
							<li>jesusdavidquin@gmail.com</li>

							<li>+57 3203125744</li>

							<li>Calle 62 #47-51 Barranquilla-Atlantico, Colombia</li>
						</ul>
					</div>

					<div class="columna columna-25 columna-mobile-100">
						<h3>
							Redes sociales 
						</h3>
						<ul class="redes">
							<li>
								<a href="#">
								    <i class="fab fa-facebook-square">
										
									</i>
								</a>
							</li>
							<li>
								<a href="#">
									<i class="fab fa-twitter-square">
										
									</i>
								</a>
							</li>
							<li>
								<a href="#">
									<i class="fab fa-instagram-square">
										
									</i>
								</a>
							</li>
							<li>
								<a href="#">
									<i class="fab fa-google-play">
						
									</i>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="barra-footer">
				&copy; Derechos Reservados - 2024
			</div>
		</footer>
  </>
  )
}

export default Footer