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
    uptime: process.uptime()
  });
});

// Routes
app.get('/api', (req, res) => {
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
      health: 'GET /api/health',
      convert: 'POST /api/convert',
      status: 'GET /api/status/:id',
      download: 'GET /api/download/:filename',
      cleanup: 'POST /api/cleanup'
    }
  });
});

// Convert YouTube URL to MP3
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

    // Get video info with better error handling
    let videoInfo;
    try {
      videoInfo = await ytdl.getInfo(url);
    } catch (infoError) {
      console.error('Error getting video info:', infoError);
      return res.status(400).json({ 
        error: 'Could not fetch video information. The video might be private, restricted, or unavailable.',
        details: infoError.message 
      });
    }

    // Check if video is available
    if (!videoInfo.videoDetails || !videoInfo.videoDetails.title) {
      return res.status(400).json({ error: 'Video information not available' });
    }

    const videoTitle = videoInfo.videoDetails.title.replace(/[^\w\s-]/g, '');
    const videoId = videoInfo.videoDetails.videoId;
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${videoTitle}_${timestamp}.mp3`;
    const outputPath = path.join(downloadsDir, filename);

    console.log(`Starting conversion for: ${videoTitle} (ID: ${videoId})`);

    // Get the best audio format available
    const formats = ytdl.filterFormats(videoInfo.formats, 'audioonly');
    const bestFormat = formats[0];

    if (!bestFormat) {
      return res.status(500).json({ error: 'No audio format available for this video' });
    }

    // Generate unique filename with original extension
    const extension = bestFormat.container || 'm4a';
    const filename = `${videoTitle}_${timestamp}.${extension}`;
    const outputPath = path.join(downloadsDir, filename);

    // Create download stream
    const stream = ytdl(url, {
      quality: quality,
      filter: 'audioonly'
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

    // Get the best audio format available
    const formats = ytdl.filterFormats(videoInfo.formats, 'audioonly');
    const bestFormat = formats[0];

    if (!bestFormat) {
      return res.status(500).json({ error: 'No audio format available for this video' });
    }

    // Generate unique filename with original extension
    const extension = bestFormat.container || 'm4a';
    const filename = `${videoTitle}_${timestamp}.${extension}`;
    const outputPath = path.join(downloadsDir, filename);

    // Create download stream
    const stream = ytdl(url, {
      quality: quality,
      filter: 'audioonly'
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
    res.status(500).json({ 
      error: 'Unexpected server error', 
      details: error.message 
    });
  }
});

// Get conversion status (for future async processing)
app.get('/api/status/:id', (req, res) => {
  const { id } = req.params;
  // This could be implemented with a job queue system
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
