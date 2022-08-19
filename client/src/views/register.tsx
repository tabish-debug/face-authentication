import React, { useEffect, useState } from 'react';
import { Service } from '../services/service';
import Webcam from 'react-webcam';
import { User } from '../interfaces/interface';

const videoConstraints = {
  facingMode: 'user'
};

function Register() {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [fileExist, setFileExist] = useState(false);
  const [clickCapture, setClickCapture] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [captureImage, setCaptureImage] = useState<File>();
  const [uploadImage, setUploadImage] = useState<File>();

  useEffect(() => {
    setEmailValid(/\S+@\S+\.\S+/.test(email));
  }, [email]);

  useEffect(() => {
    setFileExist(Boolean(captureImage || uploadImage));
  }, [captureImage, uploadImage]);

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
      setUploadImage(undefined);
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

  async function uploadImageProcess(event: any) {
    const selectedFile = event?.target?.files[0];
    setCaptureImage(undefined);
    setUploadImage(selectedFile);
    const reader = new FileReader();
    const imgtag: any = document.getElementById('selectedImage');
    imgtag.title = selectedFile.name;
    reader.onload = function (event) {
      imgtag.src = event?.target?.result;
    };
    reader.readAsDataURL(selectedFile);
  }

  async function submit() {
    const service = new Service();
    const user: User = await service.registerUser({ email });
    const uploadFile: any = uploadImage || captureImage;
    const file = await service.uploadUserImage(uploadFile, user.id);
    setEmail('');
    setCaptureImage(undefined);
    setUploadImage(undefined);
    console.log(file);
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
        <div className="p-3 mb-3 d-flex justify-content-around">
          <input
            type="file"
            name="uploadfile"
            id="img"
            style={{ display: 'none' }}
            onChange={(e) => uploadImageProcess(e)}
          />
          <label className="btn btn-primary" htmlFor="img">
            upload image
          </label>
          <button className="btn btn-primary" onClick={() => setClickCapture(!clickCapture)}>
            {clickCapture ? 'Close Camera' : 'Open Camera'}
          </button>
        </div>
        <div className="d-flex justify-content-center">
          <img
            id="selectedImage"
            width={200}
            style={{ display: clickCapture ? 'none' : 'block' }}
          />
        </div>
        {clickCapture && <WebcamCapture />}
      </div>
      <div className="d-flex justify-content-end">
        <button
          disabled={!emailValid || !fileExist}
          type="submit"
          className="btn btn-primary"
          onClick={submit}>
          Submit
        </button>
      </div>
      <div>I have already register with face</div>
    </div>
  );
}

export default Register;
