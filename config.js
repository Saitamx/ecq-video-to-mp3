module.exports = {
  // Project information
  name: 'Ecoquerai YouTube Video to MP3',
  author: 'Matias Troncoso Campos',
  organization: 'Ecoquerai Team',
  version: '1.1.0',
  social: {
    ecoquerai: 'https://www.instagram.com/ecoquerai/',
    saitam_jk: 'https://www.instagram.com/saitam_jk/'
  },
  
  // Server configuration
  port: process.env.PORT || 3000,
  
  // Audio conversion settings
  audio: {
    bitrate: 192,
    codec: 'libmp3lame',
    quality: {
      high: 'highestaudio',
      low: 'lowestaudio'
    }
  },
  
  // File management
  files: {
    cleanupInterval: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    maxFilenameLength: 100
  },
  
  // Error messages
  errors: {
    invalidUrl: 'Invalid YouTube URL format',
    videoUnavailable: 'Could not fetch video information. The video might be private, restricted, or unavailable.',
    streamError: 'Could not create video stream. The video might be restricted.',
    conversionError: 'Audio conversion failed',
    serverError: 'Unexpected server error',
    fileNotFound: 'File not found',
    downloadError: 'Download failed'
  },
  
  // Success messages
  success: {
    conversion: 'Video converted to MP3 successfully',
    cleanup: 'Cleanup completed successfully'
  }
};
