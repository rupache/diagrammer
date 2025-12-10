class Canvas:
    def __init__(self, width=2000, height=2000, background="#ffffff", grid=10):
        self.width = width
        self.height = height
        self.background = background
        self.grid = grid

    def to_dict(self):
        return {
            "width": self.width,
            "height": self.height,
            "background": self.background,
            "grid": self.grid
        }
