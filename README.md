# 🏢 Sistema de Estacionamiento UTP - Dashboard de Monitoreo

**Versión:** 1.0.0  
**Estado:** ✅ Listo para ejecutar  
**Última actualización:** 2024

## 📋 Resumen Ejecutivo

Sistema completo de gestión de estacionamiento con:
- ✅ **Spring Boot 3.3.2** (Framework web)
- ✅ **Spring Boot Actuator** (Monitoreo profesional)
- ✅ **Logback** (Logging estructurado)
- ✅ **Prometheus** (Métricas en tiempo real)
- ✅ **Dashboard Thymeleaf + Bootstrap 5** (Interfaz moderna)
- ✅ **MySQL** (Persistencia de datos)
- ✅ **Generación de Reportes Excel** (Apache POI)

---

## 🚀 GUÍA DE INICIO RÁPIDO

### **OPCIÓN 1: Para usuarios con Maven ya instalado**

```powershell
cd C:\xampp\htdocs\estacionamiento-utp
mvn clean install -DskipTests
mvn spring-boot:run
```

Luego abre: **http://localhost:8080/monitoring**

---

### **OPCIÓN 2: Para usuarios sin Maven instalado**

Sigue los pasos detallados en el archivo: **[INSTALACION_MAVEN.md](./INSTALACION_MAVEN.md)**

---

## 📊 Características Principales

### 1️⃣ **Spring Boot Actuator**
- Monitoreo en tiempo real del sistema
- Métricas de CPU, RAM, conexiones de base de datos
- Salud del sistema, información de la aplicación

### 2️⃣ **Logback - Sistema de Logging Profesional**
- Logs estructurados con niveles: INFO, WARN, ERROR
- Dos archivos de salida:
  - `logs/estacionamiento.log` - Todos los logs
  - `logs/errores.log` - Solo errores
- Rotación automática de archivos (cada 10MB)
- Patrones de timestamp precisos para auditoría

### 3️⃣ **EventoSistemaService - Logs en Todos los Módulos**
- **Autenticación:** Login, logout, intentos fallidos
- **Usuarios:** Creación, actualización, eliminación
- **Vehículos:** Registro, actualización, eliminación
- **Entrada/Salida:** Acceso, rechazos, salidas no autorizadas
- **Reservas:** Creación, cancelación, espacios no disponibles
- **Pagos:** Transacciones exitosas, fallos, reembolsos
- **Panel Admin:** Acciones administrativas, reportes, backups
- **Seguridad:** Accesos restringidos, actividades sospechosas
- **Errores:** Excepciones, errores de conexión, validación

### 4️⃣ **Dashboard de Monitoreo**
- Interfaz moderna con Bootstrap 5
- Métricas en tiempo real del estacionamiento
- Accesos rápidos a todos los endpoints de Actuator
- Visualización de últimos logs
- Información de Prometheus y Grafana

### 5️⃣ **Prometheus & Grafana Ready**
- Métricas personalizadas en formato Prometheus
- Compatible con sistemas de visualización avanzada
- Docker Compose incluido para stack completo

---

## 📁 Estructura del Proyecto

```
estacionamiento-utp/
│
├── 📄 pom.xml                          (Dependencias Maven)
├── 📄 README.md                        (Este archivo)
├── 📄 GUIA_EJECUCION_Y_CAPTURAS.md    (Guía de ejecución)
├── 📄 INSTALACION_MAVEN.md            (Instalación Maven)
│
├── src/main/
│   ├── java/pe/utp/estacionamiento/
│   │   ├── App.java                   (Punto de entrada)
│   │   ├── config/
│   │   │   ├── AppConfig.java
│   │   │   ├── DatabaseConfig.java
│   │   │   ├── MonitoringMetricsConfig.java
│   │   │   └── RequestLoggingFilter.java
│   │   ├── controller/
│   │   │   └── MonitoringController.java
│   │   ├── model/
│   │   │   ├── MonitoringSnapshot.java
│   │   │   └── ReporteVehiculo.java
│   │   ├── repository/
│   │   │   └── VehiculoRepository.java
│   │   └── service/
│   │       ├── EventoSistemaService.java        ⭐ LOGS PROFESIONALES
│   │       ├── MonitoringService.java           ⭐ MÉTRICAS
│   │       └── ReporteExcelService.java
│   │
│   └── resources/
│       ├── application.properties               ⭐ CONFIGURACIÓN
│       ├── logback-spring.xml                   ⭐ CONFIGURACIÓN DE LOGS
│       └── templates/
│           └── monitoring.html                  ⭐ DASHBOARD
│
├── logs/
│   ├── estacionamiento.log            (Logs principales)
│   └── errores.log                    (Solo errores)
│
├── reportes/                          (Reportes Excel generados)
└── target/                            (Compilados)
```

