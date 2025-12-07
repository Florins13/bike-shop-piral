import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Bike, BikeService } from './BikeService';

type Role = 'BASIC' | 'MANAGER' | 'GUEST';

const bikeService = new BikeService();

export const BikeList: React.FC = () => {
  const [role, setRole] = useState<Role>('BASIC');
  const [searchTerm, setSearchTerm] = useState('');
  const [bikes, setBikes] = useState<Bike[]>([]);

  // Fetch bikes on mount
  useEffect(() => {
    let isMounted = true;

    bikeService.getBikes().then((data) => {
      if (isMounted) setBikes(data);
    });

    return () => {
      isMounted = false;
    };
}, []);

  // Filter bikes based on searchTerm
  const filteredBikes = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return bikes.filter((b) => b.model.toLowerCase().includes(term));
  }, [bikes, searchTerm]);

  // Dispatch add-to-cart event
  const addToCart = (bike: Bike) => {
    window.dispatchEvent(
      new CustomEvent('add-to-cart', {
        detail: bike.id,
        bubbles: true,
        composed: true,
      })
    );
    console.log(`Dispatched add-to-cart event for bike id: ${bike.id}`);
  };

  const editBike = (bike: Bike) => {
    console.log('Edit bike:', bike);
    // TODO: navigate to bike edit form
  };

  const deleteBike = (bike: Bike) => {
    console.log('Delete bike:', bike);
    // TODO: call backend to delete
  };

  return (
    <div>
  <input
    type="text"
    placeholder="Search bikes..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ marginBottom: '20px', padding: '5px', width: '300px' }}
  />

  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
    {filteredBikes.map((bike) => (
      <div
        key={bike.id}
        className="bike__box"
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '5px',
          width: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h4>Model: {bike.model}</h4>
        {bike.imageSource && <img src={bike.imageSource} height={70} width={70} alt={bike.model} />}
        <div>Stock: {bike.stock}</div>
        <div>Details: {bike.details}</div>
        <div>Electric: {bike.electric ? 'Yes' : 'No'}</div>
        <div>Price: {bike.price}€</div>

        {role === 'BASIC' && (
          <button onClick={() => addToCart(bike)} disabled={bike.stock <= 0} style={{ marginTop: '10px' }}>
            Add to cart
          </button>
        )}

        {role === 'MANAGER' && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={() => editBike(bike)}>Edit</button>
            <button onClick={() => deleteBike(bike)}>Delete</button>
          </div>
        )}
      </div>
    ))}
  </div>
    </div>
  );
};

export default BikeList;
