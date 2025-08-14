const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create directories if they don't exist (for Vercel, use /tmp)
const downloadsDir = '/tmp/downloads';
const tempDir = '/tmp/temp';

fs.ensureDirSync(downloadsDir);
fs.ensureDirSync(tempDir);

// Serve static files
app.use('/downloads', express.static(downloadsDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    platform: 'Vercel',
    ytdl: 'Available',
    note: 'API is running correctly'
  });
});

// Test endpoint for YouTube URL validation
app.post('/api/test', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const isValid = ytdl.validateURL(url);
    
    res.json({
      url: url,
      isValid: isValid,
      message: isValid ? 'URL is valid' : 'URL is invalid'
    });
  } catch (error) {
    res.status(500).json({ error: 'Test failed', details: error.message });
  }
});

// Routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Ecoquerai YouTube Video to MP3 API',
    version: '1.2.0',
    author: 'Matias Troncoso Campos',
    organization: 'Ecoquerai Team',
    platform: 'Vercel',
    social: {
      ecoquerai: 'https://www.instagram.com/ecoquerai/',
      saitam_jk: 'https://www.instagram.com/saitam_jk/'
    },
    endpoints: {
      health: 'GET /api/health',
      convert: 'POST /api/convert',
      status: 'GET /api/status/:id',
      download: 'GET /api/download/:filename',
      cleanup: 'POST /api/cleanup'
    }
  });
});

// Convert YouTube URL to Audio (direct download)
app.post('/api/convert', async (req, res) => {
  try {
    const { url, quality = 'highestaudio' } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }

    // Validate YouTube URL
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL format' });
    }

    console.log(`Processing URL: ${url}`);

    // Get video info with better error handling and headers
    let videoInfo;
    try {
      videoInfo = await ytdl.getInfo(url, {
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          }
        }
      });
    } catch (infoError) {
      console.error('Error getting video info:', infoError);
      
      // Provide more specific error messages
      let errorMessage = 'Could not fetch video information.';
      if (infoError.message.includes('Video unavailable')) {
        errorMessage = 'This video is unavailable or private.';
      } else if (infoError.message.includes('Sign in')) {
        errorMessage = 'This video requires authentication.';
      } else if (infoError.message.includes('restricted')) {
        errorMessage = 'This video is restricted in your region.';
      } else if (infoError.message.includes('copyright')) {
        errorMessage = 'This video has copyright restrictions.';
      }
      
      return res.status(400).json({ 
        error: errorMessage,
        details: infoError.message,
        suggestion: 'Try a different YouTube video or check if the video is publicly available.'
      });
    }

    // Check if video is available
    if (!videoInfo.videoDetails || !videoInfo.videoDetails.title) {
      return res.status(400).json({ error: 'Video information not available' });
    }

    const videoTitle = videoInfo.videoDetails.title.replace(/[^\w\s-]/g, '');
    const videoId = videoInfo.videoDetails.videoId;
    
    // Get the best audio format available
    const formats = ytdl.filterFormats(videoInfo.formats, 'audioonly');
    const bestFormat = formats[0];

    if (!bestFormat) {
      return res.status(500).json({ error: 'No audio format available for this video' });
    }

    // Generate unique filename with original extension
    const timestamp = Date.now();
    const extension = bestFormat.container || 'm4a';
    const filename = `${videoTitle}_${timestamp}.${extension}`;
    const outputPath = path.join(downloadsDir, filename);

    console.log(`Starting download for: ${videoTitle} (ID: ${videoId})`);

    // Create download stream with headers
    const stream = ytdl(url, {
      quality: quality,
      filter: 'audioonly',
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      }
    });

    // Create write stream
    const writeStream = fs.createWriteStream(outputPath);

    // Handle stream errors
    stream.on('error', (streamError) => {
      console.error('Video stream error:', streamError);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Error downloading video stream',
          details: streamError.message 
        });
      }
    });

    writeStream.on('error', (writeError) => {
      console.error('Write stream error:', writeError);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Error writing file',
          details: writeError.message 
        });
      }
    });

    // Pipe the stream to file
    stream.pipe(writeStream);

    writeStream.on('finish', () => {
      console.log('Download completed successfully');
      
      // Get file stats
      const stats = fs.statSync(outputPath);
      const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

      res.json({
        success: true,
        message: 'Video downloaded successfully',
        filename: filename,
        downloadUrl: `/api/download/${filename}`,
        videoTitle: videoTitle,
        duration: videoInfo.videoDetails.lengthSeconds,
        fileSize: `${fileSizeInMB} MB`,
        format: bestFormat.container || 'audio',
        quality: bestFormat.audioBitrate ? `${bestFormat.audioBitrate}kbps` : 'Unknown',
        platform: 'Vercel',
        note: 'Direct audio download - no conversion required'
      });
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Unexpected server error', 
        details: error.message 
      });
    }
  }
});

// Get conversion status (for future async processing)
app.get('/api/status/:id', (req, res) => {
  const { id } = req.params;
  res.json({ status: 'completed', id });
});

// Download converted file
app.get('/api/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(downloadsDir, filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Download failed' });
      }
    });
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Clean up old files (older than 24 hours)
app.post('/api/cleanup', async (req, res) => {
  try {
    const files = await fs.readdir(downloadsDir);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    let deletedCount = 0;
    for (const file of files) {
      const filePath = path.join(downloadsDir, file);
      const stats = await fs.stat(filePath);
      
      if (now - stats.mtime.getTime() > oneDay) {
        await fs.remove(filePath);
        deletedCount++;
      }
    }

    res.json({ 
      success: true, 
      message: `Cleaned up ${deletedCount} old files` 
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ error: 'Cleanup failed' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Export for Vercel
module.exports = app;
