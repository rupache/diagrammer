class Edge:
    def __init__(self, id, from_node, to_node, label=""):
        self.id = id
        self.from_node = from_node
        self.to_node = to_node
        self.label = label

    def to_dict(self):
        return {
            "id": self.id,
            "from": self.from_node,
            "to": self.to_node,
            "label": self.label
        }
