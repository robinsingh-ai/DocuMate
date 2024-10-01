import React, { useState } from 'react';
import axios from 'axios';

interface PDFUploadProps {
  darkMode: boolean;
}

const PDFUpload: React.FC<PDFUploadProps> = ({ darkMode }) => {
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
      <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Upload PDF</h2>
      <input 
        type="file" 
        onChange={handleFileChange} 
        accept=".pdf" 
        className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`} 
      />
      <button
        onClick={handleUpload}
        className={`${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out`}
      >
        Upload
      </button>
      {uploadStatus && <p className={`mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{uploadStatus}</p>}
    </div>
  );
};

export default PDFUpload;