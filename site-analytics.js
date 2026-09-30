(() => {
  // Public site token from Cloudflare Web Analytics > Manage site.
  const token = '08488d67d7fb42c9a9a494a7836daa13';
  const productionHosts = ['louisai.co.uk', 'www.louisai.co.uk'];
  if (!/^[a-f0-9]{32}$/i.test(token) || !productionHosts.includes(location.hostname)) return;
  if (document.querySelector('script[data-cf-beacon]')) return;

  const beacon = document.createElement('script');
  beacon.type = 'module';
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.setAttribute('data-cf-beacon', JSON.stringify({ token }));
  document.head.appendChild(beacon);
})();
