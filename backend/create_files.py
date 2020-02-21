import geopandas
import folium

from mongo import Mongo


def create_file():
    import branca

    DIR_FOR_MAPS = f"./data"

    districts_types = [
        "Amusement Arcade",
        "Amusement Device Permanent",
        "Amusement Device Portable",
        "Amusement Device Temporary",
        "Auction House Premises",
        "Bingo Game Operator",
        "Car Wash",
        "Dealer In Products",
        "Debt Collection Agency",
        "Electronic & Appliance Service",
        "Electronic Cigarette Dealer",
        "Electronics Store",
        "Employment Agency",
        "Games of Chance",
        "Gaming Cafe",
        "Garage",
        "Garage and Parking Lot",
        "Home Improvement Contractor",
        "Horse Drawn Cab Owner",
        "Laundries",
        "Newsstand",
        "Parking Lot",
        "Pawnbroker",
        "Pool or Billiard Room",
        "Process Serving Agency",
        "Scale Dealer Repairer",
        "Scrap Metal Processor",
        "Secondhand Dealer - Auto",
        "Secondhand Dealer - General",
        "Sidewalk Cafe",
        "Sightseeing Bus",
        "Special Sale",
        "Stoop Line Stand",
        "Storage Warehouse",
        "Ticket Seller Business",
        "Tobacco Retail Dealer",
        "Tow Truck Company",
    ]

    """
    nilpop - GeoPandasDataFrame with data
    """

    def scale_column(col):
        max_ = col.max()
        min_ = col.min()
        if max_ - min_ == 0:
            return 1
        return (col - min_) / (max_ - min_)

    def delete_indefined(population):
        if population < 0:
            return None
        else:
            return population

    def generate_html(nilpop, filepath):
        mymap = folium.Map(location=[40.715, -73.905], zoom_start=10.5, tiles=None)
        folium.TileLayer(
            "CartoDB positron", name="Districts Type HeatMap", control=False
        ).add_to(mymap)

        highlight_function = lambda x: {
            "fillColor": "#000000",
            "color": "#000000",
            "fillOpacity": 0.50,
            "weight": 0.1,
        }

        colorscale = branca.colormap.linear.YlOrRd_09.scale(0, 5e1)

        def style_function(feature):
            employed = nilpop.get(
                feature["properties"]["person_business_density"], None
            )
            #     nilpop['person_business_density']
            return {
                "fillOpacity": 0.4,
                "weight": 0,
                "fillColor": "#black" if employed is None else colorscale(employed),
                "color": "#000000",
                "fillOpacity": 0.1,
                "weight": 0.0,
            }

        mymap.choropleth(
            geo_data=nilpop,
            name="Choropleth",
            data=nilpop,
            columns=["ID_DISTICT", "person_business_density"],
            key_on="feature.properties.ID_DISTICT",
            fill_color="PuRd",
            nan_fill_color="white",
            # threshold_scale=myscale,
            # bins=colorscale,
            fill_opacity=1,
            line_opacity=0.2,
            legend_name="Person Business Density",
            smooth_factor=0,
        )

        NIL = folium.features.GeoJson(
            nilpop,
            style_function=style_function,
            control=False,
            highlight_function=highlight_function,
            tooltip=folium.features.GeoJsonTooltip(
                fields=[
                    "ID_DISTICT",
                    "NAME_DISTICT",
                    "population",
                    "area",
                    "type",
                    "quantity",
                    "person_business_density",
                ],
                aliases=[
                    "District Code: ",
                    "District Name: ",
                    "Dictrict population: ",
                    "District Area:",
                    "Type of Business",
                    "quantity",
                    "Person/Business density: ",
                ],
                style=(
                    "background-color: white; color: #333333; font-family: arial; font-size: 13px; padding: 10px;"
                ),
            ),
        )

        mymap.add_child(NIL)
        mymap.keep_in_front(NIL)
        folium.LayerControl().add_to(mymap)

        with open(filepath, "w+"):
            print(f"Creating file...  {filepath}")

        mymap.save(outfile=filepath)

    def generator(dir_):
        mongo = Mongo(
            db_name="CityNY",
            coll_name="community_districts",
            uri="mongodb://95.183.13.86:27017",
        )
        com_dist = mongo.mongo_to_dateframe(["district", "district_name", "population"])
        com_dist.columns = ["ID_DISTICT", "NAME_DISTICT", "population"]

        #     mongo = Mongo(db_name='CityNY', coll_name='today_dist', uri='mongodb://95.183.13.86:27017')
        #     total_dist_df = mongo_total_dist.mongo_to_dateframe(['district', 'district_name', 'quantity' ])

        nill = geopandas.read_file("community_dist.json")
        nill = nill[["BoroCD", "geometry", "Shape__Area"]]

        nill.columns = ["ID_DISTICT", "geometry", "area"]
        nilpop = nill.merge(com_dist, on="ID_DISTICT")

        mongo = Mongo(
            db_name="CityNY", coll_name="today_dist", uri="mongodb://95.183.13.86:27017"
        )
        #     mongo.mongo_to_dateframe(self, cols, response={})

        nilpop["population"] = nilpop["population"].apply(delete_indefined)

        for dist_type in districts_types:
            #         dist_type = districts_types[1]
            try:
                typed_today_df = mongo.mongo_to_dateframe(
                    ["district", "type", "quantity"], response={"type": dist_type}
                )

                typed_today_df.columns = ["ID_DISTICT", "type", "quantity"]
                tmp_df = nilpop.merge(typed_today_df, on="ID_DISTICT")

                tmp_df["person_business_density"] = (
                    tmp_df["quantity"] / tmp_df["population"]
                )

                tmp_df["person_business_density"] = scale_column(
                    tmp_df["person_business_density"]
                )

                generate_html(tmp_df, f"{dir_}/NY_{dist_type}.html")

                print(f"{dist_type}: done")
            except:
                print(f"{dist_type}: failed")

    #         return tmp_df

    generator(DIR_FOR_MAPS)
