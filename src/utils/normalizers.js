export const normalizePg = (pg = {}) => ({
  ...pg,
  id: pg._id || pg.id,
  roomType: pg.roomtype,
  totalRooms: pg.totalrooms,
  available: Number(pg.available ?? 0),
  rent: Number(pg.rent ?? 0),
});

export const normalizeBooking = (booking = {}) => ({
  ...booking,
  id: booking._id || booking.id,
  moveInDate: booking.moveindate || booking.moveInDate,
  paymentStatus: booking.paymentstatus || booking.paymentStatus,
});

export const normalizeMatch = (match = {}) => ({
  ...match,
  compatibility: match.compability ?? match.compatibility ?? 0,
});
