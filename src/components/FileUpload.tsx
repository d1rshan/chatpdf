"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

// https://github.com/aws/aws-sdk-js-v3/issues/4126

const FileUpload = () => {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
    onSuccess: ({ chat_id }) => {
      console.log("data", chat_id);
      toast.success("Chat created successfully");
      router.push(`/chat/${chat_id}`);
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Error creating chat");
    },
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      <UploadDropzone
        endpoint="pdfUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          if (!res[0]?.key || !res[0]?.name) {
            toast.error("Something went wrong");
            return;
          }
          mutate({
            file_key: res[0].key,
            file_name: res[0].name,
          });
          toast.success("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          toast.error(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
};

export default FileUpload;
