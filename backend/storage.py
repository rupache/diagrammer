import json

def save_diagram(diagram, filename):
    with open(filename, "w") as f:
        json.dump(diagram.to_dict(), f, indent=4)

def load_diagram(filename):
    with open(filename, "r") as f:
        return json.load(f)
