import React from 'react';
import { Loading, usePermissions } from 'react-admin';

import CreateAdminUser from '../Components/CreateAdminUser';

const CreateAdminUserPage = () => {
  const { permissions, loading } = usePermissions(); // Vérifie les permissions

  if (loading) {
    return <Loading />;
  }

  if (permissions !== 'superAdmin') {
    return <p>Accès refusé. Cette page est réservée aux super administrateurs.</p>;
  }

  return <CreateAdminUser />;
};

export default CreateAdminUserPage;
