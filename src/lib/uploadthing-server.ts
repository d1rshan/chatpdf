

export async function downloadFromUploadthing(fileKey: string){
    const res = await fetch(`https://${process.env.UPLOADTHING_APP_ID}.up.uploadthing.com/${fileKey}`)
    return res.body;
}