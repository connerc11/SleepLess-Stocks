import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const recommended = ['AAPL', 'TSLA', 'AMZN', 'SOFI', 'UPST', 'HOOD', 'HIMS', 'COF'];

const containerStyle = {
  maxWidth: '950px',
  margin: '2.5rem auto',
  padding: '2.5rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
  borderRadius: '18px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: '#fff',
};
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
};
const titleStyle = {
  color: '#333',
  fontSize: '2rem',
  fontWeight: 'bold',
};
const sectionTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: 'bold',
  margin: '2rem 0 0.5rem 0',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};
const emptyStateStyle = {
  color: '#bbb',
  textAlign: 'center',
  margin: '1.5rem 0',
  fontSize: '1.1rem',
};
const cardStyle = {
  background: '#f8f8f8',
  borderRadius: '10px',
  padding: '1.2rem',
  textAlign: 'center',
  marginBottom: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.2s',
};
const cardStyleSearch = {
  ...cardStyle,
  background: '#fffbe6',
  border: '1px solid #ffe58f',
};
const btnDanger = {
  marginLeft: '1rem',
  background: '#ff4d4f',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  padding: '0.5rem 1.1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background 0.2s',
};
const btnDangerHover = {
  background: '#d9363e',
};
const backBtnStyle = {
  padding: '0.6rem 1.2rem',
  border: 'none',
  borderRadius: '8px',
  background: 'linear-gradient(90deg, #1890ff 0%, #70c1ff 100%)',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1rem',
  boxShadow: '0 2px 8px rgba(24,144,255,0.10)',
  cursor: 'pointer',
  transition: 'background 0.2s, box-shadow 0.2s',
  outline: 'none',
  marginLeft: 'auto',
};

