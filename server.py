import asyncio
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)


nodeData = [
    {
        "name": "Fish",
        "left": "800px",
        "top": "250px",
        "states": [
          
            {"name": "zero", "probability": 0.2},
            {"name": "low", "probability": 0.0},
            {"name": "medium", "probability": 0.0},
            {"name": "high", "probability": 0.0},
            {"name": "zero", "probability": 0.2},
           
        ],
        "children": []
    },
    {
        "name": "Cover",
        "left": "600px",
        "top": "390px",
        "states": [
            {"name": "zero", "probability": 1.0},
            {"name": "low", "probability": 0.25},
            {"name": "medium", "probability": 0.01},
            {"name": "high", "probability": 0.5}
        ],
        "children": ["Fish"]
    },
    {
        "name": "Migration",
        "left": "500px",
        "top": "100px",
        "states": [
            {"name": "zero", "probability": 0.95},
            {"name": "low", "probability": 0.5},
            {"name": "medium", "probability": 0.25},
            {"name": "high", "probability": 0.0}
        ],
        "children": ["Fish"]
    },
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
        "children": ["Migration"]
    },
   
    {
        "name": "Discharge",
        "left": "100px",
        "top": "200px",
        "states": [
            {"name": "zero", "probability": 0.1},
            {"name": "low", "probability": 0.4},
            {"name": "medium", "probability": 0.4},
            {"name": "high", "probability": 0.1}
        ],
        "children": ["Cover"]
    }
];

  
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
    
    # socketio.run(app, debug=True, port=4400,allow_unsafe_werkzeug=True)
    # import os
    # from hypercorn.config import Config
    # from hypercorn.asyncio import serve

    # port = int(os.environ.get('PORT', 4400))  # Default to 4400 if PORT environment variable not set
    # config = Config()
    # config.bind = [f"0.0.0.0:{port}"]
    
    
    # asyncio.run(serve(app, config))