---

## 🔧 Dependencias Principales

```xml
<!-- Web -->
spring-boot-starter-web (3.3.2)
spring-boot-starter-thymeleaf

<!-- Monitoreo -->
spring-boot-starter-actuator
micrometer-registry-prometheus

<!-- Base de Datos -->
spring-boot-starter-jdbc
mysql-connector-j

<!-- Logging -->
spring-boot-starter-logging (Logback automático)

<!-- Reportes -->
apache poi-ooxml (5.2.5)

<!-- Utilidades -->
google guava (33.2.1-jre)
apache commons-lang3 (3.14.0)
```

---

## 🎯 Endpoints Disponibles

### **Dashboard y API**
- `GET /` → Dashboard de monitoreo
- `GET /monitoring` → Dashboard principal
- `GET /api/monitoring` → API JSON de métricas
- `GET /monitoring/demo-logs` → Generar logs de demostración

### **Spring Boot Actuator**
- `GET /actuator` → Lista de endpoints
- `GET /actuator/health` → Estado del sistema
- `GET /actuator/info` → Información de la aplicación
- `GET /actuator/metrics` → Lista de métricas disponibles
- `GET /actuator/metrics/{metric}` → Métrica específica
- `GET /actuator/env` → Variables de entorno
- `GET /actuator/beans` → Beans registrados
- `GET /actuator/prometheus` → Métricas en formato Prometheus

---

## 📊 Métricas Capturadas

### **Sistema**
- CPU usage (%)
- Memory used / Total (MB)
- Response time (ms)
- Database availability

### **Estacionamiento**
- Active users
- Registered vehicles
- Available spaces
- Active reservations
- Payments processed
- Errors/Warnings count

### **Logs**
- INFO level events
- WARN level warnings
- ERROR level exceptions
- Structured timestamps
- Module information

---

## 🛠️ Configuración Detallada

### **application.properties**
```properties
# Servidor
server.port=8080
server.servlet.context-path=/

# Base de Datos
spring.datasource.url=jdbc:mysql://localhost:3306/estacionamiento_utp
spring.datasource.username=root
spring.datasource.password=

# Logging
logging.level.pe.utp.estacionamiento=INFO
logging.level.root=INFO
logging.config=classpath:logback-spring.xml

# Actuator
management.endpoints.web.exposure.include=health,info,metrics,env,beans,prometheus
management.endpoint.health.show-details=always

# Archivos de Log
app.monitoring.log-file=logs/estacionamiento.log
app.monitoring.error-log-file=logs/errores.log
app.monitoring.simulate-missing-data=true
```

### **logback-spring.xml**
Configuración profesional de logging con:
- Salida a consola (coloreada)
- Archivo principal con rotación por tamaño y fecha
- Archivo de errores con filtro de nivel
- Retención configurable (30-60 días)
- Límite de espacio total (1GB)

---

## 🎬 Cómo Ejecutar

### **Paso 1: Verificar Prerequisites**
```powershell
java -version          # Java 17+
mysql --version        # MySQL corriendo
```

### **Paso 2: Compilar (si Maven está instalado)**
```powershell
cd C:\xampp\htdocs\estacionamiento-utp
mvn clean install -DskipTests
```

### **Paso 3: Ejecutar**
```powershell
mvn spring-boot:run
```

O directamente con Java:
```powershell
java -jar target/estacionamiento-utp-1.0.0.jar
```

### **Paso 4: Verificar que funciona**
Deberías ver en la consola:
```
============================================================
INICIO DEL SISTEMA DE ESTACIONAMIENTO - [YYYY-MM-DD HH:MM:SS]
Modulo de Monitoreo: ACTIVO
Actuator: DISPONIBLE en http://localhost:8080/actuator
Dashboard: DISPONIBLE en http://localhost:8080/monitoring
============================================================
```

### **Paso 5: Abrir en navegador**
```
http://localhost:8080/monitoring
```

---

## 📸 Capturas para el Informe

Ver el archivo **[GUIA_EJECUCION_Y_CAPTURAS.md](./GUIA_EJECUCION_Y_CAPTURAS.md)** para la lista completa de 20 capturas recomendadas.

**Resumen:**
1. Dashboard de monitoreo
2. Logs INFO/WARN/ERROR en consola
3. Endpoints /actuator/health, /metrics, /prometheus
4. Archivos de log (estacionamiento.log, errores.log)
5. Código fuente (EventoSistemaService, MonitoringService)

---

## 🐛 Solución de Problemas

