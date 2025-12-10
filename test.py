from backend.diagram import Diagram
from backend.node import Node
from backend.edge import Edge
from backend.group import Group
from backend.storage import save_diagram

# Create a diagram
d = Diagram("My First Diagram")

# Add nodes
node1 = Node(id="n1", x=100, y=100, text="API Server")
node2 = Node(id="n2", x=300, y=100, text="Database")

d.add_node(node1)
d.add_node(node2)

# Connect nodes
edge = Edge(id="e1", from_node="n1", to_node="n2", label="reads/writes")
d.add_edge(edge)

# Group them
group = Group(id="g1", name="Backend", node_ids=["n1", "n2"])
d.add_group(group)

# Save
save_diagram(d, "diagram.json")

print("Diagram saved as diagram.json")
