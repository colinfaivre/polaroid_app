const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
        video.srcObject =localMediaStream;
        video.play();
    })
    .catch(err => {
        console.log("Video error :", err)
    })
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    console.log(width, height);
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // Take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        // Mess with pixels
        pixels = sepiaEffect(pixels);
        // Put them back
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
    // Play the sound
    snap.currentTime = 0;
    snap.play();

    // Take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'myPhoto');
    link.textContent = 'Dowload Image';
    link.innerHTML = `<img src="${data}" alt="myPhoto"/>`;
    strip.insertBefore(link, strip.firstChild);
}

function bwEffect(pixels) {
    for(let i = 0; i < pixels.data.length ; i+=4) {
        const rgbAverageColor = (pixels.data[i + 0] + pixels.data[i + 1] + pixels.data[i + 2]) / 3
        pixels.data[i + 0] = rgbAverageColor;
        pixels.data[i + 1] = rgbAverageColor;
        pixels.data[i + 2] = rgbAverageColor;
        // pixels.data[i + 0] = pixels.data[i + 0] * 0.3; // red
        // pixels.data[i + 1] = pixels.data[i + 1] * 0.59; // green
        // pixels.data[i + 2] = pixels.data[i + 2] * 0.11; // blue
    }
    return pixels;
}
function sepiaEffect(pixels) {
    for(let i = 0; i < pixels.data.length ; i+=4) {
        const rgbAverageColor = (pixels.data[i + 0] + pixels.data[i + 1] + pixels.data[i + 2]) / 3
        pixels.data[i + 0] = rgbAverageColor + 30;
        pixels.data[i + 1] = rgbAverageColor + 5;
        pixels.data[i + 2] = rgbAverageColor - 20;
    }
    return pixels;
}

getVideo();
video.addEventListener('canplay', paintToCanvas);