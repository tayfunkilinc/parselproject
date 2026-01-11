import { useEffect, useRef, useState } from 'react';
import type { Parcel } from '../lib/supabase';

interface ParcelVisualizationProps {
  parcels: Parcel[];
}

export function ParcelVisualization({ parcels }: ParcelVisualizationProps) {
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    if (parcels.length > 0) {
      const lastIndex = parcels.length - 1;
      setAnimatingIndex(lastIndex);

      const path = pathRefs.current[lastIndex];
      if (path) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;

        requestAnimationFrame(() => {
          path.style.transition = 'stroke-dashoffset 2s ease-in-out';
          path.style.strokeDashoffset = '0';
        });

        const timer = setTimeout(() => {
          setAnimatingIndex(null);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [parcels]);

  const createPathData = (coordinates: number[][]) => {
    if (!coordinates || coordinates.length === 0) return '';

    const points = coordinates.map((coord, index) => {
      const [x, y] = coord;
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    });

    return points.join(' ') + ' Z';
  };

  if (parcels.length === 0) {
    return (
      <div className="visualization-empty">
        <svg viewBox="0 0 400 400" className="empty-svg">
          <defs>
            <linearGradient id="emptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" fill="url(#emptyGrad)" rx="8" />
          <text x="200" y="200" textAnchor="middle" fill="#94a3b8" fontSize="16">
            Parsel bilgisi giriniz
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className="visualization-container">
      <h2>Parsel Görselleştirme</h2>
      <div className="parcels-grid">
        {parcels.map((parcel, index) => (
          <div key={parcel.id || index} className="parcel-card">
            <div className="parcel-info">
              <h3>
                Ada: {parcel.ada_no} / Parsel: {parcel.parsel_no}
              </h3>
              {parcel.il && (
                <p className="location">
                  {parcel.il}
                  {parcel.ilce && ` / ${parcel.ilce}`}
                  {parcel.mahalle && ` / ${parcel.mahalle}`}
                </p>
              )}
            </div>

            <svg viewBox="0 0 400 400" className="parcel-svg">
              <defs>
                <linearGradient
                  id={`grad-${index}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
                </linearGradient>

                <filter id={`glow-${index}`}>
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {parcel.coordinates && parcel.coordinates.length > 0 && (
                <>
                  <path
                    d={createPathData(parcel.coordinates)}
                    fill={`url(#grad-${index})`}
                    stroke="none"
                  />

                  <path
                    ref={(el) => {
                      pathRefs.current[index] = el;
                    }}
                    d={createPathData(parcel.coordinates)}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    filter={`url(#glow-${index})`}
                    className={
                      animatingIndex === index ? 'animating' : 'static'
                    }
                  />

                  {parcel.coordinates.map((coord, pointIndex) => (
                    <circle
                      key={pointIndex}
                      cx={coord[0]}
                      cy={coord[1]}
                      r="4"
                      fill="#3b82f6"
                      className={
                        animatingIndex === index
                          ? 'point-animate'
                          : 'point-static'
                      }
                      style={{
                        animationDelay: `${
                          (pointIndex / parcel.coordinates!.length) * 2
                        }s`,
                      }}
                    />
                  ))}
                </>
              )}
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
