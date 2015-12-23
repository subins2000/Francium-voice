<?php
/**
 * Request has Base64 Data
 * -----------------------
 * $_POST['audio'] is the Base64 encoded value of audio (WAV/MP3)
 */
if(isset($_POST['audio'])){
  $audio = base64_decode($_POST['audio']);
  
  echo $audio;
}

/**
 * Request has BLOB Data
 * ---------------------
 */
if(isset($_FILES['file'])){
  $audio = file_get_contents($_FILES['file']['tmp_name']);
  
  require_once __DIR__ . "/db.php";
  $sql = $dbh->prepare("INSERT INTO `uploads` (`audio`) VALUES(?)");
  $sql->execute(array($audio));
  
  $sql = $dbh->query("SELECT `id` FROM `uploads` ORDER BY `id` DESC LIMIT 1");
  $id = $sql->fetchColumn();
  
  echo "play.php?id=$id";
}
