import fs from "fs";
import path from "path";
import os from "os";

export async function downloadFromUploadthing(fileKey: string) {
    try {
        // UploadThing files are accessible via their CDN URL
        const url = `https://uploadthing.com/f/${fileKey}`;
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        
        // Use os.tmpdir() to get the system's temp directory
        const file_name = path.join(os.tmpdir(), `pdf-${Date.now()}.pdf`);
        fs.writeFileSync(file_name, Buffer.from(buffer));
        
        return file_name;
    } catch (error) {
        console.error("Error downloading file", error);
        return null;
    }
}