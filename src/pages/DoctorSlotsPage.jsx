import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Lock,
  CalendarCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { appointmentApi } from '../api/appointmentApi';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

const DoctorSlotsPage = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('09:30');
  const [duration, setDuration] = useState(30);
  const [fee, setFee] = useState('');
  const [creating, setCreating] = useState(false);

  // Deletion Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingSlotId, setDeletingSlotId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Filter state
  const [filterDate, setFilterDate] = useState('');

  const { user } = useAuth();

  const fetchSlots = () => {
    setLoading(true);
    appointmentApi.getSlots()
      .then((res) => {
        setSlots(res.data);
      })
      .catch((err) => {
        setError('Failed to load slots.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);

    fetchSlots();
  }, []);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!date || !startTime || !endTime) {
      setError('Please provide date, start time, and end time.');
      return;
    }

    if (startTime >= endTime) {
      setError('End time must be after start time.');
      return;
    }

    try {
      setCreating(true);
      await appointmentApi.createSlot({
        date,
        start_time: startTime,
        end_time: endTime,
        duration_minutes: duration,
        consultation_fee: fee ? parseFloat(fee) : undefined
      });
      setSuccessMsg('Appointment slot created successfully!');
      fetchSlots();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.date?.[0] || 'Failed to create slot.');
    } finally {
      setCreating(false);
    }
  };

  const handleQuickAddDay = async () => {
    if (!date) {
      setError('Please choose a date first.');
      return;
    }
    setError('');
    setSuccessMsg('');

    const defaultHours = [
      ['09:00', '09:30'],
      ['09:30', '10:00'],
      ['10:00', '10:30'],
      ['10:30', '11:00'],
      ['11:00', '11:30'],
      ['14:00', '14:30'],
      ['14:30', '15:00'],
      ['15:00', '15:30'],
    ];

    setCreating(true);
    let createdCount = 0;
    try {
      for (const [st, et] of defaultHours) {
        try {
          await appointmentApi.createSlot({
            date,
            start_time: st,
            end_time: et,
            duration_minutes: 30,
            consultation_fee: fee ? parseFloat(fee) : undefined
          });
          createdCount++;
        } catch (e) {
          // Skip overlapping
        }
      }
      setSuccessMsg(`Generated ${createdCount} standard clinic slots for ${date}!`);
      fetchSlots();
    } catch (e) {
      setError('Encountered an issue generating bulk slots.');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenDelete = (slotId) => {
    setDeletingSlotId(slotId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSlotId) return;
    try {
      setDeleteLoading(true);
      await appointmentApi.deleteSlot(deletingSlotId);
      setDeleteModalOpen(false);
      setDeletingSlotId(null);
      fetchSlots();
    } catch (err) {
      alert(err.response?.data?.error || 'Unable to delete slot.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredSlots = filterDate
    ? slots.filter(s => s.date === filterDate)
    : slots;

  return (
    <div className="page-container">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          Appointment Slot Management
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Configure your clinical availability, prevent overlapping hours, and manage patient booking capacity
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {/* Create Slot Form */}
        <div>
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Plus size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add New Appointment Slot</h3>
            </div>

            <form onSubmit={handleCreateSlot}>
              <div className="form-group">
                <label className="form-label">Consultation Date *</label>
                <input
                  type="date"
                  className="form-control"
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Time *</label>
                  <input
                    type="time"
                    className="form-control"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Time *</label>
                  <input
                    type="time"
                    className="form-control"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    className="form-control"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Custom Fee (₹ Optional)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    placeholder="Defaults to profile fee"
                    className="form-control"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={creating}
                >
                  {creating ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : <Plus size={16} />}
                  Save Single Slot
                </button>

                <button
                  type="button"
                  onClick={handleQuickAddDay}
                  className="btn btn-secondary btn-full"
                  disabled={creating}
                >
                  <Sparkles size={16} /> Auto-Generate Full Day Shifts (9 AM - 4 PM)
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Existing Slots Schedule View */}
        <div>
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Active Slots ({filteredSlots.length})</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                  Total {slots.length} slots in your system
                </span>
              </div>

              {/* Filter by date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="date"
                  className="form-control"
                  style={{ width: 'auto', padding: '6px 10px', fontSize: '0.85rem' }}
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
                {filterDate && (
                  <button onClick={() => setFilterDate('')} className="btn btn-outline btn-sm">
                    Clear
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <div className="spinner" />
              </div>
            ) : filteredSlots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                <Calendar size={32} style={{ margin: '0 auto 8px', color: 'var(--text-light)' }} />
                <p>No slots found for this date. Create slots using the form on the left.</p>
              </div>
            ) : (
              <div style={{ maxHeight: '520px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
                {filteredSlots.map((slot) => {
                  return (
                    <div
                      key={slot.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: slot.is_booked ? '#f8fafc' : '#ffffff',
                        border: slot.is_booked ? '1.5px solid #cbd5e1' : '1.5px solid var(--primary-border)',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                            {slot.start_time?.slice(0, 5)} - {slot.end_time?.slice(0, 5)}
                          </span>
                          {slot.is_booked ? (
                            <span className="badge badge-accepted" style={{ fontSize: '0.68rem' }}>Booked</span>
                          ) : (
                            <span className="badge badge-completed" style={{ fontSize: '0.68rem' }}>Available</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {slot.date} • ₹{parseFloat(slot.consultation_fee).toFixed(0)} • {slot.duration_minutes}m
                        </div>
                      </div>

                      <div>
                        {slot.is_booked ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-light)' }} title="Booked slots cannot be deleted directly">
                            <Lock size={14} /> Reserved
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenDelete(slot.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--danger)',
                              cursor: 'pointer',
                              padding: '6px',
                              borderRadius: '6px'
                            }}
                            title="Delete this open slot"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Appointment Slot"
        message="Are you sure you want to remove this available appointment slot from your schedule?"
        confirmText="Yes, Delete Slot"
        isDanger={true}
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default DoctorSlotsPage;
