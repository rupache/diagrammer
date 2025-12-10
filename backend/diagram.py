from .canvas import Canvas
from .node import Node
from .edge import Edge
from .group import Group

class Diagram:
    def __init__(self, name):
        self.name = name
        self.canvas = Canvas()
        self.nodes = {}
        self.edges = {}
        self.groups = {}

    def add_node(self, node):
        self.nodes[node.id] = node

    def add_edge(self, edge):
        self.edges[edge.id] = edge

    def add_group(self, group):
        self.groups[group.id] = group

    def to_dict(self):
        return {
            "name": self.name,
            "canvas": self.canvas.to_dict(),
            "nodes": {id: node.to_dict() for id, node in self.nodes.items()},
            "edges": {id: edge.to_dict() for id, edge in self.edges.items()},
            "groups": {id: group.to_dict() for id, group in self.groups.items()}
        }
