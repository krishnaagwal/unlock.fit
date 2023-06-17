import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [weightEntries, setWeightEntries] = useState([]);

  useEffect(() => {
    const storedEntries = localStorage.getItem('weightEntries');
    if (storedEntries) {
      setWeightEntries(JSON.parse(storedEntries));
    }
  }, []);

  const countCustomersByColor = () => {
    let greenCount = 0;
    let orangeCount = 0;
    let redCount = 0;

    weightEntries.forEach(entry => {
      if (entry.category === 'Normal') {
        greenCount++;
      } else if (entry.category === 'Overweight') {
        orangeCount++;
      } else {
        redCount++;
      }
    });

    return { greenCount, orangeCount, redCount };
  };

  const { greenCount, orangeCount, redCount } = countCustomersByColor();

  const [selectedColor, setSelectedColor] = useState(null);

  const handleColorClick = color => {
    setSelectedColor(color);
  };

  const getCustomersByColor = color => {
    return weightEntries.filter(entry => entry.category === color);
  };

  const calculateIdealWeight = (height, category) => {
    const heightInMeters = height / 100;
    let idealWeight;

    switch (category) {
      case 'Underweight':
        idealWeight = 18.5 * heightInMeters * heightInMeters;
        break;
      case 'Normal':
        idealWeight = 24.9 * heightInMeters * heightInMeters;
        break;
      case 'Overweight':
        idealWeight = 24.9 * heightInMeters * heightInMeters;
        break;
      default:
        idealWeight = 0;
    }

    return idealWeight.toFixed(2);
  };

  const calculateAdvice = category => {
    let advice = '';

    switch (category) {
      case 'Underweight':
        advice = 'You should focus on gaining weight in a healthy way.';
        break;
      case 'Normal':
        advice =
          'Maintain a healthy lifestyle with balanced diet and regular exercise.';
        break;
      case 'Overweight':
        advice =
          'It is recommended to lose weight gradually through a combination of diet and exercise.';
        break;
      default:
        advice = '';
    }

    return advice;
  };

  const selectedCustomers = selectedColor
    ? getCustomersByColor(selectedColor)
    : [];

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div>
        <h3>Customer Counts by Color:</h3>
        <ul className="customer-colors">
          <li
            className={`customer-color green ${
              selectedColor === 'Normal' ? 'selected' : ''
            }`}
            onClick={() => handleColorClick('Normal')}
          >
            Green: {greenCount}
          </li>
          <li
            className={`customer-color orange ${
              selectedColor === 'Overweight' ? 'selected' : ''
            }`}
            onClick={() => handleColorClick('Overweight')}
          >
            Orange: {orangeCount}
          </li>
          <li
            className={`customer-color red ${
              selectedColor === 'Underweight' ? 'selected' : ''
            }`}
            onClick={() => handleColorClick('Underweight')}
          >
            Red: {redCount}
          </li>
        </ul>
      </div>
      <div className="customer-details">
        <h3>Customer Details:</h3>
        {selectedCustomers.length > 0 ? (
          selectedCustomers.map(customer => (
            <div key={customer.name} className="customer-card">
              <p>Name: {customer.name}</p>
              <p>Current Weight: {customer.weight} kg</p>
              <p>
                Ideal Weight:{' '}
                {calculateIdealWeight(customer.height, customer.category)} kg
              </p>
              <p>Advice: {calculateAdvice(customer.category)}</p>
            </div>
          ))
        ) : (
          <p>No customers found</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
