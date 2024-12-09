import { Button } from 'react-admin';
import { useNavigate } from 'react-router-dom';

const CreateAdminButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      label="Créer un compte admin"
      onClick={() => navigate('/create-admin-user')}
    />
  );
};

export default CreateAdminButton;
