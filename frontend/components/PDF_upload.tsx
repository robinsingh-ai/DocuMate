import React, { useState } from 'react';
import axios from 'axios';

const PDFUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3001/api/upload_pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('File uploaded successfully');
    } catch (error) {
      setUploadStatus('Error uploading file');
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold">Upload PDF</h2>
      <input type="file" onChange={handleFileChange} accept=".pdf" className="mb-2" />
      <button
        onClick={handleUpload}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Upload
      </button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default PDFUpload;