
import { addMinutes, differenceInSeconds } from 'date-fns';
import { BOOKING_STATES } from '../utils/constants';

let categories = [
  { id: 'cat1', name: 'Electrician' },
  { id: 'cat2', name: 'Plumber' },
  { id: 'cat3', name: 'Carpenter' },
  { id: 'cat4', name: 'Painter' }
];

let users = [
  // Single Admin per SRS
  { id:'u_admin', name: 'Platform Admin', email:'admin@ekarigar.pk', role:'admin', approved:true, verified:true },
  { id:'u_client', name:'Ayesha', email:'ayesha@client.pk', role:'client', approved:true, verified:false },
  { id:'u_vendor1', name:'Kashif Electric Works', email:'kashif@vendor.pk', role:'vendor', approved:true, verified:true, orgType:'Company' },
  { id:'u_vendor2', name:'Hassan Plumber', email:'hassan@vendor.pk', role:'vendor', approved:false, verified:false, orgType:'Individual' }
];

let services = [
  { id:'s1', vendorId:'u_vendor1', category:'Electrician', title:'Fan Installation', price:1200, images:[], verified:true, rating:4.6 },
  { id:'s2', vendorId:'u_vendor1', category:'Electrician', title:'Wiring Fix', price:2500, images:[], verified:true, rating:4.4 },
  { id:'s3', vendorId:'u_vendor2', category:'Plumber', title:'Leak Repair', price:1800, images:[], verified:false, rating:4.1 }
];

let vendors = users.filter(u => u.role === 'vendor').map(v => ({
  id:v.id, name:v.name, verified:v.verified, rating:4.5, categories:['Electrician','Plumber'],
  portfolio:['/placeholder1.png','/placeholder2.png'],
  location:'Haripur', // single-city scope per SRS
}));

let bookings = [
  // Created now; cancellation allowed for 5 minutes by client
  { id:'b1', clientId:'u_client', vendorId:'u_vendor1', serviceId:'s1', state:BOOKING_STATES.CREATED, createdAt: new Date().toISOString(), address:'Sector 1', cashOnly:true }
];

let reviews = [];

export async function login(email, password) {
  const user = users.find(u => u.email === email);
  if (!user) throw new Error('Invalid credentials');
  return structuredClone(user);
}

export async function register({ role, name, email, orgType }) {
  if (users.some(u => u.email === email)) throw new Error('Email exists');
  const nu = { id: `u_${Date.now()}`, name, email, role, approved: role !== 'vendor', verified:false, orgType };
  users.push(nu);
  if (role === 'vendor') vendors.push({ id:nu.id, name:nu.name, verified:false, rating:0, categories:[], portfolio:[], location:'Haripur' });
  return structuredClone(nu);
}

export async function getCategories() { return structuredClone(categories); }
export async function getVendors() { return structuredClone(vendors); }
export async function getServices() { return structuredClone(services); }
export async function getBookings() { return structuredClone(bookings); }
export async function getReviews() { return structuredClone(reviews); }

export async function searchServices({ q, price, rating, verifiedOnly, category }) {
  let list = services;
  if (q) list = list.filter(s => s.title.toLowerCase().includes(q.toLowerCase()));
  if (category) list = list.filter(s => s.category === category);
  if (verifiedOnly) list = list.filter(s => s.verified);
  if (rating) list = list.filter(s => (s.rating ?? 0) >= rating);
  if (price?.min != null) list = list.filter(s => s.price >= price.min);
  if (price?.max != null) list = list.filter(s => s.price <= price.max);
  return structuredClone(list);
}

export async function createBooking({ clientId, vendorId, serviceId, address }) {
  const now = new Date();
  const b = {
    id: `b_${Date.now()}`,
    clientId, vendorId, serviceId,
    state: BOOKING_STATES.PENDING, // Created -> Pending Vendor Approval per SRS
    createdAt: now.toISOString(),
    address, cashOnly: true
  };
  bookings.unshift(b);
  return structuredClone(b);
}

export async function updateBookingState({ bookingId, state }) {
  const b = bookings.find(x => x.id === bookingId);
  if (!b) throw new Error('Not found');
  b.state = state;
  return structuredClone(b);
}

// 5-minute client cancellation rule
export function canClientCancel(booking) {
  const sec = differenceInSeconds(new Date(), new Date(booking.createdAt));
  return sec <= 5 * 60 && [BOOKING_STATES.CREATED, BOOKING_STATES.PENDING].includes(booking.state);
}

export async function leaveReview({ bookingId, clientId, rating, comment }) {
  const b = bookings.find(x => x.id === bookingId);
  if (!b || b.state !== BOOKING_STATES.COMPLETED) throw new Error('Review allowed only after completion');
  const r = { id:`r_${Date.now()}`, bookingId, clientId, rating, comment, createdAt: new Date().toISOString() };
  reviews.push(r);
  return structuredClone(r);
}

// Admin actions
export async function approveVendor(vendorId, verified=false) {
  const u = users.find(x => x.id === vendorId);
  if (!u) throw new Error('Vendor not found');
  u.approved = true; u.verified = verified || u.verified;
  const v = vendors.find(x => x.id === vendorId);
  if (v) v.verified = u.verified;
  return structuredClone({ ...u });
}
``
