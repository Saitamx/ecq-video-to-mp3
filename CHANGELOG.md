# Changelog - ECQ Video to MP3 Converter

## [1.1.0] - 2025-01-14

### 🔧 Fixed
- **YouTube API Issues**: Replaced `ytdl-core` with `@distube/ytdl-core` to fix "Could not extract functions" error
- **Error Handling**: Improved error handling for video availability and restrictions
- **Stream Management**: Better handling of video streams and conversion errors

### ✨ Added
- **Configuration File**: Centralized configuration in `config.js`
- **Health Check Endpoint**: Added `/health` endpoint for monitoring
- **Improved Logging**: Better console output and error messages
- **Graceful Shutdown**: Proper handling of SIGINT and SIGTERM signals
- **API Test Script**: `test-api.js` for testing the conversion endpoint
- **Enhanced Documentation**: Updated README with troubleshooting guide

### 🚀 Improved
- **Error Messages**: More descriptive error messages for different failure scenarios
- **Code Structure**: Better separation of concerns and modularity
- **Startup Process**: Improved server startup with better logging
- **File Management**: Removed unnecessary temporary file handling

### 📦 Dependencies
- Updated `ytdl-core` to `@distube/ytdl-core@4.16.12`
- Added `node-fetch@2` for API testing

## [1.0.0] - 2025-01-14

### 🎉 Initial Release
- YouTube to MP3 conversion functionality
- Web interface with modern design
- RESTful API endpoints
- Automatic file cleanup
- FFmpeg integration for audio conversion

---

**Autor:** Matias Troncoso Campos  
**Organización:** Ecoquerai Team
