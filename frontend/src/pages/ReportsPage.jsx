import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Button, Input, Card, Table } from '../components/ui';
import { useToast } from '../components/ui/Toast';
import api from '../../api/client';

// Copilot: mejora el diseño de esta página de reportes.
// Requisitos:
// - Mantener la lógica actual de filtros por fecha y llamada a /reportes/expedientes-por-estado.
// - Distribuir mejor la información: filtros arriba, tabla y gráfica en un layout responsivo (por ejemplo, tabla arriba y gráfica abajo en móvil; lado a lado en pantallas grandes).
// - Añadir resumen corto arriba de la tabla, por ejemplo: "Total expedientes en rango: X" (sumando todos los totales).
// - Asegurarte de que los textos sean claros para un usuario no técnico (títulos, etiquetas, mensajes cuando no hay datos).
// - Mantener el uso de Recharts (BarChart) sin cambiar la lógica de datos.

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import './ReportsPage.css';


function ReportsPage() {
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();


  const handleFetch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (fechaDesde) params.fechaDesde = fechaDesde;
      if (fechaHasta) params.fechaHasta = fechaHasta;

      const response = await api.get('/reportes/expedientes-por-estado', { params });
      setData(response.data || []);
      toast.success('Reporte generado exitosamente');
    } catch (err) {
      toast.error(err.userMessage || 'Error al obtener el reporte');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Estado',
      accessor: 'estado',
      cell: (row) => (
        <span className={`badge ${getBadgeClass(row.estado)}`}>
          {row.estado.replace('_', ' ')}
        </span>
      )
    },
    {
      header: 'Total',
      accessor: 'total',
      width: '120px'
    }
  ];

  const getBadgeClass = (estado) => {
    const badges = {
      'BORRADOR': 'badge-secondary',
      'EN_REVISION': 'badge-warning',
      'APROBADO': 'badge-success',
      'RECHAZADO': 'badge-danger'
    };
    return badges[estado] || 'badge-secondary';
  };

  return (
    <Layout fullWidth>
      <Card 
        title="Reportes de Expedientes"
        subtitle="Visualiza estadísticas de expedientes por estado"
      >
        <div className="reports-filters">
          <Input
            label="Fecha desde"
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
          
          <Input
            label="Fecha hasta"
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
          
          <div className="reports-filter-button">
            <Button
              onClick={handleFetch}
              loading={loading}
              fullWidth
            >
              Generar Reporte
            </Button>
          </div>
        </div>
      </Card>

      {data.length > 0 && (
        <>
          <Card title="Tabla de Resultados">
            <Table 
              columns={columns}
              data={data}
              emptyMessage="No hay datos para mostrar"
            />
          </Card>

          <Card title="Gráfica de Expedientes por Estado">
            <div className="reports-chart">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="estado" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="var(--primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </Layout>
  );
}

export default ReportsPage;