(function($) {
  var ONE_MINUTE = 60 * 1000; // for setTimeout
  var decryptionKey = null;
  var decryptionKeyTimeout = null;

  var exit = function() {
    window.location = window.location;
  };

  var setDecryptionKey = function(key) {
    decryptionKey = key;
    clearTimeout(decryptionKeyTimeout);
    decryptionKeyTimeout = setTimeout(function() {
      decryptionKey = null;
    }, ONE_MINUTE);
  };

  var clearDecryptionKey = function() {
    clearTimeout(decryptionKeyTimeout);
    decryptionKey = null;
  };

  var usernameMunge = function(username) {
    var hash = CryptoJS.SHA1(username.toLowerCase());
    var b32 = CryptoJS.enc.Base32.stringify(hash);
    return b32.toLowerCase();
  };

  var syncKeyToEncKey = function(key, username) {
    key = key
      .replace(/8/g, 'l')
      .replace(/9/g, 'o')
      .replace(/-/g, '');
    key = key.toUpperCase();
    key = CryptoJS.enc.Base32.parse(key);
    key = CryptoJS.HmacSHA256('Sync-AES_256_CBC-HMAC256' + usernameMunge(username) + String.fromCharCode(1), key);
    return key;
  };

  var decryptKey = function(el, key, callback) {
    // We remember the decrypted key for one minute
    if(decryptionKey !== null) {
      callback(decryptionKey);
      return;
    }

    var tries = 0;

    var div = $('<div/>');
    var form = $('<form/>');
    var input = $('<input type="password" placeholder="decrypt" autocomplete="off" autofocus="autofocus">');
    var br = $('<br>');
    var submit = $('<input type="submit" value="submit">');
    form
      .append(input)
      .append(br)
      .append(submit);
    form.on('submit', function(e) {
      e.preventDefault();
      tries++;

      var dec = CryptoJS.AES.decrypt(key, input.val());
      if(dec.toString() != "") {
        div.detach();
        setDecryptionKey(dec.toString(CryptoJS.enc.Utf8));
        callback(decryptionKey);
        return false;
      }

      if(tries == 3)
        exit();

      input.prop('disabled', true);
      submit.prop('disabled', true);
      setTimeout(function() {
        input.val('');
        input.prop('disabled', false);
        submit.prop('disabled', false);
      }, 2000);

      return false;
    });

    div.append(form);
    el.append(div);
    input.focus();
  };

  var decryptRecord = function(record, key) {
    var payload = JSON.parse(record.payload);
    var ciphertext = CryptoJS.enc.Base64.parse(payload.ciphertext);
    var iv = CryptoJS.enc.Base64.parse(payload.IV);

    var decr = CryptoJS.AES.decrypt({
      ciphertext: ciphertext,
    }, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
    });
    decr = decr.toString(CryptoJS.enc.Utf8);
    var i = decr.lastIndexOf('}');
    return JSON.parse(decr.substring(0, i+1));
  };

  var getKey = function(encKey, keyName) {
    var keys = decryptRecord(info.keys, encKey);
    var returnKey = CryptoJS.enc.Base64.parse(keys[keyName][0]);
    return returnKey;
  };

  var addRecord = function(ul, record, defaultKey) {
    var decr = decryptRecord(record, defaultKey);
    if (decr.deleted)
      return;
    var li = $('<li>');
    var a = $('<a href="#">' + decr.hostname + '</a>');
    var timeout = null;

    var show = function(e) {
      e.preventDefault();

      decryptKey(li, info.key, function(key) {
        var username = $('<div class="username">' + decr.username + '</div>');
        var password = $('<div class="password">' + decr.password + '</div>');
        li.append(username).append(password);
        timeout = setTimeout(exit, ONE_MINUTE);
      });

      a.one('click', hide);

      return false;
    };

    var hide = function(e) {
      e.preventDefault();

      li.find('div').detach();
      clearTimeout(timeout);
      clearDecryptionKey();

      a.one('click', show);

      return false;
    };

    a.one('click', show);
    li.append(a);
    ul.append(li);
  };

  $(function() {
    decryptKey($('body'), info.key, function(key) {
      setTimeout(exit, 5 * ONE_MINUTE);
      var encKey = syncKeyToEncKey(key, info.username);
      var defaultKey = getKey(encKey, 'default');
      var ul = $('<ul>');
      info.passwords.forEach(function(record) {
        addRecord(ul, record, defaultKey);
        return;
      });
      $('body').append(ul);
    });
  });
})(jQuery);
