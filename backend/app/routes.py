from .views import get_data, get_coordinates, get_districts


def setup_routes(app):
    app.router.add_post("/get_data", get_data)
    app.router.add_post("/get_cord", get_coordinates)
    app.router.add_post("/get_type_heatmap", get_districts)
