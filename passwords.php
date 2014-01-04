<!doctype html>
<html>
  <head>
    <title>pw</title>
    <meta charset='UTF-8'>
    <style type='text/css'>
      body {
        text-align: center;
      }

      input {
        font-size: 20px;
        margin: 10px 0;
      }

      ul {
        margin: 0;
        padding: 0;
      }

      li {
        font-family: monospace;
        list-style: none;
        border-bottom: 1px solid gray;
      }

      li a {
        color: black;
        text-decoration: none;
        display: block;
        padding: 10px;
      }

      li a:hover {
        background-color: #eee;
      }

      div.password {
        margin-bottom: 10px;
      }
    </style>
    <script src='//crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/aes.js' type='text/javascript'></script>
    <script src='//crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/sha1.js' type='text/javascript'></script>
    <script src='//crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/hmac-sha256.js' type='text/javascript'></script>
    <script src='enc-base32.js' type='text/javascript'></script>
    <script src='//code.jquery.com/jquery-2.0.3.min.js' type='text/javascript'></script>
    <script src='script.js' type='text/javascript'></script>
    <script type='text/javascript'>
      var info = <? echo json_encode($info); ?>;
    </script>
  </head>
  <body>
  </body>
</html>
