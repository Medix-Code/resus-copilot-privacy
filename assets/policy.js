(() => {
  const supported = ["es", "ca", "en"];
  const storageKey = "resus_privacy_lang";
  const path = window.location.pathname;
  const isPrivacyRoot = /\/privacy\/?$/.test(path);
  const pathMatch = path.match(/\/privacy\/(ca|en)\//);
  const currentLang = pathMatch ? pathMatch[1] : "es";
  const params = new URLSearchParams(window.location.search);
  const explicitLang = params.get("lang");

  const pickPreferredLanguage = () => {
    if (supported.includes(explicitLang)) return explicitLang;

    try {
      const stored = window.localStorage.getItem(storageKey);
      if (supported.includes(stored)) return stored;
    } catch (_) {}

    const browserLanguages = [...(navigator.languages || []), navigator.language]
      .filter(Boolean)
      .map((value) => value.toLowerCase());

    if (browserLanguages.some((value) => value.startsWith("ca"))) return "ca";
    if (browserLanguages.some((value) => value.startsWith("en"))) return "en";
    return "es";
  };

  if (isPrivacyRoot) {
    const preferredLang = pickPreferredLanguage();
    if (preferredLang === "ca" || preferredLang === "en") {
      window.location.replace(`./${preferredLang}/`);
      return;
    }
    try {
      window.localStorage.setItem(storageKey, "es");
    } catch (_) {}
  } else {
    try {
      window.localStorage.setItem(storageKey, currentLang);
    } catch (_) {}
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-lang]");
    if (!trigger) return;
    const lang = trigger.getAttribute("data-lang");
    if (!supported.includes(lang)) return;
    try {
      window.localStorage.setItem(storageKey, lang);
    } catch (_) {}
  });
})();
