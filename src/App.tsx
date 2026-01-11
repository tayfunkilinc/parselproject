import { useState, useEffect } from 'react';
import { ParcelForm } from './components/ParcelForm';
import { ParcelVisualization } from './components/ParcelVisualization';
import { supabase } from './lib/supabase';
import type { Parcel } from './lib/supabase';
import './App.css';

function App() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParcels();
  }, []);

  const loadParcels = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('parcels')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error loading parcels:', error);
    } else if (data) {
      setParcels(data);
    }
    setLoading(false);
  };

  const handleParcelAdded = (newParcel: Parcel) => {
    setParcels([newParcel, ...parcels]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Parsel Animasyon Görselleştirme</h1>
        <p className="subtitle">
          Ada ve parsel numaralarını girerek animasyonlu görselleştirme oluşturun
        </p>
      </header>

      <main className="app-main">
        <div className="form-section">
          <ParcelForm onParcelAdded={handleParcelAdded} />
        </div>

        <div className="visualization-section">
          {loading ? (
            <div className="loading">Yükleniyor...</div>
          ) : (
            <ParcelVisualization parcels={parcels} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
