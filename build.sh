#!/bin/bash

echo "🚀 Iniciando build del proyecto..."

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
npm install

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install

# Build del frontend
echo "🔨 Construyendo frontend..."
npm run build

echo "✅ Build completado exitosamente!"
