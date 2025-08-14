module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.json({
    message: 'Ecoquerai YouTube Video to MP3 API',
    version: '1.2.0',
    author: 'Matias Troncoso Campos',
    organization: 'Ecoquerai Team',
    social: {
      ecoquerai: 'https://www.instagram.com/ecoquerai/',
      saitam_jk: 'https://www.instagram.com/saitam_jk/'
    },
    endpoints: {
      info: 'GET /api/info',
      convert: 'POST /api/convert',
      download: 'GET /api/download/[filename]'
    },
    features: [
      'YouTube video to audio conversion',
      'Multiple quality options',
      'Direct download links',
      'CORS enabled for web integration'
    ]
  });
};
