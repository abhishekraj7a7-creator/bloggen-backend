const jwt = require("jsonwebtoken");
// const publicKey = process.env.PUBLIC_KEY;

// const { publicKey } = JSON.parse(process.env.PUBLIC_KEY)

const publicKey = `-----BEGIN PUBLIC KEY-----\nMIICITANBgkqhkiG9w0BAQEFAAOCAg4AMIICCQKCAgBah3dhVsDzo+jejdjdyz6l\nj/uDXruOrmGufvs8aUpIGzNrb1bNkCuzfd0/mzPjwj7qjlUKJDkSQ2Q6Tla2T1L6\nQ//Z5lYJbJfJqWaQTLWuvH0D9pDgGe3xaX7VEQ82zybvWSQEpg3Hv78Kh0vz1v8I\nSr57I/J6UDsLSdV9ab1tLlZfEie9VereUUiWOTuNBIUkv4txk/Pi8kkgpJ5AJk+d\nJa1cYDQqnPfSrQo//cysHEQdH/zfNG/eGcwPAwxeUEpTCMdojFUUjPlcEBdbiOih\n2BAO+rApHXH5rkJk3/UHLHKSm2W35ZOJo5yAsLtlSStqiLop0mOfi0IkvaPer54S\nNyxxiTbh/ZO/CEbCyA/9B7MmKdoo9Utz3oRUQ3M28Qm/y+la6z7otPFMwXYuFmI4\nEemjjdLIhyD9x2GqNF2REV4QHh/PEsX8NxO7foz0VJu12DNwn3kz1ShhdiRQuzNP\nhKd4e2eH1BLxtftoEPrPIjIxWAoD///r1VHF3M2WZ5YgYcp9AxifXeHa15IzsYjr\nslJCmaghEULoTcsn/sOldMWCxQs/Kgo9qvwzmFX6sFdmOulTD1vQuy6b0+iaGhnW\niWtoHMaCcCw3dlvq9+3ZcYHiY5jBEbE86RQX2GySTuk2YQDpsdNd0UktAB2D+maX\nzzBCQmrgZhBAxhikFOLMTQIDAQAB\n-----END PUBLIC KEY-----`;

const authMiddleware = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next({ status: 401, error: "Unauthorized access" });
    }

    const { id } = jwt.verify(token, publicKey);

    if (!id) {
      return next({ status: 401, error: "Unauthorized access" });
    }

    req.userId = id;
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authMiddleware;
