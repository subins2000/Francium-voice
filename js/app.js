function restore(){
  $("#record, #live").removeClass("disabled");
  $("#pause").replaceWith('<a class="button one" id="pause">Pause</a>');
  $(".one").addClass("disabled");
  Fr.voice.stop();
}
$(document).ready(function(){
  $(document).on("click", "#record:not(.disabled)", function(){
    elem = $(this);
    Fr.voice.record($("#live").is(":checked"), function(){
      elem.addClass("disabled");
      $("#live").addClass("disabled");
      $(".one").removeClass("disabled");
      
      /**
       * The Waveform canvas
       */
      analyser = Fr.voice.context.createAnalyser();
      analyser.fftSize = 2048;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.85;
      Fr.voice.input.connect(analyser);
      
      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);
      
      WIDTH = 500, HEIGHT = 200;
      canvasCtx = $("#level")[0].getContext("2d");
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      
      function draw() {
        drawVisual = requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
  
        canvasCtx.beginPath();
        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;
        for(var i = 0; i < bufferLength; i++) {
          var v = dataArray[i] / 128.0;
          var y = v * HEIGHT/2;
  
          if(i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
  
          x += sliceWidth;
        }
        canvasCtx.lineTo(WIDTH, HEIGHT/2);
        canvasCtx.stroke();
      };
      draw();
    });
  });
  
  $(document).on("click", "#pause:not(.disabled)", function(){
    if($(this).hasClass("resume")){
      Fr.voice.resume();
      $(this).replaceWith('<a class="button one" id="pause">Pause</a>');
    }else{
      Fr.voice.pause();
      $(this).replaceWith('<a class="button one resume" id="pause">Resume</a>');
    }
  });
  
  $(document).on("click", "#stop:not(.disabled)", function(){
    restore();
  });
  
  $(document).on("click", "#play:not(.disabled)", function(){
    Fr.voice.export(function(url){
      $("#audio").attr("src", url);
      $("#audio")[0].play();
    }, "URL");
    restore();
  });
  
  $(document).on("click", "#download:not(.disabled)", function(){
    Fr.voice.export(function(url){
      $("<a href='"+url+"' download='MyRecording.wav'></a>")[0].click();
    }, "URL");
    restore();
  });
  
  $(document).on("click", "#base64:not(.disabled)", function(){
    Fr.voice.export(function(url){
      console.log("Here is the base64 URL : " + url);
      alert("Check the web console for the URL");
      
      $("<a href='"+ url +"' target='_blank'></a>")[0].click();
    }, "base64");
    restore();
  });
  
  $(document).on("click", "#mp3:not(.disabled)", function(){
    alert("The conversion to MP3 will take some time (even 10 minutes), so please wait....");
    Fr.voice.export(function(url){
      console.log("Here is the MP3 URL : " + url);
      alert("Check the web console for the URL");
      
      $("<a href='"+ url +"' target='_blank'></a>")[0].click();
    }, "mp3");
    restore();
  });
  
  $(document).on("click", "#save:not(.disabled)", function(){
    Fr.voice.export(function(blob){
      var formData = new FormData();
      formData.append('file', blob);
  
      $.ajax({
        url: "upload.php",
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(url) {
          $("#audio").attr("src", url);
          $("#audio")[0].play();
          alert("Saved In Server. See audio element's src for URL");
        }
      });
    }, "blob");
    restore();
  });
});
