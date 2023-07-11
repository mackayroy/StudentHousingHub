// require('dotenv').config()
// const S3 = require('aws-sdk/clients/s3')
// const fs = require('fs');
// const { get } = require('http');
// const bucketName = process.env.AWS_BUCKET_NAME;
// const region = process.env.AWS_BUCKET_REGION
// const accessKeyId = process.env.AWS_ACCESS_KEY
// const secretAccessKey = process.env.AWS_SECRET_KEY

// const s3 = new S3({
//     region, 
//     accessKeyId,
//     secretAccessKey
// })

// // uploads a file to s3
// function uploadFile(file){
//     const fileStream = fs.createdReadStream(file.path)

//     const uploadParams = {
//         bucket: bucketName,
//         body: fileStream,
//         key: file.filename
//     }

//     return s3.upload(uploadParams).promise()
// }
// exports.uploadFile = uploadFile

// // downloads a file from s3
// function getFileStream(fileKey){
//     const downloadParams = {
//         key: fileKey,
//         bucket: bucketName
//     }
//     return s3.getObject(downloadParams).createReadStream()
// }
// exports.getFileStream = getFileStream