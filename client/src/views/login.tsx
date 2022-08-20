import React, { useEffect, useRef, useState } from 'react';
import { Service } from '../services/service';
import Webcam from 'react-webcam';
import { Link } from 'react-router-dom';

const videoConstraints = {
  facingMode: 'user'
};

function Login(props: any) {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [fileExist, setFileExist] = useState(false);
  const [clickCapture, setClickCapture] = useState(true);
  const [imgSrc, setImgSrc] = useState(null);
  const [captureImage, setCaptureImage] = useState<File>();

  useEffect(() => {
    setEmailValid(/\S+@\S+\.\S+/.test(email));
  }, [email]);

  useEffect(() => {
    setFileExist(Boolean(captureImage));
  }, [captureImage]);

  useEffect(() => {
    if (imgSrc) {
      const imgtag: any = document.getElementById('selectedImage');
      imgtag.src = imgSrc;
    }
  }, [imgSrc]);

  const urlToFile = async (url: string, filename: string, mimeType: string) => {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    return new File([buf], filename, { type: mimeType });
  };

  const WebcamCapture = () => {
    const webcamRef = React.useRef<Webcam>(null);
    const capture = React.useCallback(async () => {
      const imageSrc: any = webcamRef.current?.getScreenshot();
      setImgSrc(imageSrc);
      setClickCapture(false);
      setCaptureImage(await urlToFile(imageSrc, 'data.jpeg', 'image/jpeg'));
    }, [webcamRef]);
    return (
      <>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
          videoConstraints={videoConstraints}
        />
        <button className="btn btn-primary mt-3" onClick={capture}>
          Capture photo
        </button>
      </>
    );
  };

  async function submit() {
    const service = new Service();
    const uploadFile: any = captureImage;
    const response: any = await service.loginWithImage(uploadFile, email);
    setEmail('');
    setCaptureImage(undefined);
    props.setLogging(response?.data?.status === 'success');
    if (!(response?.data?.status === 'success')) {
      alert('Login Failed');
    }
  }

  return (
    <div className="card p-5" style={{ width: '30rem' }}>
      <div className="mb-3">
        <label htmlFor="exampleInputEmail1" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          value={email}
          aria-describedby="emailHelp"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div id="emailHelp" className="form-text">
          We never share your email with anyone else.
        </div>
      </div>
      <div className="mb-3">
        <label className="mb-3">Facial Authentication</label>
        <div className="d-flex justify-content-center">
          <img
            id="selectedImage"
            width="100%"
            style={{ display: clickCapture ? 'none' : 'block' }}
          />
        </div>
        {clickCapture && <WebcamCapture />}
      </div>
      {!clickCapture && (
        <div className="d-flex justify-content-start">
          <button type="submit" className="btn btn-primary" onClick={() => setClickCapture(true)}>
            Re-Take
          </button>
        </div>
      )}
      <div className="d-flex justify-content-end">
        <button
          disabled={!emailValid || !fileExist}
          type="submit"
          className="btn btn-primary"
          onClick={submit}>
          Submit
        </button>
      </div>
      <div>
        {"I didn't register here?"} <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default Login;