### **Error: Puerto 8080 en uso**
```powershell
# Cambiar en application.properties:
server.port=8080

# O matar proceso que usa 8080:
Get-Process | Where-Object {$_.ProcessName -eq "java"} | Stop-Process -Force
```

### **Error: No se conecta a MySQL**
```
1. Verificar que MySQL esté corriendo
2. Verificar credenciales en application.properties
3. Verificar que base de datos exista:
   CREATE DATABASE estacionamiento_utp;
```

### **Error: No se generan logs**
```
1. Verificar carpeta /logs tiene permisos de escritura
2. Revisar logback-spring.xml
3. Verificar logging.level=INFO en application.properties
```

### **Error: Maven no encontrado**
```
Ver archivo INSTALACION_MAVEN.md para instrucciones completas
```

---

## 💡 Consejos de Uso

1. **Para desarrollo:** Usa `mvn spring-boot:run` (carga cambios con DevTools)
2. **Para producción:** Compila JAR y ejecuta con `java -jar`
3. **Auto-refresh:** El dashboard se puede configurar para actualizarse automáticamente
4. **Prometheus:** Exporta métricas en `/actuator/prometheus` para Grafana
5. **Logs en tiempo real:** Monitorea `logs/estacionamiento.log` con PowerShell:
   ```powershell
   Get-Content -Path logs/estacionamiento.log -Tail 20 -Wait
   ```

---

## 📚 Documentación Relacionada

- [GUIA_EJECUCION_Y_CAPTURAS.md](./GUIA_EJECUCION_Y_CAPTURAS.md) - Guía paso a paso
- [INSTALACION_MAVEN.md](./INSTALACION_MAVEN.md) - Instalación de Maven
- [MONITOREO.md](./MONITOREO.md) - Documentación de monitoreo avanzado
- [IMPLEMENTACION_JAVA.md](./IMPLEMENTACION_JAVA.md) - Detalles técnicos

---

## ✅ Checklist de Verificación

- [ ] Java 17+ instalado
- [ ] MySQL corriendo
- [ ] Maven instalado (si no, seguir INSTALACION_MAVEN.md)
- [ ] Proyecto compilado sin errores
- [ ] Aplicación iniciada correctamente
- [ ] Dashboard accesible en http://localhost:8080/monitoring
- [ ] Logs siendo generados en /logs
- [ ] Endpoints de Actuator funcionando
- [ ] Capturas tomadas para informe

---

## 📞 Preguntas Frecuentes

**P: ¿Cuánto tarda en iniciar?**  
R: 5-10 segundos después de compilar.

**P: ¿Dónde se guardan los logs?**  
R: En la carpeta `/logs` (se crea automáticamente).

**P: ¿Puedo cambiar el puerto?**  
R: Sí, en `application.properties`, propiedad `server.port`.

**P: ¿Cómo veo los logs en tiempo real?**  
R: En PowerShell: `Get-Content -Path logs/estacionamiento.log -Tail 20 -Wait`

**P: ¿Necesito Prometheus y Grafana?**  
R: No es obligatorio. El dashboard básico funciona solo. Están disponibles opcionalmente via Docker.

---

## 🎓 Principios de Diseño

### Logging Profesional
- ✅ Structured logging con contexto completo
- ✅ Separación de niveles (INFO, WARN, ERROR)
- ✅ Rotación automática de archivos
- ✅ Retención configurable
- ✅ Timestamps precisos para auditoría

### Monitoreo
- ✅ Métricas en tiempo real
- ✅ Health checks del sistema
- ✅ Compatibilidad Prometheus
- ✅ Dashboard intuitivo

### Seguridad
- ✅ Logs de acceso y autenticación
- ✅ Registro de errores sin exponer datos sensibles
- ✅ Auditoría de cambios administrativos
- ✅ Detección de actividades sospechosas

---

## 🚀 Próximos Pasos

1. **Instalar Maven** (si es necesario) - Ver [INSTALACION_MAVEN.md](./INSTALACION_MAVEN.md)
2. **Compilar el proyecto** - `mvn clean install`
3. **Ejecutar la aplicación** - `mvn spring-boot:run`
4. **Abrir el dashboard** - http://localhost:8080/monitoring
5. **Generar logs de demo** - Haz clic en "Generar Logs Demo"
6. **Tomar capturas** - Sigue [GUIA_EJECUCION_Y_CAPTURAS.md](./GUIA_EJECUCION_Y_CAPTURAS.md)
7. **Documentar en informe**

---

## 📄 Licencia

Proyecto educativo - Universidad Tecnológica del Perú (UTP)

---

**¡Tu sistema de estacionamiento está listo!** 🎉  
**Tiempo estimado de ejecución:** 5-15 minutos (sin instalación de Maven)  
**Soporte:** Ver documentación incluida en el proyecto

