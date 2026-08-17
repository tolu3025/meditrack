const http = require('https');

http.get('https://meditrack-i1p8.onrender.com/api/doctors', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('API Status:', json.success);
      if (json.success && json.data.length > 0) {
        console.log('First Doctor Entry:\n', JSON.stringify(json.data[0], null, 2));
      } else {
        console.log('No data or failed:', json);
      }
    } catch (e) {
      console.error('Error parsing response:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('Request error:', err.message);
});
