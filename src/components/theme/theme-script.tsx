/** Inline script to prevent flash of wrong theme before hydration */
export function ThemeScript() {
  const code = `
(function(){
  try {
    var k = 'vibeui-theme';
    var s = localStorage.getItem(k);
    var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var t = s === 'light' || s === 'dark' ? s : (d ? 'dark' : 'light');
    if (t === 'dark') document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = t;
  } catch (e) {}
})();`;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
