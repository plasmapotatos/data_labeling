const videoPlayer = document.getElementById('videoPlayer');
const videoNameElement = document.getElementById('videoName');
let videoFiles = [];
let currentIndex = 0;
let labels = [];

window.onload = () => {
    console.log('Page loaded');
    fetch('/get_videos')
        .then(response => response.json())
        .then(data => {
            videoFiles = data.map(filename => `/videos/${filename}`);
            if (videoFiles.length > 0) {
                updateVideo();
            } else {
                alert('No videos found.');
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
};

function updateVideo() {
    if (videoFiles.length > 0) {
        videoPlayer.src = videoFiles[currentIndex];
        videoPlayer.load();
        const videoName = videoFiles[currentIndex].split('/').pop();
        videoNameElement.textContent = `Video: ${videoName}`;
    }
}

function labelVideo(category) {
    const videoName = videoFiles[currentIndex].split('/').pop();
    // Update the label for the current video
    labels[currentIndex] = { name: videoName, category: category };
    saveLabels();
    nextVideo();
}

function saveLabels() {
    fetch('/save_label', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(labels[currentIndex])
    }).then(response => {
        if (response.ok) {
            console.log('Label saved');
        }
    });
}

function nextVideo() {
    currentIndex++;
    if (currentIndex < videoFiles.length) {
        updateVideo();
    } else {
        alert('All videos have been labeled!');
    }
}

function previousVideo() {
    if (currentIndex > 0) {
        currentIndex--;
        updateVideo();
    } else {
        alert('This is the first video.');
    }
}
