import React, { useState, useRef } from 'react';
import ImageKitService from '../services/ImageKitService';

const ImageKitUploader = ({ 
    onUploadSuccess, 
    onUploadError, 
    multiple = false, 
    folder = 'ganesha-uploads',
    category = 'other',
    tags = [],
    maxFiles = 10,
    showPreview = true,
    acceptedTypes = "image/*,video/*"
}) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        
        if (!multiple && files.length > 1) {
            if (onUploadError) {
                onUploadError('Please select only one file');
            }
            return;
        }

        if (files.length > maxFiles) {
            if (onUploadError) {
                onUploadError(`Maximum ${maxFiles} files allowed`);
            }
            return;
        }

        setSelectedFiles(files);

        // Generate previews
        if (showPreview) {
            const newPreviews = [];
            files.forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        newPreviews[index] = {
                            type: 'image',
                            url: e.target.result,
                            name: file.name,
                            size: file.size
                        };
                        if (newPreviews.length === files.length) {
                            setPreviews([...newPreviews]);
                        }
                    };
                    reader.readAsDataURL(file);
                } else if (file.type.startsWith('video/')) {
                    newPreviews[index] = {
                        type: 'video',
                        url: URL.createObjectURL(file),
                        name: file.name,
                        size: file.size
                    };
                    if (newPreviews.length === files.length) {
                        setPreviews([...newPreviews]);
                    }
                }
            });
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            if (onUploadError) {
                onUploadError('Please select files to upload');
            }
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            let result;
            
            if (multiple && selectedFiles.length > 1) {
                // Upload multiple files
                result = await ImageKitService.uploadMultipleFiles(selectedFiles, {
                    folder,
                    category,
                    tags,
                    isPublic: true
                });
            } else {
                // Upload single file
                result = await ImageKitService.uploadFile(selectedFiles[0], {
                    folder,
                    category,
                    tags,
                    isPublic: true
                });
            }

            if (result.success) {
                setUploadProgress(100);
                if (onUploadSuccess) {
                    onUploadSuccess(result.data);
                }
                // Reset form
                setSelectedFiles([]);
                setPreviews([]);
                fileInputRef.current.value = '';
            } else {
                if (onUploadError) {
                    onUploadError(result.error || 'Upload failed');
                }
            }
        } catch (error) {
            console.error('Upload error:', error);
            if (onUploadError) {
                onUploadError(error.message);
            }
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const removeFile = (index) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        setPreviews(newPreviews);
        
        // Update file input
        const dt = new DataTransfer();
        newFiles.forEach(file => dt.items.add(file));
        fileInputRef.current.files = dt.files;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="imagekit-uploader p-6 bg-golden/10 rounded-xl border border-golden/20">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-golden mb-2">
                    Upload {multiple ? 'Files' : 'File'}
                </h3>
                <p className="text-golden-light text-sm">
                    {multiple ? `Select up to ${maxFiles} files` : 'Select a file'} to upload to ImageKit
                </p>
            </div>

            {/* File Input */}
            <div className="mb-4">
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple={multiple}
                    accept={acceptedTypes}
                    onChange={handleFileSelect}
                    className="w-full p-3 bg-golden/10 border border-golden/30 rounded-lg text-golden file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-golden/20 file:text-golden hover:file:bg-golden/30"
                />
            </div>

            {/* File Previews */}
            {showPreview && previews.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-md font-semibold text-golden mb-2">Selected Files:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative bg-golden/5 border border-golden/20 rounded-lg p-3">
                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                >
                                    ×
                                </button>
                                
                                {preview.type === 'image' ? (
                                    <img
                                        src={preview.url}
                                        alt={preview.name}
                                        className="w-full h-32 object-cover rounded-lg mb-2"
                                    />
                                ) : (
                                    <video
                                        src={preview.url}
                                        className="w-full h-32 object-cover rounded-lg mb-2"
                                        controls
                                    />
                                )}
                                
                                <div className="text-golden-light text-xs">
                                    <p className="truncate" title={preview.name}>{preview.name}</p>
                                    <p>{formatFileSize(preview.size)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Progress */}
            {uploading && (
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-golden-light text-sm">Uploading...</span>
                        <span className="text-golden-light text-sm">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-golden/20 rounded-full h-2">
                        <div
                            className="bg-golden h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={uploading || selectedFiles.length === 0}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    uploading || selectedFiles.length === 0
                        ? 'bg-golden/10 text-golden/50 cursor-not-allowed'
                        : 'bg-golden/20 hover:bg-golden/30 text-golden border border-golden/30'
                }`}
            >
                {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} ${selectedFiles.length === 1 ? 'File' : 'Files'}`}
            </button>
        </div>
    );
};

export default ImageKitUploader;
