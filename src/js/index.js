async function initialiseCamera(videoElement) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
  } catch (error) {
    console.error("Error accessing the camera:", error);
  }
}

function capturePhoto(videoElement, canvasElement, shouldThisBeGreyscale) {
  canvasElement.classList.remove("active");

  setTimeout(function () {

    const ctx = canvasElement.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    if (shouldThisBeGreyscale) {
      applyGrayscaleFilter(canvasElement);
    }

    canvasElement.classList.add("active");
    return canvasElement.toDataURL('image/jpeg');
  }, 1000)

}

function applyGrayscaleFilter(canvasElement) {
  const ctx = canvasElement.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;     // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }
  ctx.putImageData(imageData, 0, 0);
}

function reset(canvasElement) {
  canvasElement.classList.remove("active");

  setTimeout(() => {
    const ctx = canvasElement.getContext('2d');
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  }, 1000);
}

async function cameraApp() {
  let isGrey = true;

  const video = document.querySelector("video");
  const canvas = document.querySelector("canvas");
  const shutter = document.querySelector("button.camera-shutter");
  const resetButton = document.querySelector("button.camera-reset");

  const greyscale = document.querySelector("input.greyscale");

  await initialiseCamera(video);

  shutter.addEventListener("click", function (event) {
    capturePhoto(video, canvas, isGrey)
  })

  resetButton.addEventListener("click", function (event) {
    reset(canvas)
  })

  greyscale.addEventListener("input", function (event) {
    isGrey = !isGrey;
  })
}

cameraApp();
