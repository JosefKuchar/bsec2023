from flask import Flask, jsonify, request
from models import db
from flask_cors import CORS
from datetime import datetime
import pandas as pd
from sklearn import linear_model

# create the app
app = Flask(__name__)
CORS(app)
# configure the SQLite database, relative to the app instance folder
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
# initialize the app with the extension
db.init_app(app)

from models import *

@app.route('/', methods=['GET', 'POST'])
def home():
    if (request.method == 'GET'):
        data = "hello world"
        return jsonify({'data': data})

@app.route('/restaurants', methods=['GET'])
def restaurants():
    restaurations = Restaurant.query.all()
    restauration_list = []
    for restauration in restaurations:
        restauration_list.append({
            'id': restauration.id,
            'name': restauration.name
        })
    return jsonify(restauration_list)

@app.route('/food', methods=['GET'])
def restaurants_food():
    if request.method == 'GET':
        param = request.args.get('restaurant_id')
        restaurants_food = Food.query.filter_by(restaurant_id = int(param))
        restaurant = Restaurant.query.filter_by(id=int(param)).first()
        food_list = []
        for food in restaurants_food:
            food_list.append({
                'id': food.id,
                'name': food.name,
                'restaurant': restaurant.name
            })

    return jsonify(food_list)

@app.route('/records', methods=['GET'])
def records():
    if request.method == 'GET':
        records = RecordData.query.all()
        record_list = []
        for record in records:
            json_date = record.datetime.strftime('%Y-%m-%dT%H:%M:%S.%f')
            print(json_date)
            record_list.append({
                'datetime': json_date,
                'initial_value': record.initial_value,
                'after_value': record.after_value,
                'bolus': record.bolus,
                'food_id': record.food_id
            })



    return jsonify(record_list)

@app.route('/newrecord',methods=['POST'])
def new_record():
    if request.method == 'POST':
        data = request.get_json()

        body_datetime =  datetime.strptime(data.get("datetime"),'%Y-%m-%dT%H:%M:%S.%fZ')
        print(body_datetime)
        records = RecordData(datetime=body_datetime,
                                initial_value=data.get("initial_value"),
                                after_value=data.get("after_value"),
                                bolus=data.get("bolus"),
                                food_id=data.get("food_id")
                                )
        db.session.add(records)
        db.session.commit()

    return data

@app.route('/create_restaurant', methods=['POST'])
def create_restaurant():
    data = request.get_json()
    restaurant = Restaurant.query.filter_by(name=data.get("name")).first()
    print(restaurant)
    if not restaurant:
        restaurant = Restaurant(name=data.get("name"))
        db.session.add(restaurant)
        db.session.commit()
    else:
        return "Restaurant is already in database", 400
    return data

@app.route('/create_food', methods=['POST'])
def create_food():
    data = request.get_json()
    food = Food.query.filter_by(name=data.get("name")).first()
    if not food:
        food = Food(name=data.get("name"), restaurant_id=data.get("restaurant_id"))
        db.session.add(food)
        db.session.commit()
    else:
        return "Food is already in database", 400
    return data

@app.route('/add_last_value', methods=['POST'])
def add_last_value():
    data = request.get_json()
    record = RecordData.query.filter_by(id = int(data.get("record_id"))).first()
    record.after_value = data.get("after_value")
    db.session.commit()
    record = RecordData.query.filter_by(id = int(data.get("record_id"))).first()
    reponse = {"changed_value": record.after_value}
    return jsonify(reponse)

@app.route('/calculate_bolus', methods=['POST'])
def calculate_bolus():
    data = request.get_json()

    # add calculation of bolus prediction
    food_records = RecordData.query.filter_by(food_id=data.get("food_id")).all()
    df = pd.DataFrame()
    for record in food_records:
        row = {
            "initial_val": record.initial_value,
            "result": record.after_value,
            "bolus": int(record.bolus)
        }
        df = df.append(row, ignore_index=True)

    X = df[['initial_val', 'result']]
    y = df['bolus']

    regr = linear_model.LinearRegression()
    regr.fit(X, y)

    predicted_bolus = regr.predict([[data.get("initial_value"), 8]])

    data["recommended_bolus"] = round(predicted_bolus[0])

    return data

@app.route('/food_records', methods=['GET'])
def food_records():
    param = request.args.get('food_id')
    food_record = RecordData.query.filter_by(food_id=param).all()
    record_list = []
    for record in food_record:
        record_list.append({
            "datetime": record.datetime,
            "initial_value": record.initial_value,
            "value_2h": record.after_value,
            "bolus": record.bolus
        })

    return jsonify(record_list)

@app.route('/bolus_list', methods=['GET'])
def bolus_list():
    data = request.get_json()

    restaurants_food = Food.query.filter_by(restaurant_id=data.get("restaurant_id"))
    food_list = []
    for food in restaurants_food:
        # add calculation of bolus prediction
        food_records = RecordData.query.filter_by(food_id=food.id).all()
        df = pd.DataFrame()
        if len(food_records) < 3:
            records_all = RecordData.query.all()
            print(records_all)
            for record in records_all:
                row = {
                    "initial_val": record.initial_value,
                    "result": record.after_value,
                    "bolus": int(record.bolus)
                }
                df = df.append(row, ignore_index=True)
        else :
            for record in food_records:
                row = {
                    "initial_val": record.initial_value,
                    "result": record.after_value,
                    "bolus": int(record.bolus)
                }
                df = df.append(row, ignore_index=True)

        X = df[['initial_val', 'result']].values
        y = df['bolus'].values

        regr = linear_model.LinearRegression()
        regr.fit(X, y)

        predicted_bolus = regr.predict([[data.get("initial_value"), 8]])

        food_list.append({
            'id': food.id,
            'name': food.name,
            'recommended_bolus': round(predicted_bolus[0])
        })
    food_list = sorted(food_list, key=lambda k: k['recommended_bolus'])

    return jsonify(food_list)

if __name__ == "__main__":
    app.run(debug=True)
