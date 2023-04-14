from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

DATA_FILE = "items.json"

@app.route("/items", methods=["GET"])
def get_items():
    with open(DATA_FILE, "r") as file:
        data = json.load(file)
    return jsonify(data)

@app.route("/items", methods=["PUT"])
def update_items():
    items = request.get_json()
    with open(DATA_FILE, "w") as file:
        json.dump(items, file)
    return jsonify({"status": "success"})

if __name__ == "__main__":
    app.run(debug=True)
