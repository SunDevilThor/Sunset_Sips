(() => {
  const logger = window.SunsetSipsLogger;
  const storageKey = "sunset-sips-theme";
  const darkTheme = "dark";
  const lightTheme = "light";

  function getPreferredTheme() {
    const storedTheme = window.localStorage.getItem(storageKey);

    if (storedTheme === darkTheme || storedTheme === lightTheme) {
      logger?.info("Loaded stored theme preference.", { storedTheme });
      return storedTheme;
    }

    const browserPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const preferredTheme = browserPrefersDark ? darkTheme : lightTheme;
    logger?.info("Resolved theme from browser preference.", { preferredTheme });
    return preferredTheme;
  }

  function applyTheme(themeName) {
    document.documentElement.setAttribute("data-theme", themeName);
    const themeToggleButton = document.querySelector("[data-theme-toggle]");

    if (themeToggleButton) {
      themeToggleButton.textContent = themeName === darkTheme ? "☀️" : "🌙";
      themeToggleButton.setAttribute("aria-label", themeName === darkTheme ? "Switch to light theme" : "Switch to dark theme");
    }

    logger?.info("Applied theme.", { themeName });
  }

  function initializeThemeToggle() {
    const startingTheme = getPreferredTheme();
    applyTheme(startingTheme);

    const themeToggleButton = document.querySelector("[data-theme-toggle]");

    if (!themeToggleButton) {
      logger?.warn("Theme toggle button was not found on this page.");
      return;
    }

    themeToggleButton.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || lightTheme;
      const nextTheme = currentTheme === darkTheme ? lightTheme : darkTheme;
      window.localStorage.setItem(storageKey, nextTheme);
      applyTheme(nextTheme);
    });
  }

  document.addEventListener("DOMContentLoaded", initializeThemeToggle);
})();
