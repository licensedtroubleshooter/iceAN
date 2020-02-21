from fbprophet import Prophet
import pandas as pd
import json
from pymongo import MongoClient
import datetime
from fbprophet.diagnostics import cross_validation
from fbprophet.diagnostics import performance_metrics


def datetime_format(series):
    return pd.to_datetime(series).dt.strftime("%d.%m.%Y")


def save_dataframe_to_mongo(df, collection, datetime_cols=[]):
    for dt_col in datetime_cols:
        df[dt_col] = datetime_format(df[dt_col])
    records = json.loads(df.T.to_json()).values()
    for row in records:
        for dt_col in datetime_cols:
            row[dt_col] = datetime.datetime.strptime(row[dt_col], "%d.%m.%Y")

    coll = collection
    coll.insert_many(records)
    return records


if __name__ == "__main__":
    client = MongoClient("95.183.13.86:27017", 27017)
    db = MongoClient("95.183.13.86:27017")["CityNY"]
    types = client["CityNY"].get_collection("history").distinct("type")
    problems = []
    for type in types:
        history = db.get_collection("history_new").aggregate(
            pipeline=[
                {"$match": {"type": type, "ds": {"$lte": datetime.datetime.today()}}},
                {"$group": {"_id": "$ds", "count": {"$sum": 1}}},
                {"$sort": {"_id": 1}},
            ]
        )
        df = pd.DataFrame()
        for doc in history:
            df = df.append({"ds": doc["_id"], "y": doc["count"]}, ignore_index=True)

        models = [
            Prophet(
                n_changepoints=cp,
                changepoint_range=0.8 + cr * 0.1,
                changepoint_prior_scale=cpc * 0.001,
            )
            for cp in range(10, 26, 5)
            for cr in range(0, 2, 1)
            for cpc in range(1, 101, 20)
        ]

        mses = []
        for model in models:
            model.fit(df)
            try:
                df_cv = cross_validation(
                    model, initial="270 days", period="60 days", horizon="90 days"
                )
                df_p = performance_metrics(df_cv, rolling_window=1)
                mses.append(df_p["mse"].values[0])
            except:
                break

        try:
            ind = mses.index(min(mses))
            future = models[ind].make_future_dataframe(365)
            frcs = models[ind].predict(future)
            ds = frcs["ds"].tail(365).values
            y = frcs["yhat"].tail(365).values
            yl = frcs["yhat_lower"].tail(365).values
            yu = frcs["yhat_upper"].tail(365).values
            t = [type for i in range(365)]
            df_res = pd.DataFrame(
                {"ds": ds, "y": y, "ylower": yl, "yupper": yu, "type": t}
            )
            save_dataframe_to_mongo(df_res, client['CityNY'].get_collection('future'), ['ds'])
        except:
            problems.append(type)
            continue

    print("problems with ", problems)