const ytdl = require('@distube/ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs-extra');
const path = require('path');

console.log('🧪 Testing ECQ Video to MP3 Converter...\n');

// Test 1: Check if ytdl-core is working
console.log('1. Testing ytdl-core...');
try {
  const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Rick Roll for testing
  console.log('   ✓ ytdl-core imported successfully');
  
  if (ytdl.validateURL(testUrl)) {
    console.log('   ✓ URL validation working');
  } else {
    console.log('   ✗ URL validation failed');
  }
} catch (error) {
  console.log('   ✗ ytdl-core error:', error.message);
}

// Test 2: Check if ffmpeg is available
console.log('\n2. Testing FFmpeg...');
try {
  ffmpeg.getAvailableCodecs((err, codecs) => {
    if (err) {
      console.log('   ✗ FFmpeg not found or not working:', err.message);
      console.log('   💡 Make sure FFmpeg is installed and in your PATH');
    } else {
      console.log('   ✓ FFmpeg is working correctly');
      console.log('   ✓ Available codecs:', Object.keys(codecs).length);
    }
  });
} catch (error) {
  console.log('   ✗ FFmpeg error:', error.message);
}

// Test 3: Check file system operations
console.log('\n3. Testing file system...');
try {
  const testDir = path.join(__dirname, 'test-dir');
  fs.ensureDirSync(testDir);
  console.log('   ✓ Directory creation working');
  
  const testFile = path.join(testDir, 'test.txt');
  fs.writeFileSync(testFile, 'test');
  console.log('   ✓ File writing working');
  
  fs.removeSync(testDir);
  console.log('   ✓ File/directory removal working');
} catch (error) {
  console.log('   ✗ File system error:', error.message);
}

// Test 4: Check Node.js version
console.log('\n4. Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 16) {
  console.log(`   ✓ Node.js version ${nodeVersion} is compatible`);
} else {
  console.log(`   ✗ Node.js version ${nodeVersion} is too old. Please upgrade to version 16 or higher.`);
}

console.log('\n🎉 Test completed!');
console.log('\n📋 Next steps:');
console.log('1. Install dependencies: npm install');
console.log('2. Start the server: npm start');
console.log('3. Open http://localhost:3000 in your browser');
console.log('\n⚠️  Remember to install FFmpeg if the test shows it\'s missing!');
