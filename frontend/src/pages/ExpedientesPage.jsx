
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button, Table, Card, Modal, Input } from '../components/ui';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';
import api from '../../api/client';
import './ExpedientesPage.css';

// Copilot: crea una página ExpeditentesPage para gestionar expedientes.
// Requisitos funcionales:
// - Consumir la API /api/expedientes (GET) para listar expedientes en una tabla.
// - Mostrar columnas: númeroExpediente, fechaRegistro, estado, tecnicoNombre.
// - Agregar filtros por estado (select con BORRADOR, EN_REVISION, APROBADO, RECHAZADO, TODOS) y por rango de fechas (fechaDesde, fechaHasta), usando los query params que el backend ya soporta.
// - Agregar un botón "Nuevo expediente" que abra un formulario (puede ser inline o en la misma página) para crear un expediente con /api/expedientes (POST).
// - Permitir al rol TECNICO editar númeroExpediente y enviar a revisión (POST /api/expedientes/:id/enviar).
// - Dejar hooks de clic o botones preparados para que otro componente pueda ver/gestionar indicios del expediente (por ejemplo, botón "Ver indicios").
// - Manejar estados de carga y error, con mensajes claros.
// Mantén los estilos sencillos pero ordenados (tabla bien separada, botones distinguibles).

function ExpedientesPage() {
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedExpediente, setSelectedExpediente] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectJustification, setRejectJustification] = useState('');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [formData, setFormData] = useState({
    numeroExpediente: ''
  });
  const [filters, setFilters] = useState({
    estado: '',
    busqueda: ''
  });
  
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  
  const isTecnico = user?.rol === 'TECNICO';
  const isCoordinador = user?.rol === 'COORDINADOR';

  useEffect(() => {
    fetchExpedientes();
  }, []);

  const fetchExpedientes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/expedientes');
      setExpedientes(response.data);
    } catch (error) {
      toast.error(error.userMessage || 'Error al cargar expedientes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      numeroExpediente: ''
    });
    setSelectedExpediente(null);
    setModalOpen(true);
  };

  const handleEdit = (expediente) => {
    setModalMode('edit');
    setFormData({
      numeroExpediente: expediente.numeroExpediente
    });
    setSelectedExpediente(expediente);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalMode === 'create') {
        await api.post('/expedientes', formData);
        toast.success('Expediente creado exitosamente');
      } else {
        await api.put(`/expedientes/${selectedExpediente.idExpediente}`, formData);
        toast.success('Expediente actualizado exitosamente');
      }
      
      setModalOpen(false);
      fetchExpedientes();
    } catch (error) {
      toast.error(error.userMessage || 'Error al guardar expediente');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar este expediente?')) return;
    
    try {
      await api.delete(`/expedientes/${id}`);
      toast.success('Expediente eliminado');
      fetchExpedientes();
    } catch (error) {
      toast.error(error.userMessage || 'Error al eliminar expediente');
    }
  };

  const handleEnviarRevision = async (id) => {
    if (!confirm('¿Enviar este expediente a revisión?')) return;
    
    try {
      await api.post(`/expedientes/${id}/enviar`);
      toast.success('Expediente enviado a revisión');
      fetchExpedientes();
    } catch (error) {
      toast.error(error.userMessage || 'Error al enviar expediente');
    }
  };

  const handleAprobar = async (id) => {
    try {
      await api.post(`/expedientes/${id}/aprobar`);
      toast.success('Expediente aprobado');
      fetchExpedientes();
    } catch (error) {
      toast.error(error.userMessage || 'Error al aprobar expediente');
    }
  };

  const handleOpenRechazar = (expediente) => {
    setRejectTarget(expediente);
    setRejectJustification('');
    setRejectModalOpen(true);
  };

  const handleSubmitRechazar = async () => {
    if (!rejectTarget) return;
    if (!rejectJustification.trim()) {
      toast.error('Ingresa una justificación para el rechazo');
      return;
    }

    try {
      await api.post(`/expedientes/${rejectTarget.idExpediente}/rechazar`, {
        justificacion: rejectJustification.trim()
      });
      toast.success('Expediente rechazado');
      fetchExpedientes();
    } catch (error) {
      toast.error(error.userMessage || 'Error al rechazar expediente');
    } finally {
      setRejectModalOpen(false);
      setRejectTarget(null);
      setRejectJustification('');
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'BORRADOR': 'badge-secondary',
      'EN_REVISION': 'badge-warning',
      'APROBADO': 'badge-success',
      'RECHAZADO': 'badge-danger'
    };
    return badges[estado] || 'badge-secondary';
  };

  const filteredExpedientes = expedientes.filter(exp => {
    const matchEstado = !filters.estado || exp.estado === filters.estado;
    const matchBusqueda = !filters.busqueda || 
      exp.numeroExpediente.toLowerCase().includes(filters.busqueda.toLowerCase());
    
    return matchEstado && matchBusqueda;
  });

  const columns = [
    {
      header: 'ID',
      accessor: 'idExpediente',
      width: '80px'
    },
    {
      header: 'Número de Expediente',
      accessor: 'numeroExpediente',
    },
    {
      header: 'Estado',
      cell: (row) => (
        <span className={`badge ${getEstadoBadge(row.estado)}`}>
          {row.estado?.replace('_', ' ')}
        </span>
      ),
      width: '130px'
    },
    {
      header: 'Técnico',
      accessor: 'tecnicoNombre',
      width: '150px'
    },
    {
      header: 'Fecha Registro',
      cell: (row) => new Date(row.fechaRegistro).toLocaleDateString(),
      width: '130px'
    },
    {
      header: 'Acciones',
      cell: (row) => (
        <div className="table-actions">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate(`/expedientes/${row.idExpediente}`)}
          >
            Detalle
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate(`/expedientes/${row.idExpediente}/indicios`)}
            title="Ver indicios"
          >
            Ver Indicios
          </Button>
          
          {isTecnico && row.estado === 'BORRADOR' && (
            <>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleEdit(row)}
              >
                ✏️
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleDelete(row.idExpediente)}
              >
                🗑️
              </Button>
              <Button 
                size="sm" 
                variant="primary"
                onClick={() => handleEnviarRevision(row.idExpediente)}
              >
                Enviar
              </Button>
            </>
          )}
          {isTecnico && row.estado === 'RECHAZADO' && (
            <>
              <Button 
                size="sm" 
                variant="primary"
                onClick={() => handleEnviarRevision(row.idExpediente)}
              >
                Enviar Corrección
              </Button>
            </>
          )}
          
          {isCoordinador && row.estado === 'EN_REVISION' && (
            <>
              <Button 
                size="sm" 
                variant="success"
                onClick={() => handleAprobar(row.idExpediente)}
              >
                Aprobar
              </Button>
              <Button 
                size="sm" 
                variant="danger"
                onClick={() => handleOpenRechazar(row)}
              >
                Rechazar
              </Button>
            </>
          )}
        </div>
      ),
      width: '280px'
    }
  ];

  return (
    <Layout>
      <Card 
        title="Expedientes"
        subtitle={`${filteredExpedientes.length} expedientes encontrados`}
        actions={
          isTecnico && (
            <Button onClick={handleCreate}>
              + Nuevo Expediente
            </Button>
          )
        }
      >
        <div className="expedientes-filters">
          <Input
            placeholder="Buscar por número de expediente..."
            value={filters.busqueda}
            onChange={(e) => setFilters({ ...filters, busqueda: e.target.value })}
          />
          
          <select 
            className="input select-filter"
            value={filters.estado}
            onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
          >
            <option value="">Todos los estados</option>
            <option value="BORRADOR">Borrador</option>
            <option value="EN_REVISION">En Revisión</option>
            <option value="APROBADO">Aprobado</option>
            <option value="RECHAZADO">Rechazado</option>
          </select>
        </div>

        <Table 
          columns={columns}
          data={filteredExpedientes}
          loading={loading}
          emptyMessage="No hay expedientes para mostrar"
        />
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalMode === 'create' ? 'Nuevo Expediente' : 'Editar Expediente'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {modalMode === 'create' ? 'Crear' : 'Guardar'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="expediente-form">
          <Input
            label="Número de Expediente"
            name="numeroExpediente"
            value={formData.numeroExpediente}
            onChange={(e) => setFormData({ ...formData, numeroExpediente: e.target.value })}
            required
            placeholder="Ej: EXP-2025-001"
            helperText="Ingrese un número único para identificar el expediente"
          />
        </form>
      </Modal>

      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Rechazar expediente"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRejectModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleSubmitRechazar}>
              Rechazar
            </Button>
          </>
        }
      >
        <div className="expediente-form">
          <p className="text-sm text-secondary">
            Indica la justificación para rechazar el expediente
            {rejectTarget ? ` #${rejectTarget.numeroExpediente}` : ''}.
          </p>
          <Input
            label="Justificación"
            name="justificacion"
            value={rejectJustification}
            onChange={(e) => setRejectJustification(e.target.value)}
            placeholder="Motivo del rechazo"
          />
        </div>
      </Modal>
    </Layout>
  );
}

export default ExpedientesPage;
