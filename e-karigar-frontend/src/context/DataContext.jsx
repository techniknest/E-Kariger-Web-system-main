
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../mock/api';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    (async () => {
      setCategories(await api.getCategories());
      setVendors(await api.getVendors());
      setServices(await api.getServices());
      setBookings(await api.getBookings());
      setReviews(await api.getReviews());
    })();
  }, []);

  const value = {
    categories, vendors, services, bookings, reviews,
    refresh: async () => {
      setVendors(await api.getVendors());
      setServices(await api.getServices());
      setBookings(await api.getBookings());
      setReviews(await api.getReviews());
    }
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
export const useData = () => useContext(DataContext);
