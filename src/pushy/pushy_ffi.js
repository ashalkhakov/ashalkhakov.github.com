var pushy_container_id = 'container';

function pushy_load() {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = '/js/pushy.js';
  document.body.appendChild(s);
}
