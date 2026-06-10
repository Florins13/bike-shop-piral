import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Bike, BikeService } from './BikeService';

const bikeService = new BikeService();

const BIKE_IMAGE_BASE_URL = 'http://localhost:8082';

export const BikeList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bikes, setBikes] = useState<Bike[]>([]);

  useEffect(() => {
    let isMounted = true;
    bikeService.getBikes().then((data) => {
      if (isMounted) setBikes(data);
    });
    return () => { isMounted = false; };
  }, []);

  const filteredBikes = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return bikes.filter((b) => b.model.toLowerCase().includes(term));
  }, [bikes, searchTerm]);

  const addToCart = (bike: Bike) => {
    window.dispatchEvent(
      new CustomEvent('add-to-cart', {
        detail: { bike },
        bubbles: true,
        composed: true,
      })
    );
    console.log(`Dispatched add-to-cart event for bike id: ${bike.id}`);
  };

  return (
    <main style={{ padding: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="search">Search </label>
        <input
          id="search"
          type="text"
          placeholder="Search bikes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        {filteredBikes.map((bike) => (
          <div key={bike.id} className="bike__box">
            <h4>Model: {bike.model}</h4>
            <img src={`${BIKE_IMAGE_BASE_URL}/${bike.imageSource}`} height={70} width={70} alt={bike.model} />
            <span>Stock: {bike.availableStock}</span>
            <span>Details: {bike.details}</span>
            <span>Electric: {bike.electric ? 'Yes' : 'No'}</span>
            <span>Price: {bike.price}€</span>
            <button onClick={() => addToCart(bike)} disabled={bike.availableStock <= 0}>
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default BikeList;
