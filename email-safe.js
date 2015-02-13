
(function() {
  var encrypted = [250,131,80,83,133,137,211,185,77,101,113,208,42,108,135,17,161,114,215,140,131];
  var key       = [136,236,38,50,240,238,187,215,33,9,18,144,77,1,230,120,205,92,180,227,238];
  var email     = '';

  for (var i = 0; i < encrypted.length; i++) {
    email += String.fromCharCode(encrypted[i] ^ key[i]);
  }

  var anchors = document.getElementsByTagName('a');

  for (var i = 0; i < anchors.length; i++) {
    if ((' ' + anchors[i].className + ' ').indexOf(' email ') !== -1) {
      anchors[i].href = 'mailto:' + email;
    }
  }
})();

