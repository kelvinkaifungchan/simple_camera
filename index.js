$(function () {

    let cameraStream;
    let recorder;
    let recorded = []

    $("#start").on("click", async function () {
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            $("#video")[0].srcObject = cameraStream;
        } catch (err) {
            console.log(err);
        }
    })

    $("#stopCamera").on("click", async function () {
        try {
            cameraStream.getTracks().forEach(function (track) {
                if (track.readyState === 'live' && track.kind === 'video') {
                    track.stop()
                }
            })
        } catch (err) {
            console.log(err);
        }
    })

    $("#stopMicrophone").on("click", async function () {
        try {
            cameraStream.getTracks().forEach(function (track) {
                if (track.readyState === 'live' && track.kind === 'audio') {
                    track.stop()
                }
            })
        } catch (err) {
            console.log(err);
        }
    })

    $("#startRecording").on("click", function () {
        $("#recording").css("display", "inline")
        recorder = new MediaRecorder(cameraStream, {mimeType: 'video/webm'});
        recorder.ondataavailable = function(e) {
            recorded.push(e.data)
        }
        recorder.onstop = function(e) {
            let videoLocal = URL.createObjectURL(new Blob(recorded, {type: 'video/webm'}));
            $("#download").attr("href", videoLocal)
            console.log("URL", videoLocal)
        }
        recorder.start(1000);
    })

    $("#stopRecording").on("click", function() {
        $("#recording").css("display", "none")
        recorder.stop();
    })



});