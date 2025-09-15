# 1. Usar una imagen base oficial de Node.js
FROM node:18-alpine

# 2. Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 3. Copiar los archivos de definición de dependencias
COPY package*.json ./

# 4. Instalar las dependencias del proyecto
RUN npm install

# 5. Copiar el resto del código de la aplicación
COPY . .

# 6. Generar el cliente de Prisma (importante para que funcione dentro de Docker)
RUN npx prisma generate

# 7. Exponer el puerto en el que correrá la aplicación
EXPOSE 3001

# 8. El comando para iniciar la aplicación en modo desarrollo
CMD [ "npm", "run", "dev" ]
