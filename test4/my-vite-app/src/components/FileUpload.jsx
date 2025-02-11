import React, { useState } from 'react';
import axios from 'axios';

function FileUpload({ onUploadComplete }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
        setUploadStatus('Uploading...');

        const uploadPromises = files.map(uploadFile);

        try {
            await Promise.all(uploadPromises);
            setUploadStatus('Upload complete!');
            if (onUploadComplete) {
                onUploadComplete();
            }
        } catch (error) {
            setUploadStatus('Upload failed');
            console.error('Upload error:', error);
        }
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post(
                'http://localhost:8000/api/upload/',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(prev => ({
                            ...prev,
                            [file.name]: percentCompleted
                        }));
                    }
                }
            );
            return true;
        } catch (error) {
            console.error(`Error uploading ${file.name}:`, error);
            return false;
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        setSelectedFiles(files);
        setUploadProgress({});
    };

    return (
        <div className="upload-container">
            <div
                className="drop-zone"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    className="file-input"
                    id="file-input"
                />
                <label htmlFor="file-input" className="file-label">
                    <div className="upload-icon">📁</div>
                    <p>Click to upload or drag and drop</p>
                    <p className="file-info">PDF, DOC, TXT up to 10MB</p>
                </label>
            </div>

            {selectedFiles.length > 0 && (
                <div className="selected-files">
                    <h4>Selected Files:</h4>
                    <div className="file-list">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="file-item">
                                <span>{file.name}</span>
                                {uploadProgress[file.name] && (
                                    <div className="progress-bar">
                                        <div
                                            className="progress"
                                            style={{ width: `${uploadProgress[file.name]}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {uploadStatus && (
                <div className="upload-message">{uploadStatus}</div>
            )}
        </div>
    );
}

export default FileUpload;