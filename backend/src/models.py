from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Food(db.Model):
    id = db.Column(db.Integer,primary_key=True,nullable=False)
    name = db.Column(db.String(50),primary_key=False, nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurant.id'), nullable=False)
    records = db.relationship('RecordData', backref='food', lazy=True)
class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    food = db.relationship('Food', backref='restaurant', lazy=True)

class RecordData(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    datetime = db.Column(db.DateTime,primary_key = False, nullable=False)
    initial_value = db.Column(db.Float,primary_key = False, nullable=False)
    after_value = db.Column(db.Float,primary_key = False, nullable=True)
    bolus = db.Column(db.String(20),primary_key = False, nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey('food.id'), nullable=False)