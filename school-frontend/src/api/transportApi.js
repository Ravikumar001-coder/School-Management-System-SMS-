import apiClient from './axios';

// Routes
export const getRoutes = async (branchId = 1) => {
  const { data } = await apiClient.get(`/transport/routes/branch/${branchId}`);
  return data;
};

export const createRoute = async (branchId = 1, routeData) => {
  const { data } = await apiClient.post(`/transport/routes/branch/${branchId}`, routeData);
  return data;
};

export const updateRoute = async (id, routeData) => {
  const { data } = await apiClient.put(`/transport/routes/${id}`, routeData);
  return data;
};

export const deleteRoute = async (id) => {
  const { data } = await apiClient.delete(`/transport/routes/${id}/archive`);
  return data;
};

// Vehicles
export const getFleetStats = async (branchId = 1) => {
  const { data } = await apiClient.get(`/transport/vehicles/branch/${branchId}/fleet-stats`);
  return data;
};

export const getVehicles = async (branchId = 1) => {
  const { data } = await apiClient.get(`/transport/vehicles/branch/${branchId}`);
  return data;
};

export const createVehicle = async (vehicleData) => {
  const { data } = await apiClient.post(`/transport/vehicles/branch/1`, vehicleData);
  return data;
};

export const updateVehicle = async (id, vehicleData) => {
  const { data } = await apiClient.put(`/transport/vehicles/${id}`, vehicleData);
  return data;
};

// Drivers
export const getDrivers = async (branchId = 1) => {
  const { data } = await apiClient.get(`/transport/drivers/branch/${branchId}`);
  return data;
};

export const createDriver = async (branchId = 1, driverData) => {
  const { data } = await apiClient.post(`/transport/drivers/branch/${branchId}`, driverData);
  return data;
};

export const updateDriver = async (id, driverData) => {
  const { data } = await apiClient.put(`/transport/drivers/${id}`, driverData);
  return data;
};

// Stops
export const getRouteStops = async (routeId) => {
  const { data } = await apiClient.get(`/transport/routes/${routeId}/stops`);
  return data;
};

export const createRouteStop = async (routeId, stopData) => {
  const { data } = await apiClient.post(`/transport/routes/${routeId}/stops`, stopData);
  return data;
};

export const updateRouteStop = async (stopId, stopData) => {
  const { data } = await apiClient.put(`/transport/routes/stops/${stopId}`, stopData);
  return data;
};

export const deleteRouteStop = async (stopId) => {
  const { data } = await apiClient.delete(`/transport/routes/stops/${stopId}`);
  return data;
};

// Assignments
export const assignStudentToRoute = async (assignmentData) => {
  const { data } = await apiClient.post(`/transport/routes/assignments`, assignmentData);
  return data;
};

// GPS & Live Tracking
export const getLatestLocation = async (vehicleId) => {
  const { data } = await apiClient.get(`/transport/gps/vehicles/${vehicleId}/location`);
  return data;
};

export const getGpsHistory = async (vehicleId, start, end) => {
  const { data } = await apiClient.get(`/transport/gps/vehicles/${vehicleId}/history`, {
    params: { start, end }
  });
  return data;
};

export const getEvents = async (vehicleId) => {
  const { data } = await apiClient.get(`/transport/gps/vehicles/${vehicleId}/events`);
  return data;
};

export const acknowledgeEvent = async (eventId) => {
  const { data } = await apiClient.patch(`/transport/gps/events/${eventId}/acknowledge`);
  return data;
};
