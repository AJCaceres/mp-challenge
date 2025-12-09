import './Table.css';

function Table({ columns, data, loading, emptyMessage = 'No hay datos disponibles' }) {
  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <div className="empty-state-title">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead className="table-header">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                className="table-header-cell"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="table-row">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="table-cell">
                  {column.cell ? column.cell(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
