import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button, Table, Card, Modal, Input } from '../components/ui';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';
import api from '../../api/client';
import './IndiciosPage.css';

function IndiciosPage() {
  const { id: idExpediente } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  
  const [indicios, setIndicios] = useState([]);
  const [expediente, setExpediente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedIndicio, setSelectedIndicio] = useState(null);
  const [formData, setFormData] = useState({
    descripcion: '',
    color: '',
    tamano: '',
    peso: '',
    ubicacion: ''
  });

  const isTecnico = user?.rol === 'TECNICO';
  const isCoordinador = user?.rol === 'COORDINADOR';
  const isReadOnly = isCoordinador;

  useEffect(() => {
    fetchData();
  }, [idExpediente]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Cargar indicios
      const indResponse = await api.get(`/indicios/por-expediente/${idExpediente}`);
      setIndicios(indResponse.data);
      
      // Cargar información del expediente
      const expResponse = await api.get('/expedientes');
      const exp = expResponse.data.find(e => e.idExpediente === parseInt(idExpediente));
      setExpediente(exp);
    } catch (error) {
      toast.error(error.userMessage || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (!isTecnico) return;
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

  const handleEdit = (indicio) => {
    if (!isTecnico) return;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.descripcion.trim()) {
      toast.error('La descripción es obligatoria');
      return;
    }
    
    try {
      if (modalMode === 'create') {
        await api.post('/indicios', {
          ...formData,
          idExpediente: parseInt(idExpediente)
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

  const handleDelete = async (id) => {
    if (!isTecnico) return;
    if (!confirm('¿Está seguro de eliminar este indicio?')) return;
    
    try {
      await api.delete(`/indicios/${id}`);
      toast.success('Indicio eliminado');
      fetchData();
    } catch (error) {
      toast.error(error.userMessage || 'Error al eliminar indicio');
    }
  };

  const columns = [
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
      accessor: 'color',
      cell: (row) => row.color || '-'
    },
    {
      header: 'Tamaño',
      accessor: 'tamano',
      cell: (row) => row.tamano || '-'
    },
    {
      header: 'Peso',
      accessor: 'peso',
      cell: (row) => row.peso || '-'
    },
    {
      header: 'Ubicación',
      accessor: 'ubicacion',
      cell: (row) => row.ubicacion || '-'
    },
    {
      header: 'Fecha Registro',
      cell: (row) => new Date(row.fechaRegistro).toLocaleDateString(),
      width: '120px'
    },
    ...(isTecnico ? [{
      header: 'Acciones',
      cell: (row) => (
        <div className="table-actions">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleEdit(row)}
            title="Editar"
          >
            ✏️
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleDelete(row.idIndicio)}
            title="Eliminar"
          >
            🗑️
          </Button>
        </div>
      ),
      width: '120px'
    }] : [])
  ];

  return (
    <Layout>
      <div className="indicios-header">
        <Button variant="ghost" onClick={() => navigate('/expedientes')}>
          ← Volver a expedientes
        </Button>
      </div>

      <Card
        title={`Indicios del expediente ${expediente?.numeroExpediente || `#${idExpediente}`}`}
        subtitle={`${indicios.length} indicios registrados`}
        actions={
          !isReadOnly && isTecnico && (
            <Button onClick={handleCreate}>
              + Agregar Indicio
            </Button>
          )
        }
      >
        {isReadOnly && (
          <p className="text-sm text-secondary" style={{ marginBottom: '12px' }}>
            Vista de solo lectura para coordinadores.
          </p>
        )}
        <Table 
          columns={columns}
          data={indicios}
          loading={loading}
          emptyMessage="No hay indicios registrados para este expediente"
        />
      </Card>

      {isTecnico && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalMode === 'create' ? 'Nuevo Indicio' : 'Editar Indicio'}
          size="lg"
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
          <form onSubmit={handleSubmit} className="indicio-form">
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
      )}
    </Layout>
  );
}

export default IndiciosPage;