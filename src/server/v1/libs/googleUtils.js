const { Drive } = require('../services/google');
const fs = require('fs')

/* Drive Folder IDs */
const highRes = process.env.HIGH_RES_DRIVE_ID;
const mediumRes = process.env.MEDIUM_RES_DRIVE_ID;
const lowRes = process.env.LOW_RES_DRIVE_ID;

const folders = {
    high: highRes,
    medium: mediumRes,
    low: lowRes
}

const ext = {
    high: "hi",
    medium: "mi",
    low: "lo" 
}

/* Drive Utils */
let uploadImage = async (images, data, links = []) => {
    console.log(images)
    try {
        let { name, description, mimeType } = data
        let resolution = Object.keys(images[0])[0]

        const addedImages = await Drive.files.create({
        requestBody: {
            name: `${name}-${ext[resolution]}`,
            mimeType: mimeType,
            description: description || "",
            contentRestrictions: [{ readOnly: true }],
            parents: [ folders[resolution] ]
        },
        media: {
            mimeType: mimeType,
            body: fs.createReadStream(images[0][resolution])
        }
        })

        /* Add Permission to generate link */
        await Drive.permissions.create({
            fileId: addedImages.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        })

        const image = await Drive.files.get({
            fileId: addedImages.data.id,
            fields: 'webViewLink, webContentLink'
        })
        
        images.shift()
        
        if(images.length != 0){
            links.unshift(image.data)
            return uploadImage(images, data, links)
        }

        return links
    }
    catch(e) {
        console.log(e)
    } 
}

module.exports = { uploadImage }