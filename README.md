# UnaHur - Red Anti-Social

<p>Desarrollo de un sistema backend para una red social llamada <b>“UnaHur Anti-Social Net”</b>, inspirada en plataformas populares que permiten a los usuarios realizar publicaciones y recibir comentarios sobre las mismas.</p>
<img src="https://github.com/user-attachments/assets/e2f5f210-b2b9-43b4-bc80-fbdc73e5c79f" width="200"/>

# Preparación e instalación
* Clonar el proyecto con: ``` git clone  https://github.com/EP-UnaHur-2025C1/anti-social-mongo-sev-js.git ```
* Navegar a la carpeta: ``` cd anti-social-mongo-sev-js ```
* Instalar las dependencias en node_modules: ``` npm i ```
* Abrir Docker Desktop
* Compilar la imagen de la api e iniciar los servicios: ``` docker compose up --build -d ```
* Levantar el swagger y el proyecto en modo desarrollo: ``` npm run dev ```

## Si se realizó la instalación
* Sólo iniciar los servicios declarados en docker-compose: ``` docker compose up -d ```

# Archivos de Documentación
* <b>Swagger:</b> En la ubicación src/docs
* <b>Modelado de datos:</b> En la raíz del proyecto, el archivo "diagrama.pdf"

# Visualización de archivos
* http://localhost:3000/api-docs  (SWAGGER)
* http://localhost:5000  (API)

