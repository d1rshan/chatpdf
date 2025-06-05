"use client";
// import { uploadToS3 } from "@/lib/s3";
// import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
// import axios from "axios";
// import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// https://github.com/aws/aws-sdk-js-v3/issues/4126

const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      try {
        setIsUploading(true);
        // The actual upload will be handled by UploadButton
        console.log("Files dropped:", acceptedFiles);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsUploading(false);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        <UploadButton
          endpoint="pdfUploader"
          onClientUploadComplete={() => {
            router.refresh();
          }}
        />

        <>
          {isUploading ? (
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          ) : (
            <Inbox className="w-10 h-10 text-blue-500" />
          )}
          <p className="mt-2 text-sm text-slate-600">
            {isUploading ? "Uploading..." : "Drop PDF Here"}
          </p>
        </>
      </div>
    </div>
  );
};

export default FileUpload;
