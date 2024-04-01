import '../firebaseConfig'; // Assurez-vous que ceci initialise Firebase

import * as React from 'react';
import { Admin, Resource } from 'react-admin';
import { FirebaseDataProvider } from 'react-admin-firebase';

import firebaseConfig from '../firebaseConfig';
import CustomAuthProvider from './auth/CustomAuthProvider';
import { ReservationEdit } from './Components/ReservationEdit';
import { ReservationList } from './Components/ReservationList';
import { UsersEdit } from './Components/UsersEdit';
import { UsersList } from './Components/UsersList';
import CustomLoginPage from './pages/CustomLoginPage';

const options = {
  logging: true,
  watch: ['reservations'],
};

const dataProvider = FirebaseDataProvider(firebaseConfig, options);
const authProvider = CustomAuthProvider;

const AdminDashboard = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    loginPage={CustomLoginPage}
  >
    <Resource name="reservations" list={ReservationList} edit={ReservationEdit} />
    <Resource name="users" list={UsersList} edit={UsersEdit} />
    {/* Ajoutez d'autres resources si nécessaire */}
  </Admin>
);

export default AdminDashboard;
