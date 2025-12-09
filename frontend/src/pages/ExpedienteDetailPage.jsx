import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button, Card, Table, Modal, Input, Loading } from '../components/ui';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';
import api from '../../api/client';
import './ExpedienteDetailPage.css';

function ExpedienteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  
  const [expediente, setExpediente] = useState(null);
  const [indicios, setIndicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedIndicio, setSelectedIndicio] = useState(null);
  const [formData, setFormData] = useState({
    descripcion: '',
    color: '',
    tamano: '',
    peso: '',
    ubicacion: ''
  });

  const isTecnico = user?.rol === 'TECNICO';
  const canEdit = isTecnico && expediente?.estado === 'BORRADOR';

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const indResponse = await api.get(`/indicios/por-expediente/${id}`);
      
      // Obtener el expediente desde la lista (ya que no hay endpoint específico)
      const expResponse = await api.get('/expedientes');
      const exp = expResponse.data.find(e => e.idExpediente === parseInt(id));
      
      if (!exp) {
        throw new Error('Expediente no encontrado');
      }
      
      setExpediente(exp);
      setIndicios(indResponse.data);
    } catch (error) {
      toast.error(error.userMessage || 'Error al cargar datos');
      navigate('/expedientes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIndicio = () => {
    setModalMode('create');
    setFormData({
      descripcion: '',
      color: '',
      tamano: '',
      peso: '',
      ubicacion: ''
    });
    setSelectedIndicio(null);
    setModalOpen(true);
  };

  const handleEditIndicio = (indicio) => {
    setModalMode('edit');
    setFormData({
      descripcion: indicio.descripcion,
      color: indicio.color || '',
      tamano: indicio.tamano || '',
      peso: indicio.peso || '',
      ubicacion: indicio.ubicacion || ''
    });
    setSelectedIndicio(indicio);
    setModalOpen(true);
  };

  const handleSubmitIndicio = async (e) => {
    e.preventDefault();
    
    try {
      if (modalMode === 'create') {
        await api.post('/indicios', {
          ...formData,
          idExpediente: id
        });
        toast.success('Indicio creado exitosamente');
      } else {
        await api.put(`/indicios/${selectedIndicio.idIndicio}`, formData);
        toast.success('Indicio actualizado exitosamente');
      }
      
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.userMessage || 'Error al guardar indicio');
    }
  };

  const handleDeleteIndicio = async (idIndicio) => {
    if (!confirm('¿Está seguro de eliminar este indicio?')) return;
    
    try {
      await api.delete(`/indicios/${idIndicio}`);
      toast.success('Indicio eliminado');
      fetchData();
    } catch (error) {
      toast.error(error.userMessage || 'Error al eliminar indicio');
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

  const indicioCols = [
    {
      header: 'ID',
      accessor: 'idIndicio',
      width: '70px'
    },
    {
      header: 'Descripción',
      accessor: 'descripcion'
    },
    {
      header: 'Color',
      accessor: 'color'
    },
    {
      header: 'Tamaño',
      accessor: 'tamano'
    },
    {
      header: 'Peso',
      accessor: 'peso'
    },
    {
      header: 'Ubicación',
      accessor: 'ubicacion'
    },
    {
      header: 'Fecha Registro',
      cell: (row) => new Date(row.fechaRegistro).toLocaleDateString(),
      width: '120px'
    },
    ...(canEdit ? [{
      header: 'Acciones',
      cell: (row) => (
        <div className="table-actions">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleEditIndicio(row)}
          >
            ✏️
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleDeleteIndicio(row.idIndicio)}
          >
            🗑️
          </Button>
        </div>
      ),
      width: '120px'
    }] : [])
  ];

  if (loading) {
    return (
      <Layout>
        <Loading fullScreen message="Cargando expediente..." />
      </Layout>
    );
  }

  if (!expediente) {
    return (
      <Layout>
        <Card title="Error">
          <p>Expediente no encontrado</p>
          <Button onClick={() => navigate('/expedientes')}>
            Volver a expedientes
          </Button>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="detail-header">
        <Button variant="ghost" onClick={() => navigate('/expedientes')}>
          ← Volver
        </Button>
      </div>

      <Card 
        title={`Expediente: ${expediente.numeroExpediente}`}
        subtitle={`ID: ${expediente.idExpediente}`}
        actions={
          <span className={`badge ${getEstadoBadge(expediente.estado)}`}>
            {expediente.estado?.replace('_', ' ')}
          </span>
        }
      >
        <div className="expediente-details">
          <div className="detail-row">
            <span className="detail-label">Número de Expediente:</span>
            <span className="detail-value">{expediente.numeroExpediente}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Creado por:</span>
            <span className="detail-value">{expediente.tecnicoNombre || 'N/A'}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Fecha de registro:</span>
            <span className="detail-value">
              {new Date(expediente.fechaRegistro).toLocaleString()}
            </span>
          </div>
          
          {expediente.fechaAprobacion && (
            <div className="detail-row">
              <span className="detail-label">Fecha de aprobación:</span>
              <span className="detail-value">
                {new Date(expediente.fechaAprobacion).toLocaleString()}
              </span>
            </div>
          )}
          
          {expediente.justificacionRechazo && expediente.estado === 'RECHAZADO' && (
            <div className="detail-row detail-row-highlight">
              <span className="detail-label">Motivo de rechazo:</span>
              <span className="detail-value text-danger">{expediente.justificacionRechazo}</span>
            </div>
          )}
        </div>
      </Card>

      <Card
        title="Indicios"
        subtitle={`${indicios.length} indicios registrados`}
        actions={
          canEdit && (
            <Button onClick={handleCreateIndicio}>
              + Agregar Indicio
            </Button>
          )
        }
      >
        <Table 
          columns={indicioCols}
          data={indicios}
          emptyMessage="No hay indicios registrados para este expediente"
        />
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalMode === 'create' ? 'Nuevo Indicio' : 'Editar Indicio'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitIndicio}>
              {modalMode === 'create' ? 'Crear' : 'Guardar'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmitIndicio} className="indicio-form">
          <div className="input-group">
            <label htmlFor="descripcion" className="input-label">
              Descripción <span className="input-required">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              className="input"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
              required
              placeholder="Descripción detallada del indicio"
            />
          </div>
          
          <Input
            label="Color"
            name="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            placeholder="Ej: Rojo, Azul, Negro..."
          />
          
          <div className="input-row">
            <Input
              label="Tamaño"
              name="tamano"
              value={formData.tamano}
              onChange={(e) => setFormData({ ...formData, tamano: e.target.value })}
              placeholder="Ej: 10cm x 5cm"
            />
            
            <Input
              label="Peso"
              name="peso"
              value={formData.peso}
              onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
              placeholder="Ej: 500g"
            />
          </div>
          
          <Input
            label="Ubicación del Hallazgo"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
            placeholder="Ej: Sala de estar, cerca de la ventana"
          />
        </form>
      </Modal>
    </Layout>
  );
}

export default ExpedienteDetailPage;
