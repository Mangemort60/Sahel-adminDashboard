import '../firebaseConfig'; // Assurez-vous que ceci initialise Firebase

import * as React from 'react';
import { Admin, CustomRoutes, Resource } from 'react-admin';
import { FirebaseDataProvider } from 'react-admin-firebase';
import { Route } from 'react-router-dom';

import firebaseConfig from '../firebaseConfig';
import { useAppSelector } from './app/hooks';
import CustomAuthProvider from './auth/CustomAuthProvider';
import CreateAdminUser from './Components/CreateAdminUser';
import { ReservationEdit } from './Components/ReservationEdit';
import { ReservationList } from './Components/ReservationList';
import { UserCreate } from './Components/UserCreate';
import { UsersEdit } from './Components/UsersEdit';
import { UsersList } from './Components/UsersList';
import CreateAdminUserPage from './pages/CreateAdminUserPage';
import CustomLoginPage from './pages/CustomLoginPage';

const options = {
  logging: true,
  watch: ['reservations'],
};

const dataProvider = FirebaseDataProvider(firebaseConfig, options);
const authProvider = CustomAuthProvider;

const AdminDashboard = () => {
  const role = useAppSelector((state) => state.user.role);

  console.log(role);

  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={CustomLoginPage}
    >
      <Resource name="reservations" list={ReservationList} edit={ReservationEdit} />
      {role === 'superAdmin' && (
        <Resource name="users" list={UsersList} edit={UsersEdit} create={UserCreate} />
      )}

      <CustomRoutes>
        <Route path="/create-admin-user" element={<CreateAdminUserPage />} />
      </CustomRoutes>
    </Admin>
  );
};

export default AdminDashboard;
