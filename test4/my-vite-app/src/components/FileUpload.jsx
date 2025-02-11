import React, { useState, useCallback } from 'react';
import axios from 'axios';

function FileUpload() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
        setUploadProgress({});
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post(
                'http://127.0.0.1:8000/api/upload/',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0) return;

        setMessage(`Uploading ${selectedFiles.length} files...`);

        let successCount = 0;
        for (const file of selectedFiles) {
            const success = await uploadFile(file);
            if (success) successCount++;
        }

        setMessage(`Successfully uploaded ${successCount} of ${selectedFiles.length} files`);
        setSelectedFiles([]);
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
                    <p>Drag & drop files here or click to select</p>
                    <span className="file-info">
                        {selectedFiles.length > 0
                            ? `${selectedFiles.length} files selected`
                            : 'No files selected'}
                    </span>
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
                    <button
                        onClick={handleSubmit}
                        className="button button-primary"
                    >
                        Upload {selectedFiles.length} Files
                    </button>
                </div>
            )}

            {message && <p className="upload-message">{message}</p>}
        </div>
    );
}

export default FileUpload;