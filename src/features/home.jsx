import React from "react";
import { Link } from "react-router-dom";

import Header from "../components/common/header";

import './styles/home.css';

function Home () {

    const currentUrl = `${window.location.origin}${window.location.pathname}`;

    return (
			<Header title={"Home"}>
				<div className="app-home">
					<div className="app-home-feature">
						<h3>1. Ir al panel de administración</h3>
						<p>
							Dirígete al{" "}
							<a href="/dashboard" target="_blank" rel="noopener noreferrer">
								Panel de administración
							</a>{" "}
							para gestionar las pujas.
						</p>
                        <code>{`${currentUrl}dashboard`}</code>
						<div class="tips-container">
							<div class="tip">
								<h3>Uso: </h3>
								<p>
									Recuerda que puedes establecer la magnitud de las pujas, y los
									atajos de teclado para las mismas.
								</p>
							</div>
							<div class="tip">
								<h3>Recomendación</h3>
								<p>
									En caso de que la puja tenga un valor inicial pero no una
									paleta, solo deja el espacio de paleta vacío, automáticamente
									se asignará un '?' como valor.
								</p>
							</div>
						</div>
					</div>
                    <div className="app-home-feature">
                        <h3>2. Conectar la app al software de transmisión</h3>
                        <p>Sigue las siguientes instrucciones: </p>
                        
                        <div className="app-instruction">
                            <img src="https://blog.vmix.com/wp-content/uploads/2015/05/vmix-logo-transparent-small-300x111.png" alt="" />
                            <div>
                                <h4>1. Abrir vMix</h4>
                                <li>Ve a añadir entrada</li>
                                <li>Selecciona "Web Browser"</li>
                                <li>En URL, introduce:</li> 
                            </div>
                            <code>{`${currentUrl}live-preview`}</code>         
                        </div>
                    </div>
				</div>
			</Header>
		);
}

export default Home;