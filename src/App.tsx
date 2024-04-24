import './App.css';

import { Provider } from 'react-redux';

import AdminDashboard from './AdminDashboard';
import { store } from './app/store'; // Assurez-vous que le chemin d'importation est correct

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <AdminDashboard />
      </div>
    </Provider>
  );
}

export default App;
