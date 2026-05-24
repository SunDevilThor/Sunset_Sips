window.SunsetSipsLogger = (() => {
  const loggerPrefix = "[Sunset Sips]";

  function writeLog(logLevel, message, details = {}) {
    const timestamp = new Date().toISOString();
    const payload = { timestamp, details };

    if (logLevel === "error") {
      console.error(`${loggerPrefix} ${message}`, payload);
      return;
    }

    if (logLevel === "warn") {
      console.warn(`${loggerPrefix} ${message}`, payload);
      return;
    }

    console.info(`${loggerPrefix} ${message}`, payload);
  }

  return {
    info(message, details) {
      writeLog("info", message, details);
    },
    warn(message, details) {
      writeLog("warn", message, details);
    },
    error(message, details) {
      writeLog("error", message, details);
    }
  };
})();
