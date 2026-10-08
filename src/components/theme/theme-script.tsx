/**
 * Sets the theme class before first paint so there is no flash.
 *
 * The `type` switch keeps React from warning about a <script> rendered on the
 * client: the browser runs it from the server HTML, and on the client it is
 * inert `text/plain`. See Next's "Preventing flash before hydration" guide.
 */
export function ThemeScript() {
  const code = `
(function(){
  try {
    var q = new URLSearchParams(location.search).get('theme');
    var s = localStorage.getItem('vibeui-theme');
    var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // ?theme=light|dark wins for shareable previews; otherwise saved choice, then OS.
    var t = q === 'light' || q === 'dark' ? q : (s === 'light' || s === 'dark' ? s : (d ? 'dark' : 'light'));
    if (t === 'dark') document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = t;
  } catch (e) {}
})();`;

  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
