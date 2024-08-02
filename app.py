from flask import Flask, request, jsonify, render_template
import json
import os

app = Flask(__name__)

LABELS_FILE = 'labels.json'

def load_labels():
    if os.path.exists(LABELS_FILE):
        with open(LABELS_FILE, 'r') as file:
            return json.load(file)
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
    labels.append(data)
    save_labels(labels)
    return jsonify(success=True)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
