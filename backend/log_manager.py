from datetime import datetime
from threading import Lock

outputs = {}
outputs_lock = Lock()

class Event:
    def __init__(self, timestamp, data):
        self.timestamp = timestamp
        self.data = data

def append_event(input_id, data):
    with outputs_lock:
        if input_id not in outputs:
            outputs[input_id] = Output(input_id)
        
        event = Event(timestamp=datetime.now(), data=str(data))
        outputs[input_id].events.append(event)

class Output:
    def __init__(self, input_id):
        self.input_id = input_id
        self.status = "STARTED"
        self.result = None
        self.events = []