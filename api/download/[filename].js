const fs = require('fs-extra');
const path = require('path');

module.exports = async (req, res) => {
  const { filename } = req.query;
  
  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }

  const filePath = path.join('/tmp', filename);

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    
    // Set headers for download
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Cache-Control', 'no-cache');

    // Create read stream and pipe to response
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);

    readStream.on('error', (error) => {
      console.error('Download error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Download failed' });
      }
    });

  } catch (error) {
    console.error('File access error:', error);
    res.status(500).json({ error: 'File access failed' });
  }
};
