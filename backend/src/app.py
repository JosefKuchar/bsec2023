from flask import Flask, jsonify, request
from models import db
from flask_cors import CORS
from datetime import datetime


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

@app.route('/restaurants', methods=['GET', 'POST'])
def restaurants():
    restaurations = Restaurant.query.all()
    restauration_list = []
    for restauration in restaurations:
        restauration_list.append({
            'id': restauration.id,
            'name': restauration.name
        })
    return jsonify(restauration_list)

@app.route('/food', methods=['GET', 'POST'])
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

@app.route('/records', methods=['GET', 'POST'])
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

@app.route('/newrecord',methods=['GET','POST'])
def new_record():
    if request.method == 'POST':
        data = request.get_json()

        body_datetime =  datetime.strptime(data.get("datetime"),'%Y-%m-%dT%H:%M:%S.%f')
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

if __name__ == "__main__":
    app.run(debug=True)
