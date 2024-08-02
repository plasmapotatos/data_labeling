const videoPlayer = document.getElementById('videoPlayer');
const videoNameElement = document.getElementById('videoName');
const videoIndexInput = document.getElementById('videoIndex');
const labelContainer = document.getElementById('labelContainer');
let videoFiles = [];
let currentIndex = 0;
let labels = [];

window.onload = () => {
    console.log('Page loaded');
    fetch('/get_videos')
        .then(response => response.json())
        .then(data => {
            videoFiles = data.map(filename => `/videos/${filename}`);
            // Sort video files numerically based on the number in the filename
            videoFiles.sort((a, b) => {
                const getNumber = (str) => {
                    const match = str.match(/video_\((\d+)\)/);
                    return match ? parseInt(match[1], 10) : 0;
                };
                return getNumber(a) - getNumber(b);
            });
            if (videoFiles.length > 0) {
                updateVideo();
            } else {
                alert('No videos found.');
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

    fetch('/static/labels.json')
        .then(response => response.json())
        .then(data => {
            labels = data;
            updateLabelContainer();
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
            // Refresh the labeled videos
            updateLabelContainer();
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

function goToVideo() {
    const index = parseInt(videoIndexInput.value, 10);
    if (isNaN(index) || index < 1 || index > videoFiles.length) {
        alert('Invalid index. Please enter a number between 1 and ' + videoFiles.length);
        return;
    }
    currentIndex = index - 1; // Convert to 0-based index
    updateVideo();
}

function updateLabelContainer() {
    labelContainer.innerHTML = '<h2>Labeled Videos</h2>'; // Clear existing content
    labels.forEach(label => {
        const labelItem = document.createElement('div');
        labelItem.classList.add('label-item');
        const videoImage = document.createElement('img');
        videoImage.src = `/videos/${label.name}`; // Thumbnail or a placeholder image
        videoImage.alt = label.name;
        const videoText = document.createElement('span');
        videoText.textContent = `${label.name}: ${label.category}`;
        labelItem.appendChild(videoImage);
        labelItem.appendChild(videoText);
        labelContainer.appendChild(labelItem);
    });
}