const StockWatchlist = () => {
  const [query, setQuery] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [searchWatchlist, setSearchWatchlist] = useState([]); // new section
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIdx, setModalIdx] = useState(null);
  const [modalValue, setModalValue] = useState('');
  const [modalForSearch, setModalForSearch] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();

  // Load watchlist and searchWatchlist from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/profile');
        setProfile(res.data.profile || {});
        setWatchlist(res.data.profile?.stocks || []);
        setSearchWatchlist(res.data.profile?.searchWatchlist || []);
      } catch {
        // No profile or not logged in
      }
    })();
  }, []);

  // Save watchlist to backend
  const saveWatchlist = async (newList) => {
    try {
      await api.post('/profile', { profile: profile || {}, stocks: newList, searchWatchlist });
    } catch (err) {
      setError('Failed to save watchlist');
    }
  };

  // Save searchWatchlist to backend
  const saveSearchWatchlist = async (newList) => {
    try {
      await api.post('/profile', { profile: profile || {}, stocks: watchlist, searchWatchlist: newList });
    } catch (err) {
      setError('Failed to save search watchlist');
    }
  };

  // Add to searchWatchlist (new section)
  const handleAdd = (ticker) => {
    const exists = searchWatchlist.some(s => s.ticker === ticker.toUpperCase());
    if (exists) {
      setError(`Ticker ${ticker.toUpperCase()} is already on your watchlist!`);
      setTimeout(() => setError(''), 2500);
      return;
    }
    const newStock = { ticker: ticker.toUpperCase() };
    const updated = [newStock, ...searchWatchlist];
    setSearchWatchlist(updated);
    setQuery('');
    saveSearchWatchlist(updated);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    handleAdd(query);
  };

  // Remove from main watchlist
  const handleRemove = (ticker) => {
    const updated = watchlist.filter(s => s.ticker !== ticker);
    setWatchlist(updated);
    saveWatchlist(updated);
  };

  // Remove from searchWatchlist
  const handleRemoveSearch = (ticker) => {
    const updated = searchWatchlist.filter(s => s.ticker !== ticker);
    setSearchWatchlist(updated);
    saveSearchWatchlist(updated);
  };

  // Open modal for price target
  const openPriceTargetModal = (idx) => {
    setModalIdx(idx);
    setModalValue('');
    setModalOpen(true);
    setModalForSearch(false);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 100);
  };

  // Open modal for price target for searchWatchlist
  const openSearchPriceTargetModal = (idx) => {
    setModalIdx(idx);
    setModalValue('');
    setModalOpen(true);
    setModalForSearch(true);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 100);
  };

  // Save price target from modal
  const savePriceTarget = () => {
    if (!modalValue || isNaN(modalValue) || Number(modalValue) <= 0) return;
    if (modalForSearch) {
      const updated = [...searchWatchlist];
      updated[modalIdx] = { ...updated[modalIdx], priceTarget: parseFloat(modalValue).toFixed(2) };
      setSearchWatchlist(updated);
      saveSearchWatchlist(updated);
    } else {
      const updated = [...watchlist];
      updated[modalIdx] = { ...updated[modalIdx], priceTarget: parseFloat(modalValue).toFixed(2) };
      setWatchlist(updated);
      saveWatchlist(updated);
    }
    setModalOpen(false);
    setModalIdx(null);
    setModalValue('');
    setModalForSearch(false);
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          {profile && profile.name ? `${profile.name}'s Watchlist` : '📈 Stock Watchlist'}
        </h2>
        <button
          onClick={() => navigate('/blog')}
          style={backBtnStyle}
          className="btn-outline"
          onMouseOver={e => e.currentTarget.style.background = '#40a9ff'}
          onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1890ff 0%, #70c1ff 100%)'}
        >
          ← Back to Blog
        </button>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '0.5rem', color: '#555' }}>Recommended tickers:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {recommended.map(ticker => (
            <button
              key={ticker}
              className="btn-sm"
              style={{ background: '#f1f5ff', color: '#1890ff', border: '1px solid #1890ff' }}
              onClick={() => handleAdd(ticker)}
            >
              {ticker}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Add stock by ticker (e.g. MSFT)"
            style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
            required
          />
          <button type="submit" className="btn-outline" style={{ fontWeight: 'bold' }}>Add</button>
        </form>
      </div>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <div>
        <div style={sectionTitleStyle}><span role="img" aria-label="star">⭐</span> Main Watchlist</div>
        {watchlist.length === 0 && null}
        {watchlist.map((stock, idx) => (
          <div key={idx} style={cardStyle} className="watchlist-card">
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1890ff' }}>{stock.ticker}</div>
              {stock.priceTarget ? (
                <div style={{ fontSize: '1rem', marginTop: '0.3rem' }}>Price Target: <span style={{ color: '#27ae60', fontWeight: 'bold' }}>${stock.priceTarget}</span></div>
              ) : (
                <button
                  onClick={() => openPriceTargetModal(idx)}
                  style={{
                    marginTop: '0.3rem',
                    background: '#fff',
                    color: '#27ae60',
                    border: '1px solid #27ae60',
                    borderRadius: '6px',
                    padding: '0.3rem 0.9rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  + Add Price Target
                </button>
              )}
            </div>
            <button onClick={() => handleRemove(stock.ticker)} className="btn-danger" style={btnDanger}>Remove</button>
          </div>
        ))}
      </div>
      {/* Modal for price target */}
      {modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', borderRadius: 12, padding: '2rem 2.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            minWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', position: 'relative'
          }}>
            <div style={{ fontWeight: 600, fontSize: '1.15rem', color: '#1890ff' }}>Set Price Target for <span style={{ color: '#222' }}>{watchlist[modalIdx]?.ticker}</span></div>
            <input
              ref={inputRef}
              type="number"
              min="0"
              step="0.01"
              value={modalValue}
              onChange={e => setModalValue(e.target.value)}
              placeholder="Enter price target (e.g. 150.00)"
              style={{
                padding: '0.7rem 1.2rem', borderRadius: 8, border: '1px solid #1890ff', fontSize: '1.1rem', width: '100%',
                outline: modalValue && (isNaN(modalValue) || Number(modalValue) <= 0) ? '2px solid #ff4d4f' : 'none'
              }}
              onKeyDown={e => { if (e.key === 'Enter') savePriceTarget(); }}
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                onClick={savePriceTarget}
                style={{ background: '#1890ff', color: '#fff', border: 'none', borderRadius: 6, padding: '0.6rem 1.5rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', opacity: (!modalValue || isNaN(modalValue) || Number(modalValue) <= 0) ? 0.6 : 1 }}
                disabled={!modalValue || isNaN(modalValue) || Number(modalValue) <= 0}
              >Save</button>
              <button
                onClick={() => { setModalOpen(false); setModalIdx(null); setModalValue(''); }}
                style={{ background: '#fff', color: '#888', border: '1px solid #bbb', borderRadius: 6, padding: '0.6rem 1.5rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div>
        {/* Only show empty state if there are no searchWatchlist stocks */}
        {searchWatchlist.length === 0 && null}
        {searchWatchlist.map((stock, idx) => (
          <div key={idx} style={cardStyleSearch} className="searchwatchlist-card">
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#faad14' }}>{stock.ticker}</div>
              {stock.priceTarget ? (
                <div style={{ fontSize: '1rem', marginTop: '0.3rem' }}>Price Target: <span style={{ color: '#27ae60', fontWeight: 'bold' }}>${stock.priceTarget}</span></div>
              ) : (
                <button
                  onClick={() => openSearchPriceTargetModal(idx)}
                  style={{
                    marginTop: '0.3rem',
                    background: '#fff',
                    color: '#27ae60',
                    border: '1px solid #27ae60',
                    borderRadius: '6px',
                    padding: '0.3rem 0.9rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  + Add Price Target
                </button>
              )}
            </div>
            <button onClick={() => handleRemoveSearch(stock.ticker)} className="btn-danger" style={btnDanger}>Remove</button>
          </div>
        ))}
      </div>
      {/* Modal for price target for searchWatchlist */}
      {modalOpen && modalIdx !== null && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', borderRadius: 12, padding: '2rem 2.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            minWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', position: 'relative'
          }}>
            <div style={{ fontWeight: 600, fontSize: '1.15rem', color: '#1890ff' }}>Set Price Target for <span style={{ color: '#222' }}>{modalForSearch ? searchWatchlist[modalIdx]?.ticker : watchlist[modalIdx]?.ticker}</span></div>
            <input
              ref={inputRef}
              type="number"
              min="0"
              step="0.01"
              value={modalValue}
              onChange={e => setModalValue(e.target.value)}
              placeholder="Enter price target (e.g. 150.00)"
              style={{
                padding: '0.7rem 1.2rem', borderRadius: 8, border: '1px solid #1890ff', fontSize: '1.1rem', width: '100%',
                outline: modalValue && (isNaN(modalValue) || Number(modalValue) <= 0) ? '2px solid #ff4d4f' : 'none'
              }}
              onKeyDown={e => { if (e.key === 'Enter') savePriceTarget(); }}
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                onClick={savePriceTarget}
                style={{ background: '#1890ff', color: '#fff', border: 'none', borderRadius: 6, padding: '0.6rem 1.5rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', opacity: (!modalValue || isNaN(modalValue) || Number(modalValue) <= 0) ? 0.6 : 1 }}
                disabled={!modalValue || isNaN(modalValue) || Number(modalValue) <= 0}
              >Save</button>
              <button
                onClick={() => { setModalOpen(false); setModalIdx(null); setModalValue(''); setModalForSearch(false); }}
                style={{ background: '#fff', color: '#888', border: '1px solid #bbb', borderRadius: 6, padding: '0.6rem 1.5rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
      <footer style={{
        width: '100%',
        textAlign: 'center',
        padding: '1.2rem 0 0.7rem 0',
        color: '#888',
        fontSize: '1.05rem',
        fontFamily: 'Poppins, sans-serif',
        letterSpacing: '0.01em',
        background: 'none',
        marginTop: '2rem',
        opacity: 0.85,
      }}>
        Made by Conner Cochrane!  🙂
      </footer>
    </div>
  );
};

export default StockWatchlist;