// CustomLoginPage.js

import React from 'react';
import { Login, LoginForm } from 'react-admin';

const CustomLoginForm = (props) => (
  <div>
    {/* Vous pouvez personnaliser davantage LoginForm ou créer votre propre formulaire */}
    <LoginForm {...props} />
    {/* Ajoutez d'autres éléments visuels ou fonctionnalités ici selon vos besoins */}
  </div>
);

const CustomLoginPage = (props) => <Login {...props} loginForm={<CustomLoginForm />} />;

export default CustomLoginPage;
