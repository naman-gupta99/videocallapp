let localVideo = document.getElementById("local-video");
let remoteVideo = document.getElementById("remote-video");
let container = document.getElementById("container");

localVideo.style.opacity = 0;
remoteVideo.style.opacity = 0;

localVideo.onplaying = () => {
    localVideo.style.opacity = 1;
};

remoteVideo.onplaying = () => {
    remoteVideo.style.opacity = 1;
};

let peer;
function init(userId) {
    peer = new Peer(userId, {
        host: "ns-video-call.herokuapp.com",
        // port: 443,
        secure: true,
        path: "/peerjs/myapp",
    });

    peer.on("open", () => {
        Android.onPeerConnected();
    });

    listen();
}

let localStream;
let peerCall;

function listen() {
    peer.on("call", (call) => {
        peerCall = call;

        call.on("close", () => {
            localVideo.style.opacity = 0;
            remoteVideo.style.opacity = 0;
            // Stop the video from playing
            remoteVideo.className = "secondary-video";
            localVideo.className = "primary-video";
            remoteVideo.pause();
            remoteVideo.removeAttribute("srcObject");
            localVideo.pause();
            localVideo.removeAttribute("srcObject");
        });

        navigator.getUserMedia(
            {
                audio: true,
                video: true,
            },
            (stream) => {
                localVideo.srcObject = stream;
                localStream = stream;

                call.answer(stream);
                call.on("stream", (remoteStream) => {
                    remoteVideo.srcObject = remoteStream;
                    remoteVideo.className = "primary-video";
                    localVideo.className = "secondary-video";
                });
            }
        );
    });
}

function startCall(otherUserId) {
    navigator.getUserMedia(
        {
            audio: true,
            video: true,
        },
        (stream) => {
            localVideo.srcObject = stream;
            localStream = stream;

            const call = peer.call(otherUserId, stream);

            call.on("stream", (remoteStream) => {
                remoteVideo.srcObject = remoteStream;
                remoteVideo.className = "primary-video";
                localVideo.className = "secondary-video";
            });
        }
    );
}

function toggleVideo(b) {
    if (b == "true") {
        localStream.getVideoTracks()[0].enabled = true;
    } else {
        localStream.getVideoTracks()[0].enabled = false;
    }
}

function toggleAudio(b) {
    if (b == "true") {
        localStream.getAudioTracks()[0].enabled = true;
    } else {
        localStream.getAudioTracks()[0].enabled = false;
    }
}

function toggleFlash(b) {
    if (b == "true") {
        container.style.width = "90vw";
        container.style.height = "90vh";
        container.style.marginTop = "5vh";
        container.style.marginBottom = "5vh";
        container.style.marginLeft = "5vw";
        container.style.marginRight = "5vw";
    } else {
        container.style.width = "100%";
        container.style.height = "100%";
        container.style.marginTop = "0vh";
        container.style.marginBottom = "0vh";
        container.style.marginLeft = "0vw";
        container.style.marginRight = "0vw";
    }
}
