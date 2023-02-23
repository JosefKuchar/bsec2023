from flask import Flask, jsonify, request
from models import db
from flask_cors import CORS



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
                'sacharids': food.sacharids,
                'restaurant': restaurant.name
            })

    return jsonify(food_list)

@app.route('/records', methods=['GET', 'POST'])
def records():
    if request.method == 'GET':
        records = RecordData.query.all()
        record_list = []
        for record in records:
            record_list.append({
                'datetime': record.datetime,
                'initial_value': record.initial_value,
                'after_value': record.after_value,
                'bolus': record.bolus,
                'restaurant_id': record.restaurant_id,
                'food_id': record.food_id
            })

    return jsonify(record_list)

if __name__ == "__main__":
    app.run(debug=True)