import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Users from "../pages/Users";
import UserForm from "../pages/UserForm";
import Events from "../pages/Events";
import EventForm from "../pages/EventForm";  // ✅ Import EventForm
import ChangePassword from "../pages/ChangePassword";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../components/MainLayout";
import EventMonitor from "../pages/EventMonitor";

export default function AppRouter() {
  console.log("✅ AppRouter Loaded");

  return (
    <BrowserRouter>
      <Routes>
        {/* 🔒 Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/users" element={<Users />} />
            <Route path="/user/new" element={<UserForm />} />  {/* ✅ Create User */}
            <Route path="/user/:id" element={<UserForm />} />  {/* ✅ Edit User */}

            <Route path="/events" element={<Events />} />
            <Route path="/event/new" element={<EventForm />} />  {/* ✅ Create Event */}
            <Route path="/event/:id" element={<EventForm />} />  {/* ✅ Edit Event */}

            <Route path="/change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        {/* 🌐 Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/event-monitor" element={<EventMonitor />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}