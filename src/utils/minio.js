const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_URL.replace("https://", "").replace(
    "http://",
    ""
  ),
  port: 443,
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

module.exports = minioClient;
