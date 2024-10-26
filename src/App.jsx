import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [pincode, setPincode] = useState('');
  const [postData, setPostData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterTerm, setFilterTerm] = useState('');

  const handleFetchData = async () => {
    if (pincode.length !== 6 || isNaN(pincode)) {
      setError('Please enter a valid 6-digit postal code.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if (data[0].Status === 'Error') {
        setError('No data found for the given pincode.');
      } else {
        setPostData(data[0].PostOffice || []);
        setFilteredData(data[0].PostOffice || []);
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = (e) => {
    const term = e.target.value;
    setFilterTerm(term);
    const filtered = postData.filter((postOffice) =>
      postOffice.Name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(filtered);
    if (filtered.length === 0) setError("Couldn't find the postal data you’re looking for…");
    else setError('');
  };

  return (
    <div className="App">
      <h1> Enter Pincode</h1>
      <div className="lookup-container">
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Pincode"
        />
      </div>
      <button onClick={handleFetchData}>Lookup</button>
      {isLoading ? (
        <div className="loader"></div> // Custom CSS loader
      ) : (
        <div>
          {error && <p className="error">{error}</p>}
          {filteredData.length > 0 && (
            <div>
              <input className='filter-input'
                type="text"
                value={filterTerm}
                onChange={handleFilter}
                placeholder="🔍 Filter"
              />
              <div className="results">
                {filteredData.map((office) => (
                  <div key={office.Name} className="result-item">
                    <p><strong>Post Office Name:</strong> {office.Name}</p>
                    <p><strong>Pincode:</strong> {office.Pincode}</p>
                    <p><strong>District:</strong> {office.District}</p>
                    <p><strong>State:</strong> {office.State}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
