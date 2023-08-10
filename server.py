from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)


nodeData = [
    {
        "name": "Barrier",
        "left": "300px",
        "top": "300px",
        "states": [
            {"name": "none", "probability": 0.3},
            {"name": "some", "probability": 0.5},
            {"name": "many", "probability": 0.2},
            {"name": "huge", "probability": 0.2}
        ],
        "parents": []
    },
    {
        "name": "Cover",
        "left": "600px",
        "top": "390px",
        "states": [
            {"name": "zero", "probability": 0.1},
            {"name": "low", "probability": 0.7},
            {"name": "medium", "probability": 0.1},
            {"name": "high", "probability": 0.7}
        ],
        "parents": ["Barrier"]
    },
    # ... other node data entries ...
]

@app.route("/")
def hello_world():
    return render_template("main.html")

@socketio.on('connect')
def on_connect():
    print('A client connected')

@socketio.on('disconnect')
def on_disconnect():
    print('A client disconnected')

@socketio.on('client_message')
def handle_client_message(data):
    print('Received from client:', data['message'])
    # Here you can process the data or send a response back to the client
    # For example:
    response_message = 'Message received on the server!'
    emit('server_message', {'message': response_message})


@socketio.on('request_node_data')
def send_node_data():
    emit('node_data', {'data': nodeData})


@socketio.on('update_node_data')
def handle_update_node_data(data):
    updated_node_data = data['data']
    global nodeData
    nodeData = updated_node_data
    # Emit the updated data to all connected clients
    emit('node_data', {'data': nodeData}, broadcast=True)
    
if __name__ == "__main__":
    socketio.run(app, debug=True, host='0.0.0.0', port=4400)
