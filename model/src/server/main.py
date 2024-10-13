from flask import Flask, jsonify, request
from flask_cors import CORS
from model.src.server.pipeline import Pipeline

app = Flask(__name__) # create app instance
CORS(app)  # This will enable CORS for all routes

pipeline = Pipeline()

@app.route('/api/v1', methods=['POST'])
def generate_result():
    url = request.json["url"]
    data = pipeline.process(url)

    return data

if __name__ == '__main__':
    app.run(host='192.168.0.137', port=5002)