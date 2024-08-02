from flask import Flask, request, jsonify, render_template, send_from_directory
import json
import os

app = Flask(__name__)

LABELS_FILE = 'labels.json'
VIDEOS_FOLDER = 'videos'

def load_labels():
    if os.path.exists(LABELS_FILE):
        try:
            with open(LABELS_FILE, 'r') as file:
                return json.load(file)
        except:
            return []
    return []

def save_labels(labels):
    with open(LABELS_FILE, 'w') as file:
        json.dump(labels, file, indent=4)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save_label', methods=['POST'])
def save_label():
    data = request.json
    labels = load_labels()
    # Replace existing label if it exists
    for label in labels:
        if label['name'] == data['name']:
            label['category'] = data['category']
            break
    else:
        labels.append(data)
    save_labels(labels)
    return jsonify(success=True)

@app.route('/videos/<path:filename>')
def videos(filename):
    return send_from_directory('videos', filename)

@app.route('/get_videos', methods=['GET'])
def get_videos():
    video_files = [f for f in sorted(os.listdir(VIDEOS_FOLDER)) if f.endswith('.mp4')]
    return jsonify(video_files)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)
