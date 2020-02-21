from aiohttp import web
import aiohttp_cors

from app.views import get_data, get_coordinates, get_districts
from app.routes import setup_routes


def main():

    app = web.Application()

    cors = aiohttp_cors.setup(app)
    cors.add(
        app.router.add_route("POST", "/get_data", get_data),
        {
            "*": aiohttp_cors.ResourceOptions(
                allow_credentials=True, expose_headers="*", allow_headers="*"
            ),
        },
    )
    cors.add(
        app.router.add_route("POST", "/get_cord", get_coordinates),
        {
            "*": aiohttp_cors.ResourceOptions(
                allow_credentials=True, expose_headers="*", allow_headers="*"
            ),
        },
    )
    cors.add(
        app.router.add_route("POST", "/get_type_heatmap", get_districts),
        {
            "*": aiohttp_cors.ResourceOptions(
                allow_credentials=True, expose_headers="*", allow_headers="*"
            ),
        },
    )

    setup_routes(app)
    web.run_app(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
