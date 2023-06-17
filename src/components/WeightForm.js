import React, { useState, useEffect } from 'react';
import './WeightForm.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const WeightForm = () => {
  const [weightData, setWeightData] = useState(() => {
    const storedData = localStorage.getItem('weightData');
    return storedData
      ? JSON.parse(storedData)
      : { date: '', weight: '', height: '', name: '' };
  });

  const [weightEntries, setWeightEntries] = useState(() => {
    const storedEntries = localStorage.getItem('weightEntries');
    return storedEntries ? JSON.parse(storedEntries) : [];
  });

  const [weightUnit, setWeightUnit] = useState('kg');

  useEffect(() => {
    localStorage.setItem('weightData', JSON.stringify(weightData));
  }, [weightData]);

  useEffect(() => {
    localStorage.setItem('weightEntries', JSON.stringify(weightEntries));
  }, [weightEntries]);

  const handleChange = event => {
    const { name, value } = event.target;
    setWeightData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    const newEntry = { ...weightData };
    newEntry.category = calculateWeightCategory(
      newEntry.weight,
      newEntry.height
    );
    newEntry.idealWeight = calculateIdealWeight(newEntry.height);
    setWeightEntries(prevEntries => [...prevEntries, newEntry]);
    setWeightData({ date: '', weight: '', height: '', name: '' });
  };

  const calculateWeightCategory = (weight, height) => {
    const bmi = weight / ((height / 100) * (height / 100));
    if (bmi < 18.5) {
      return 'Underweight';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return 'Normal';
    } else {
      return 'Overweight';
    }
  };

  const calculateIdealWeight = height => {
    const idealBmi = 22.5; 
    const idealWeight = (idealBmi * (height * height)) / 10000;
    return idealWeight.toFixed(2); 
  };

  const getRowClassName = category => {
    if (category === 'Underweight') {
      return 'underweight';
    } else if (category === 'Normal') {
      return 'normal';
    } else {
      return 'overweight';
    }
  };

  const minWeight = Math.min(...weightEntries.map(entry => entry.weight));
  const maxWeight = Math.max(...weightEntries.map(entry => entry.weight));

  const handleWeightUnitChange = () => {
    setWeightUnit(weightUnit === 'kg' ? 'lbs' : 'kg');
  };

  return (
    <div className="weight-form-container">
      <form onSubmit={handleSubmit}>
        <h3>Enter Weight Data</h3>
        <div className="form-row">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={weightData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={weightData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="weight">Weight:</label>
          <input
            type="text"
            id="weight"
            name="weight"
            value={weightData.weight}
            onChange={handleChange}
            required
          />
          <span className="unit-toggle" onClick={handleWeightUnitChange}>
            {weightUnit === 'kg' ? 'kg' : 'lbs'}
          </span>
        </div>
        <div className="form-row">
          <label htmlFor="height">Height (cm):</label>
          <input
            type="text"
            id="height"
            name="height"
            value={weightData.height}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <button type="submit">Submit</button>
        </div>
      </form>
      <div className="weight-entries">
        <h3>Weight Entries</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Weight</th>
              <th>Height</th>
              <th>Ideal Weight</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {weightEntries.map((entry, index) => (
              <tr key={index} className={getRowClassName(entry.category)}>
                <td>{entry.name}</td>
                <td>{entry.date}</td>
                <td>
                  {entry.weight} {weightUnit}
                </td>
                <td>{entry.height}</td>
                <td>{entry.idealWeight}</td>
                <td>{entry.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="graph-container">
        <h3>Weight Progress</h3>
        <LineChart width={700} height={400} data={weightEntries}>
          <XAxis dataKey="date" />
          <YAxis domain={[minWeight, maxWeight]} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="weight" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>
  );
};

export default WeightForm;
