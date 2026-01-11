import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Parcel } from '../lib/supabase';

interface ParcelFormProps {
  onParcelAdded: (parcel: Parcel) => void;
}

export function ParcelForm({ onParcelAdded }: ParcelFormProps) {
  const [adaNo, setAdaNo] = useState('');
  const [parselNo, setParselNo] = useState('');
  const [il, setIl] = useState('');
  const [ilce, setIlce] = useState('');
  const [mahalle, setMahalle] = useState('');
  const [loading, setLoading] = useState(false);

  const generateRandomParcelShape = () => {
    const points: number[][] = [];
    const numPoints = 4 + Math.floor(Math.random() * 4);
    const centerX = 200;
    const centerY = 200;
    const radius = 100 + Math.random() * 50;

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const variation = 0.7 + Math.random() * 0.6;
      const x = centerX + Math.cos(angle) * radius * variation;
      const y = centerY + Math.sin(angle) * radius * variation;
      points.push([Math.round(x), Math.round(y)]);
    }

    return points;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adaNo || !parselNo) {
      alert('Ada ve Parsel numarası giriniz');
      return;
    }

    setLoading(true);

    const coordinates = generateRandomParcelShape();

    const newParcel: Parcel = {
      ada_no: adaNo,
      parsel_no: parselNo,
      il,
      ilce,
      mahalle,
      coordinates,
    };

    const { data, error } = await supabase
      .from('parcels')
      .insert([newParcel])
      .select()
      .maybeSingle();

    setLoading(false);

    if (error) {
      console.error('Error:', error);
      alert('Parsel kaydedilemedi');
      return;
    }

    if (data) {
      onParcelAdded(data);
      setAdaNo('');
      setParselNo('');
      setIl('');
      setIlce('');
      setMahalle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="parcel-form">
      <h2>Parsel Bilgileri</h2>

      <div className="form-group">
        <label htmlFor="il">İl</label>
        <input
          id="il"
          type="text"
          value={il}
          onChange={(e) => setIl(e.target.value)}
          placeholder="Örn: İstanbul"
        />
      </div>

      <div className="form-group">
        <label htmlFor="ilce">İlçe</label>
        <input
          id="ilce"
          type="text"
          value={ilce}
          onChange={(e) => setIlce(e.target.value)}
          placeholder="Örn: Kadıköy"
        />
      </div>

      <div className="form-group">
        <label htmlFor="mahalle">Mahalle</label>
        <input
          id="mahalle"
          type="text"
          value={mahalle}
          onChange={(e) => setMahalle(e.target.value)}
          placeholder="Örn: Caferağa"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ada">Ada No *</label>
          <input
            id="ada"
            type="text"
            value={adaNo}
            onChange={(e) => setAdaNo(e.target.value)}
            placeholder="Ada numarası"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="parsel">Parsel No *</label>
          <input
            id="parsel"
            type="text"
            value={parselNo}
            onChange={(e) => setParselNo(e.target.value)}
            placeholder="Parsel numarası"
            required
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Ekleniyor...' : 'Parsel Ekle ve Görselleştir'}
      </button>
    </form>
  );
}
