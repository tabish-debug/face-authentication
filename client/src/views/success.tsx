import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../interfaces/interface';
import { Service } from '../services/service';

function Success(props: any) {
  const [currentUser, setCurrentUser] = useState<User>();

  const navigate = useNavigate();

  useEffect(() => {
    async function getCurrentUser() {
      const service = new Service();
      const response: any = await service.getMe();
      setCurrentUser(response.data);
    }

    getCurrentUser();
  }, []);

  async function Logout() {
    const service = new Service();
    const response: any = await service.logout();
    props.setLogging(!(response.status === 200));
  }

  return (
    <div className="container" style={{ height: '70vh' }}>
      <div className="d-flex justify-content-around">
        <h1 className="h1">{currentUser?.email}</h1>

        <button className="btn btn-primary " onClick={Logout}>
          Logout
        </button>
      </div>
      <div className="d-flex align-items-center justify-content-center h-100">
        <p style={{ fontSize: '100px', color: 'green' }}>Success</p>
      </div>
    </div>
  );
}

export default Success;
