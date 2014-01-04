<?php

require_once('sync.php');
require_once('keysandurls.php');

$displayForm = true;

function getInfo($KEYS, $URLS) {
  if(!isset($_POST['username']))
    return false;

  $username = $_POST['username'];
  $password = $_POST['password'];

  if(!array_key_exists($username, $KEYS) or !array_key_exists($username, $URLS))
    return false;

  $key = $KEYS[$username];
  $base = $URLS[$username];
  $sync = new Firefox_Sync($username, $password, null, $base);

  try {
    $keys = $sync->collection_raw('crypto/keys');
    $passwords = $sync->collection_raw('passwords');
  } catch(Exception $e) {
    return false;
  }

  $result = array(
    "username" => $username,
    "key" => $key,
    "keys" => $keys,
    "passwords" => $passwords,
  );

  return $result;
}

$info = getInfo($KEYS, $URLS);

if($info === false)
  include("form.php");
else
  include("passwords.php");

