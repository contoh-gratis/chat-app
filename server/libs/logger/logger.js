const { createLogger, transports, format } = require('winston');
const fs = require('fs');
const path = require('path');

const logDirectory = 'logs';

// Create the log directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const today = new Date();
const logFileName = `log-${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}.log`;

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({
      filename: path.join(logDirectory, logFileName),
      maxsize: 5242880, // 5MB
      maxFiles: 5, // Rotate log files (keep 5 backup files)
    }),
    new transports.Console(),
  ],
});

module.exports = logger;
