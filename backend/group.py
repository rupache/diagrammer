class Group:
    def __init__(self, id, name, node_ids=None):
        self.id = id
        self.name = name
        self.node_ids = node_ids if node_ids else []

    def add_node(self, node_id):
        self.node_ids.append(node_id)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "node_ids": self.node_ids
        }
