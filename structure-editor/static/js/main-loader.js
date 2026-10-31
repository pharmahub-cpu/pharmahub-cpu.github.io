(function(){
  var base = (document.currentScript && document.currentScript.src)
    ? document.currentScript.src.replace(/[^/]*$/, '')
    : './';
  var parts = [
    'main.37703a68.part1.bin',
    'main.37703a68.part2.bin',
    'main.37703a68.part3.bin'
  ];
  Promise.all(parts.map(function(p){
    return fetch(base + p).then(function(r){
      if (!r.ok) throw new Error('Failed to fetch ' + p + ': ' + r.status);
      return r.arrayBuffer();
    });
  })).then(function(buffers){
    var total = buffers.reduce(function(sum, b){ return sum + b.byteLength; }, 0);
    var combined = new Uint8Array(total);
    var offset = 0;
    buffers.forEach(function(b){
      combined.set(new Uint8Array(b), offset);
      offset += b.byteLength;
    });
    var blob = new Blob([combined], {type: 'text/javascript'});
    var url = URL.createObjectURL(blob);
    var s = document.createElement('script');
    s.src = url;
    s.onload = function(){ URL.revokeObjectURL(url); };
    s.onerror = function(e){ console.error('structure editor bundle failed to execute', e); };
    document.body.appendChild(s);
  }).catch(function(err){
    console.error('Failed to load structure editor bundle:', err);
  });
})();
