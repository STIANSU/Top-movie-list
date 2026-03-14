import "./userform.mjs";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker er registrert med suksess:", registration.scope);
      })
      .catch((error) => {
        console.log("Service Worker registrering feilet:", error);
      });
  });
}