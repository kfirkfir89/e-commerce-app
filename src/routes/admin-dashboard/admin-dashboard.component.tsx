import { Routes, Route } from 'react-router-dom';
import AddFirebase from '../../components/add-firebase/add-firebase.component';
import AdminDBNav from '../admin-dashboard-nav/admin-db-nav.component';
import Dashboard from '../../components/dashboard/dashboard.component';

const AdminDashboard = () => {
  return (
    <Routes>
      <Route path="/*" element={<AdminDBNav />}>
        <Route index element={<Dashboard />} />
        <Route path="addfirebase" element={<AddFirebase />} />
        {/* <Route path=":category" element={<Category />} /> */}
      </Route>
    </Routes>
  );
};

export default AdminDashboard;
