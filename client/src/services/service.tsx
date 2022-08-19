import axios from 'axios';
import { Register } from '../interfaces/interface';

export class Service {
  async registerUser(data: Register) {
    try {
      const response = await axios.post('api/auth/register', data);
      return response.data;
    } catch (err) {
      return err;
    }
  }

  async uploadUserImage(file: File, user_id: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', user_id);
    try {
      const response = await axios.post('api/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (err) {
      return err;
    }
  }

  async loginWithImage(file: File, email: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);
    try {
      const response = await axios.post('api/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (err) {
      return err;
    }
  }
}
