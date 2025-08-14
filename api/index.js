const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Rotación de User-Agents para evitar detección
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0'
];

// Cookies de YouTube para simular sesión real
const youtubeCookies = [
  'CONSENT=YES+cb.20231231-07-p0.es+FX+{}',
  'VISITOR_INFO1_LIVE=random_string',
  'LOGIN_INFO=random_string',
  'SID=random_string',
  'HSID=random_string',
  'SSID=random_string',
  'APISID=random_string',
  'SAPISID=random_string',
  '__Secure-1PSID=random_string',
  '__Secure-3PSID=random_string'
];

function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function getRandomCookies() {
  return youtubeCookies[Math.floor(Math.random() * youtubeCookies.length)];
}

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

// Advanced diagnostic endpoint
app.post('/api/diagnose', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const results = {
      url: url,
      timestamp: new Date().toISOString(),
      tests: {}
    };
    
    // Test 1: URL Validation
    try {
      results.tests.urlValidation = {
        isValid: ytdl.validateURL(url),
        message: ytdl.validateURL(url) ? 'URL is valid' : 'URL is invalid'
      };
    } catch (error) {
      results.tests.urlValidation = {
        isValid: false,
        error: error.message
      };
    }
    
    // Test 2: Basic Info (without headers)
    try {
      const basicInfo = await ytdl.getInfo(url);
      results.tests.basicInfo = {
        success: true,
        title: basicInfo.videoDetails?.title || 'Unknown',
        duration: basicInfo.videoDetails?.lengthSeconds || 'Unknown',
        formats: basicInfo.formats?.length || 0
      };
    } catch (error) {
      results.tests.basicInfo = {
        success: false,
        error: error.message
      };
    }
    
    // Test 3: Info with advanced headers
    try {
      const infoWithHeaders = await ytdl.getInfo(url, {
        requestOptions: {
          headers: {
            'User-Agent': getRandomUserAgent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0'
          }
        }
      });
      results.tests.infoWithHeaders = {
        success: true,
        title: infoWithHeaders.videoDetails?.title || 'Unknown'
      };
    } catch (error) {
      results.tests.infoWithHeaders = {
        success: false,
        error: error.message
      };
    }
    
    // Test 4: Available formats
    try {
      const info = await ytdl.getInfo(url);
      const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
      results.tests.audioFormats = {
        success: true,
        count: audioFormats.length,
        formats: audioFormats.map(f => ({
          container: f.container,
          audioBitrate: f.audioBitrate,
          quality: f.quality
        }))
      };
    } catch (error) {
      results.tests.audioFormats = {
        success: false,
        error: error.message
      };
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Diagnosis failed', details: error.message });
  }
});

// Advanced test endpoint with multiple strategies
app.post('/api/test-advanced', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const results = {
      url: url,
      timestamp: new Date().toISOString(),
      strategies: []
    };
    
    // Strategy 1: Basic validation
    try {
      const isValid = ytdl.validateURL(url);
      results.strategies.push({
        name: 'Basic Validation',
        success: isValid,
        message: isValid ? 'URL is valid' : 'URL is invalid'
      });
    } catch (error) {
      results.strategies.push({
        name: 'Basic Validation',
        success: false,
        error: error.message
      });
    }
    
    // Strategy 2: Simple getInfo
    try {
      const info = await ytdl.getInfo(url);
      results.strategies.push({
        name: 'Simple getInfo',
        success: true,
        title: info.videoDetails?.title || 'Unknown'
      });
    } catch (error) {
      results.strategies.push({
        name: 'Simple getInfo',
        success: false,
        error: error.message
      });
    }
    
    // Strategy 3: With User-Agent rotation
    try {
      const info = await ytdl.getInfo(url, {
        requestOptions: {
          headers: {
            'User-Agent': getRandomUserAgent()
          }
        }
      });
      results.strategies.push({
        name: 'User-Agent Rotation',
        success: true,
        title: info.videoDetails?.title || 'Unknown'
      });
    } catch (error) {
      results.strategies.push({
        name: 'User-Agent Rotation',
        success: false,
        error: error.message
      });
    }
    
    // Strategy 4: With full headers
    try {
      const info = await ytdl.getInfo(url, {
        requestOptions: {
          headers: {
            'User-Agent': getRandomUserAgent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0',
            'Cookie': getRandomCookies()
          }
        }
      });
      results.strategies.push({
        name: 'Full Headers',
        success: true,
        title: info.videoDetails?.title || 'Unknown'
      });
    } catch (error) {
      results.strategies.push({
        name: 'Full Headers',
        success: false,
        error: error.message
      });
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Advanced test failed', details: error.message });
  }
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

    // Get video info with advanced anti-detection
    let videoInfo;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`Attempt ${attempts} to get video info...`);
        
        const headers = {
          'User-Agent': getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0',
          'Cookie': getRandomCookies()
        };
        
        videoInfo = await ytdl.getInfo(url, {
          requestOptions: { headers }
        });
        
        console.log(`Success on attempt ${attempts}`);
        break;
        
      } catch (infoError) {
        console.error(`Attempt ${attempts} failed:`, infoError.message);
        
        if (attempts === maxAttempts) {
          // All attempts failed
          let errorMessage = 'Could not fetch video information after multiple attempts.';
          if (infoError.message.includes('Video unavailable')) {
            errorMessage = 'This video is unavailable or private.';
          } else if (infoError.message.includes('Sign in')) {
            errorMessage = 'This video requires authentication.';
          } else if (infoError.message.includes('restricted')) {
            errorMessage = 'This video is restricted in your region.';
          } else if (infoError.message.includes('copyright')) {
            errorMessage = 'This video has copyright restrictions.';
          } else if (infoError.message.includes('410')) {
            errorMessage = 'YouTube is blocking requests. Please try again later.';
          }
          
          return res.status(400).json({ 
            error: errorMessage,
            details: infoError.message,
            attempts: attempts,
            suggestion: 'YouTube may be temporarily blocking requests. Try again in a few minutes or use a different video.'
          });
        }
        
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
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

    // Create download stream with advanced headers
    const stream = ytdl(url, {
      quality: quality,
      filter: 'audioonly',
      requestOptions: {
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0',
          'Cookie': getRandomCookies()
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
