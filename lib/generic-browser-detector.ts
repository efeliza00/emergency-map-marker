export const isGenericInAppBrowser = () => {
  const ua = navigator.userAgent;

  const lowerUA = ua.toLowerCase();

  const identifiers = [
    "fban",
    "fbav",
    "fb_iab",
    "instagram",
    "snapchat",
    "line",
    "webview",
    "wv",
  ];

  for (const identifier of identifiers) {
    if (lowerUA.includes(identifier)) {
      return true;
    }
  }

  return false;
};
