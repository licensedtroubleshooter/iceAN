from pymongo import MongoClient
import pandas as pd
import datetime


class Mongo:
    def __init__(
        self,
        user="user",
        password="user",
        host="127.0.0.1:27017",
        db_name="osm_russia",
        coll_name=None,
        uri="",
    ):
        if uri == "":
            uri = f"mongodb://{user}:{password}@{host}"

        self.table = MongoClient(uri)[db_name]
        if coll_name is not None:
            self.coll = self.table[coll_name]
        else:
            self.coll = None

    def set_collection(self, coll_name):
        self.coll = self.table[coll_name]

    def insert_json(self, json):
        self.coll.insert_many(json)

    def get_collection(self):
        return self.coll

    def dell_coll(self):
        self.coll.drop_indexes()
        self.coll.delete_many({})

    def mongo_to_dateframe(self, cols, response={}):
        result = self.coll.find(response)
        # print(len(result))

        df = pd.DataFrame(columns=cols)

        def object_to_row(obj):
            row = []
            for col in cols:
                try:
                    row.append(obj[col])
                except:
                    row.append("undefined")
            return row

        for obj in result:
            df.loc[-1] = object_to_row(obj)
            df.index += 1
        return df

    def get_data_timerange(
        self, from_date, till_date, date_format="%Y-%m-%d", json_out=True
    ):
        result = self.coll.find(
            {
                "ds": {
                    "$gt": datetime.strptime(from_date, date_format),
                    "$lt": datetime.strptime(till_date, date_format),
                }
            }
        )
