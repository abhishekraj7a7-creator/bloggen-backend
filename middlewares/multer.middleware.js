const multer = require('multer');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const { decode } = require('querystring');
const { parse } = require('url');

// Configure AWS SDK v3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure multer to use S3 without ACL
exports.upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "bloggen-bucket",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});

exports.deleteOldPhoto = async (url = "") => {
  const key = extractKeyFromUrl(url);
  const params = {
    Bucket: "bloggen-bucket",
    Key: key,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    console.log(`Deleted old profile photo: ${key}`);
  } catch (err) {
    console.error(`Error deleting old profile photo: ${err}`);
  }
};

// Function to extract the key from the URL
const extractKeyFromUrl = (url) => {
  const parsedUrl = parse(url);
  const key = decodeURIComponent(parsedUrl.pathname).substring(1); // Remove the leading '/'
  return key;
};

