// src/components/admin/graph-stats.js

// Importaciones de React, Supabase y componentes de gráficos
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Importa el cliente de Supabase para consultas a la base de datos
import { Line, Bar } from 'react-chartjs-2'; // Importa los componentes de gráfico de líneas y barras
import { useNavigate } from 'react-router-dom'; // Permite la navegación entre rutas
import './GraphStats.css'; // Importa estilos específicos para el componente

// Configuración global de Chart.js para el registro de componentes del gráfico
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'; // Importa módulos necesarios para la construcción de gráficos

// Registro de componentes de Chart.js necesarios para los gráficos
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Componente funcional para mostrar estadísticas gráficas
const GraphStats = () => {
  const [userData, setUserData] = useState([]); // Estado para los datos de usuarios
  const [templateData, setTemplateData] = useState([]); // Estado para los datos de plantillas
  const [collaborationData, setCollaborationData] = useState([]); // Estado para los datos de colaboraciones
  const navigate = useNavigate(); // Hook para la navegación programada

  // Efecto para cargar datos estadísticos al montar el componente
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Consultas a Supabase para obtener los datos de creación de usuarios, plantillas y colaboraciones
        const { data: users, error: userError } = await supabase
          .from('Users')
          .select('created_at');
        if (userError) console.error('Error fetching user data:', userError);

        const { data: templates, error: templateError } = await supabase
          .from('Templates')
          .select('created_at');
        if (templateError) console.error('Error fetching template data:', templateError);

        const { data: collaborations, error: collaborationError } = await supabase
          .from('Collaborations')
          .select('created_at');
        if (collaborationError) console.error('Error fetching collaboration data:', collaborationError);

        // Agrupación de datos por mes para cada conjunto de datos
        const userCounts = groupDataByMonth(users);
        setUserData(userCounts);
        const templateCounts = groupDataByMonth(templates);
        setTemplateData(templateCounts);
        const collaborationCounts = groupDataByMonth(collaborations);
        setCollaborationData(collaborationCounts);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Función para agrupar datos por mes utilizando la fecha de creación
  const groupDataByMonth = (data) => {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const counts = {};

    data.forEach((item) => {
      const date = new Date(item.created_at);
      const monthIndex = date.getMonth(); // Obtén el índice del mes (0 = Enero, 11 = Diciembre)
      counts[monthIndex] = (counts[monthIndex] || 0) + 1;
    });

    // Convierte los datos en un array ordenado por índice de mes
    return Object.entries(counts)
      .sort(([a], [b]) => a - b) // Ordena por el índice numérico del mes
      .map(([monthIndex, count]) => ({
        month: monthNames[monthIndex], // Usa el nombre del mes
        count,
      }));
  };

  // Configuración de los datos para el gráfico de líneas de usuarios
  const userChartData = {
    labels: userData.map((item) => item.month),
    datasets: [
      {
        label: 'Usuarios Registrados',
        data: userData.map((item) => item.count),
        borderColor: '#00d4ff',
        backgroundColor: '#00d4ff80',
      },
    ],
  };

  // Configuración de los datos para el gráfico de barras de plantillas
  const templateChartData = {
    labels: templateData.map((item) => item.month),
    datasets: [
      {
        label: 'Plantillas Registradas',
        data: templateData.map((item) => item.count),
        borderColor: '#4caf50',
        backgroundColor: '#4caf5080',
      },
    ],
  };

  // Configuración de los datos para el gráfico de líneas de colaboraciones
  const collaborationChartData = {
    labels: collaborationData.map((item) => item.month),
    datasets: [
      {
        label: 'Colaboraciones Registradas',
        data: collaborationData.map((item) => item.count),
        borderColor: '#ff5722',
        backgroundColor: '#ff572280',
      },
    ],
  };

  // Renderizado del componente con gráficos y botón de retorno
  return (
    <div className="graph-stats-container">
      <h2>Estadísticas Gráficas</h2>
      <button className="back-button" onClick={() => navigate('/admin')}>
        Volver al Dashboard
      </button>
      <div className="chart-container">
        <h3>Usuarios Registrados</h3>
        <Line data={userChartData} options={{ responsive: true }} />
      </div>
      <div className="chart-container">
        <h3>Plantillas Registradas</h3>
        <Bar data={templateChartData} options={{ responsive: true }} />
      </div>
      <div className="chart-container">
        <h3>Colaboraciones Registradas</h3>
        <Line data={collaborationChartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default GraphStats;
