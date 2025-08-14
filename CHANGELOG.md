# Changelog - ECQ Video to MP3 Converter

## [1.2.0] - 2025-01-14

### 🎨 UI/UX Improvements
- **Branding Update**: Changed title to "Ecoquerai YouTube Video to MP3"
- **Logo Integration**: Added official Ecoquerai logo to the interface
- **Social Media Links**: Added Instagram links with official branding
- **Enhanced Design**: Improved header styling with gradient text and better layout
- **Author Information**: Prominent display of Matias Troncoso Campos as developer

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
- **Social Media Integration**: Instagram links for @ecoquerai and @saitam_jk

### 🚀 Improved
- **Error Messages**: More descriptive error messages for different failure scenarios
- **Code Structure**: Better separation of concerns and modularity
- **Startup Process**: Improved server startup with better logging
- **File Management**: Removed unnecessary temporary file handling
- **Brand Identity**: Consistent Ecoquerai branding throughout the application

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
