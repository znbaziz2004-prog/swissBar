import api, { unwrap } from './api';

/* Auth */
export const loginRequest = async body => unwrap(await api.post('/auth/login', body));
export const getMe = async () => unwrap(await api.get('/auth/me'));

/* Dashboard */
export const getDashboard = async () => unwrap(await api.get('/dashboard/stats'));

/* Appointments */
export const getAppointments = async (params = {}) => (unwrap(await api.get('/appointments', { params })).appointments || []);
export const getCalendar = async (date, view = 'week') => {
  const response = await api.get('/appointments/calendar', {
    params: { date, view },
  });

  console.log('CALENDAR API RESPONSE:', response.data);

  const result = unwrap(response);
  console.log('CALENDAR APPOINTMENTS:', result?.appointments);

  return result?.appointments || [];
};
export const updateAppointmentStatus = (id, status) => api.patch(`/appointments/${id}/status`, { status });

/* Customers */
export const getCustomers = async search => (unwrap(await api.get('/customers', { params: search ? { search } : {} })).customers || []);

/* Services (owner) */
export const getServices = async () => (unwrap(await api.get('/services')).services || []);
export const createService = body => api.post('/services', body);
export const updateServiceStatus = (id, status) => api.patch(`/services/${id}/status`, { status });
export const deleteService = id => api.delete(`/services/${id}`);

/* Staff */

export const getStaff = async () =>
  (unwrap(await api.get('/staff')).staff || []);

export const createStaff = body =>
  api.post('/staff', body);

export const updateStaff = (id, body) =>
  api.patch(`/staff/${id}`, body);

export const updateStaffStatus = (id, status) =>
  api.patch(`/staff/${id}/status`, { status });

/* Shop + branches */


export const getShopProfile = async () =>
  unwrap(await api.get('/shops/profile')).shop;

export const updateShopProfile = (body) =>
  api.patch('/shops/profile', body);

export const getBranches = async () =>
  (unwrap(await api.get('/branches')).branches || []);

export const createBranch = (body) =>
  api.post('/branches', body);

export const updateBranch = (id, body) =>
  api.put(`/branches/${id}`, body);

export const updateBranchStatus = (id, status) =>
  api.patch(`/branches/${id}/status`, { status });

export const deleteBranch = (id) =>
  api.delete(`/branches/${id}`);

/* Working hours (owner) */
export const getWorkingHours = async shopId => (unwrap(await api.get('/working-hours', { params: { shopId } })).workingHours || []);
export const createWorkingHour = body => api.post('/working-hours', body);
export const updateWorkingHour = (id, body) => api.put(`/working-hours/${id}`, body);
export const deleteWorkingHour = id => api.delete(`/working-hours/${id}`);

/* Payments, reviews, notifications */
export const getPayments = async () => (unwrap(await api.get('/payments')).payments || []);
export const getReviews = async () => (unwrap(await api.get('/reviews')).reviews || []);
export const getReviewSummary = async () => unwrap(await api.get('/reviews/summary')).summary;
export const updateReviewStatus = (id, status) => api.patch(`/reviews/${id}/status`, { status });
export const getNotifications = async () => (unwrap(await api.get('/notifications')).notifications || []);
/* Swiss Barber Platform Testimonials */

// Get logged-in owner's testimonial and approval status
export const getMyTestimonial = async () =>
  unwrap(await api.get("/barber-testimonials/my"));

// Submit a testimonial for Swiss Barber
export const submitTestimonial = async (testimonial) =>
  unwrap(
    await api.post("/barber-testimonials", { testimonial })
  );

  export const exchangeHandoffRequest = async (code) =>
  unwrap(await api.post('/auth/handoff/exchange', { code }));