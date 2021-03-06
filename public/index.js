$(function () {

    let cameraStream;
    let recorder;
    let blob;
    let recorded = [];
    let number = 0;

    let recordingFunction = 0;
    $("#recordingButton").click(function () {
        if (recordingFunction == 0) {
            $(".recording").css("display", "inline");
            $("#recordingButton").css("opacity", "0.2");
            $("#recordingButton").html("<em>Recording</em>");
            recordingFunction = 1;
        } else if (recordingFunction == 1) {
            $(".recording").css("display", "none");
            $("#recordingButton").css("opacity", "1");
            $("#recordingButton").html("Recording");
            recordingFunction = 0;
        }
    })
    
    $.get("http://localhost:3000/save", function (data) {
        for (i = 0; i < data.length; i++) {
            $("tbody").append(
                `<tr>
            <td class="filename" id="${data[i]}"><i>${data[i]}</i></td>
            </tr>
            `
            )
        }
    })

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
        recorder = new MediaRecorder(cameraStream, {
            mimeType: 'video/webm'
        });
        recorder.ondataavailable = function (e) {
            recorded.push(e.data)
        }
        recorder.onstop = function (e) {
            blob = new Blob(recorded, {
                type: 'video/webm'
            });
            console.log("this is the blob", blob);
            let videoLocal = URL.createObjectURL(new Blob(recorded, {
                type: 'video/webm'
            }));
            $("#download").attr("href", videoLocal)
            console.log("URL", videoLocal)
        }
        recorder.start(1000);
    })

    $("#stopRecording").on("click", function () {
        $("#recording").css("display", "none")
        recorder.stop();
    })

    $("#saveRecording").on("click", function () {
        let formData = new FormData();
        formData.append("file", blob, `${number}.mp4`);
        number += 1;
        $.ajax({
            url: "http://localhost:3000/save",
            type: "POST",
            data: formData,
            cache: false,
            contentType: false,
            processData: false
        })
    })

    $("#uploadRecording").on("click", function () {
        let formData = new FormData();
        formData.append("file", blob, `${number}.webm`);
        number += 1;
        $.ajax({
            url: "http://localhost:3000/upload",
            type: "POST",
            data: formData,
            cache: false,
            contentType: false,
            processData: false
        })
    })

});