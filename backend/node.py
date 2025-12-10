class Node:
    def __init__(self, id, x, y, width=120, height=60, text="Node", node_type="rectangle"):
        self.id = id
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.text = text
        self.type = node_type

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "x": self.x,
            "y": self.y,
            "width": self.width,
            "height": self.height,
            "text": self.text
        }
