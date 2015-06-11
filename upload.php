<?php
/**
 * $_POST['audio'] is the Base64 encoded value of audio (WAV/MP3)
 */
if(isset($_POST['audio'])){
  $audio = base64_decode($_POST['audio']);
  
  echo $audio;
}
