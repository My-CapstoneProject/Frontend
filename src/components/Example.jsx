import './styles/shared.css';

function ExampleComponent() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Page Title</h1>
        <button className="btn btn-primary">
          <i className="fas fa-plus"></i>
          Add New
        </button>
      </div>
      
      <div className="grid">
        <div className="card">
          <h2>Card Title</h2>
          <p>Card content</p>
          <span className="badge badge-success">Active</span>
        </div>
      </div>
      
      <table className="table">
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data 1</td>
            <td>Data 2</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ExampleComponent; 