from flask import Flask, request, jsonify, render_template, send_from_directory, send_file
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
            label['comments'] = data['comments']
            break
    else:
        labels.append(data)
    save_labels(labels)
    return jsonify(success=True)

@app.route('/videos/<path:filename>')
def videos(filename):
    return send_from_directory(VIDEOS_FOLDER, filename)

@app.route('/get_videos', methods=['GET'])
def get_videos():
    video_files = [f for f in os.listdir(VIDEOS_FOLDER) if f.endswith('.mp4')]
    return jsonify(video_files)

@app.route('/get_labels', methods=['GET'])
def get_labels():
    if os.path.exists(LABELS_FILE):
        try:
            with open(LABELS_FILE, 'r') as file:
                return send_file(LABELS_FILE, mimetype='application/json')
        except:
            return jsonify([])
    return jsonify([])

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)
