// "use client";

// import React, { useState } from 'react';
// import axios from 'axios';
// import { Upload, CheckCircle, XCircle } from 'lucide-react';

// interface PDFUploadProps {
//   darkMode: boolean;
// }

// const PDFUpload: React.FC<PDFUploadProps> = ({ darkMode }) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setFile(event.target.files[0]);
//       setUploadStatus('idle');
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setUploadStatus('error');
//       return;
//     }

//     setUploadStatus('uploading');
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       await axios.post('http://localhost:3001/api/upload_pdf', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setUploadStatus('success');
//     } catch (error) {
//       setUploadStatus('error');
//     }
//   };

//   return (
//     <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//       <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Upload PDF</h2>
//       <div className="flex items-center mb-4">
//         <input 
//           type="file" 
//           onChange={handleFileChange} 
//           accept=".pdf" 
//           className={`flex-grow ${darkMode ? 'text-white' : 'text-gray-800'} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${darkMode ? 'file:bg-gray-600 file:text-white hover:file:bg-gray-500' : 'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'}`}
//         />
//         <button
//           onClick={handleUpload}
//           disabled={!file || uploadStatus === 'uploading'}
//           className={`flex items-center px-4 py-2 rounded-full transition duration-300 ease-in-out ${
//             !file || uploadStatus === 'uploading'
//               ? 'bg-gray-400 cursor-not-allowed'
//               : darkMode
//               ? 'bg-blue-600 hover:bg-blue-700'
//               : 'bg-blue-500 hover:bg-blue-600'
//           } text-white font-bold`}
//         >
//           <Upload className="mr-2" size={16} />
//           {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
//         </button>
//       </div>
//       {uploadStatus === 'success' && (
//         <p className="flex items-center text-green-500">
//           <CheckCircle className="mr-2" size={16} />
//           File uploaded successfully
//         </p>
//       )}
//       {uploadStatus === 'error' && (
//         <p className="flex items-center text-red-500">
//           <XCircle className="mr-2" size={16} />
//           {file ? 'Error uploading file' : 'Please select a file'}
//         </p>
//       )}
//     </div>
//   );
// };

// export default PDFUpload;