/*global module, require, Promise, console */

const AWS = require('aws-sdk'),
	fs = require('fs'),
	s3 = new AWS.S3(),
	REGION = process.env.REGION
	downloadFileFromS3 = function (bucket, fileKey, filePath) {
		'use strict';
		AWS.config.update({region: REGION});
		console.log('downloading', bucket, fileKey, filePath);
		return new Promise(function (resolve, reject) {
			const file = fs.createWriteStream(filePath),
				stream = s3.getObject({
					Bucket: bucket,
					Key: fileKey
				}).createReadStream();
			stream.on('error', reject);
			file.on('error', reject);
			file.on('finish', function () {
				console.log('downloaded', bucket, fileKey);
				resolve(filePath);
			});
			stream.pipe(file);
		});
	}, uploadFileToS3 = function (bucket, fileKey, filePath, contentType) {
		'use strict';
		AWS.config.update({ region: REGION });
		console.log('uploading', bucket, fileKey, filePath);
		return s3.upload({
			Bucket: bucket,
			Key: fileKey,
			Body: fs.createReadStream(filePath),
			ACL: 'public',
			ContentType: contentType
		}).promise();
	};

module.exports = {
	downloadFileFromS3: downloadFileFromS3,
	uploadFileToS3: uploadFileToS3
};
