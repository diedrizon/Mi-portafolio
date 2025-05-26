import React from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from './components/ParticleBackground';
import {
  FaHandPaper,
  FaDownload,
  FaPiggyBank,
  FaSchool,
  FaTools,
  FaPrescriptionBottleAlt,
  FaUtensils,
  FaServer,
  FaMobileAlt,
  FaEnvelope,
  FaGithub,
  FaFacebook,
  FaLinkedin
} from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';

import './App.css';
import './Projects.css';

function App() {
  // Variantes de animación para aparición en cascada
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.15, ease: 'easeOut' },
    }),
  };

  // Proyectos destacados con iconos contextuales
  const projects = [
    {
      name: 'APFINE',
      url: 'https://apfine.com/',
      desc: 'Gestión financiera (React + Vite + Firebase). Registra gastos, consulta métricas, gestiona comprobantes y metas.',
      icon: <FaPiggyBank />
    },
    {
      name: 'Colegio Bautista Ebenezer BI',
      url: 'https://github.com/JiniethM/Proyecto-Colegio-Bautista-Ebenezer_BI-2',
      desc: 'Sistema de calificaciones con reporting BI (Pentaho, Power BI, Tableau).',
      icon: <FaSchool />
    },
    {
      name: 'Reparaciones de Bicicleta',
      url: 'https://github.com/diedrizon/Reparaciones-de-bicicleta-',
      desc: 'App móvil (React Native + Expo + Firebase) para gestión de órdenes.',
      icon: <FaTools />
    },
    {
      name: 'Farmacia Rosales',
      url: 'https://github.com/diedrizon/Repositorio-Farmacia-Rosales..git',
      desc: 'Gestión de farmacia (Java + MySQL), control de inventario y ventas.',
      icon: <FaPrescriptionBottleAlt />
    },
    {
      name: 'Chontal Grill',
      url: 'https://github.com/diedrizon/Chontal_Grill.git',
      desc: 'Control de pedidos y mesas para restaurante (React Native + MySQL).',
      icon: <FaUtensils />
    },
    {
      name: 'SIVEN (Backend)',
      url: 'https://github.com/Alvaro-Hernandez/backend-SIVEN.git',
      desc: 'API REST con Spring Boot para datos epidemiológicos.',
      icon: <FaServer />
    },
    {
      name: 'SIVEN App (Flutter)',
      url: 'https://github.com/Alvaro-Hernandez/SIVEN_APP.git',
      desc: 'Cliente móvil en Flutter consumiendo la API de SIVEN.',
      icon: <FaMobileAlt />
    },
  ];

  return (
    <>
      {/* Fondo de partículas: no tocar */}
      <ParticleBackground />

      <div className="app-content">
        {/* HEADER */}
        <header className="header">
          <motion.img
            src="/imagenmia.jpg"
            alt="Avatar"
            className="avatar"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          />

          <motion.h1
            className="headline"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            custom={0}
          >
            <FaHandPaper className="icon-inline" />
            ¡Hola, soy Diedrizon Domingo Fargas Barrera!
          </motion.h1>

          <motion.p
            className="subheadline"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            custom={0.5}
          >
            Desarrollador Fullstack | React · React Native · Flutter · Java
          </motion.p>
        </header>

        <main className="container">
          {/* SOBRE MÍ */}
          <motion.section
            className="about"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            custom={0.7}
          >
            <h2>Sobre mí</h2>
            <p>
              Desarrollador Fullstack con experiencia en web y móvil. Especializado en
              Git, Java, Spring Boot y React. He trabajado en:
            </p>
            <ul>
              <li>Sistemas de gestión de calificaciones estudiantiles.</li>
              <li>Planificación epidemiológica (sector salud).</li>
              <li>Administración de restaurantes.</li>
              <li>Mantenimiento y reparaciones de bicicletas.</li>
              <li>Gestión de farmacia e inventario.</li>
            </ul>
            <p>
              Estudiante de Ingeniería en Sistemas de la Información en la UNAN, nivel de inglés A2,
              con sólidas habilidades de trabajo en equipo y resolución de problemas.
            </p>
            <a href="/CV.pdf" download className="btn-cv">
              <FaDownload /> Descargar mi CV
            </a>
          </motion.section>

          {/* PROYECTOS COMO TARJETAS CON ICONO */}
          <motion.section
            className="projects"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2>Proyectos Destacados</h2>
            <div className="project-grid">
              {projects.map((p, i) => (
                <motion.a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                  custom={i}
                >
                  <div className="project-icon-wrapper">
                    {p.icon}
                  </div>
                  <div className="project-info">
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.section>

          {/* HABILIDADES */}
          <motion.section
            className="skills"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            custom={1.3}
          >
            <h2>Habilidades Técnicas</h2>
            <ul>
              <li>JavaScript, Java, SQL</li>
              <li>React, React Native, Flutter, Spring Boot, Node.js</li>
              <li>MySQL, Firebase</li>
              <li>Power BI, Pentaho, Tableau</li>
              <li>Git, Vite, AWS, Figma</li>
            </ul>
          </motion.section>

          {/* CONTACTO */}
          <motion.section
            className="contact"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            custom={1.5}
          >
            <h2>Contacto</h2>
            <ul className="contact-list">
              <li><FaEnvelope /> diedrinzonfargas@gmail.com</li>
              <li><FaGithub /> GitHub</li>
              <li><FaFacebook /> Facebook</li>
              <li><SiTiktok /> TikTok</li>
              <li><FaLinkedin /> LinkedIn</li>
            </ul>
          </motion.section>
        </main>

        {/* FOOTER */}
        <footer className="footer">
          <div className="container">
            <p>&copy; 2025 Diedrizon Domingo Fargas Barrera. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
