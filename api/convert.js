const ytdl = require('@distube/ytdl-core');
const fs = require('fs-extra');
const path = require('path');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    const outputPath = path.join('/tmp', filename);

    console.log(`Starting download for: ${videoTitle} (ID: ${videoId})`);

    // Get the best audio format available
    const formats = ytdl.filterFormats(videoInfo.formats, 'audioonly');
    const bestFormat = formats[0];

    if (!bestFormat) {
      return res.status(500).json({ error: 'No audio format available for this video' });
    }

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
      res.status(500).json({ 
        error: 'Error downloading video stream',
        details: streamError.message 
      });
    });

    writeStream.on('error', (writeError) => {
      console.error('Write stream error:', writeError);
      res.status(500).json({ 
        error: 'Error writing file',
        details: writeError.message 
      });
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
        quality: bestFormat.audioBitrate ? `${bestFormat.audioBitrate}kbps` : 'Unknown'
      });
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ 
      error: 'Unexpected server error', 
      details: error.message 
    });
  }
};
