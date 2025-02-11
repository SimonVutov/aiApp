import React from 'react';
import FileUpload from './FileUpload';

function ConnectPage() {
    return (
        <div className="container">
            <h1>Connect Your Data</h1>
            <div className="connection-options">
                <div className="card">
                    <h3>File Upload</h3>
                    <FileUpload />
                </div>

                <div className="card">
                    <h3>Google Drive</h3>
                    <p>Connect your Google Drive account</p>
                    <button className="button button-secondary" disabled>
                        Coming Soon
                    </button>
                </div>

                <div className="card">
                    <h3>Database</h3>
                    <p>Connect your database</p>
                    <button className="button button-secondary" disabled>
                        Coming Soon
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConnectPage; 