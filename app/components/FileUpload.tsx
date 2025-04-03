"use client";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";

export default function FileUpload({onSuccess}: {onSuccess: (res: IKUploadResponse) => void;}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onError = (err: { message: string }) => {
    setError(err.message);
    setUploading(false);
  };

  const handelSuccess = (response: IKUploadResponse) => {
    setUploading(false);
    setError(null);
    onSuccess(response);
  };

  const handleStartUpload = () =>{
    setUploading(true);
    setError(null);
  }

  return (
    <div className="space-y-2">
        <h2>File upload</h2>
        <IKUpload
           fileName="product-image.png" 
           onError={onError} 
           onSuccess={handelSuccess} 
           onUploadStart={handleStartUpload}
           validateFile={(file:File)=>{
            const fileType = ["image/png", "image/jpeg", "image/webp"]
            if(fileType.includes(file.type)){
                setError("Invalid file type")
            }

            if(file.size > 10 * 1024 * 1024){
                setError("File size must less than 10 MB")
            }
            return true;
           }}
        />

        {uploading && (<p className="text-sm font-medium text-zinc-500">Uploading ...</p>)}
        {error && (<p className="text-sm text-red-600">{error}</p>)}
    </div>
)}
