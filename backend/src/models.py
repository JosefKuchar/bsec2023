from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Food(db.Model):
    id = db.Column(db.String,primary_key=True,nullable=False)
    name = db.Column(db.String(50),primary_key=False, nullable=False)
    sacharids = db.Column(db.Integer(100), primary_key=False, nullable=False)

    resurant_id = db.Column(db.String, db.ForeignKey('resaurant.id'),
        nullable=False)

class Restaurant(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    food = db.relationship('food', backref='restaurant', lazy=True)

    recorddata_id = db.Column(db.String, db.ForeignKey('recorddata.id'),
        nullable=False)

class RecordData(db.Model):
    id = db.Column(db.String, primary_key=True, nullable=False)
    date = db.Column(db.String(20),primary_key = False, nullable=False)
    time = db.Column(db.String(20),primary_key = False, nullable=False)
    initial_value = db.Column(db.Float(20),primary_key = False, nullable=False)
    after_value = db.Column(db.Float(20),primary_key = False, nullable=False)
    bolus = db.Column(db.String(20),primary_key = False, nullable=False)

    restaurant = db.relationship('restaurant', backref='restaurant', lazy=True)
    food = db.relationship('food', backref='recorddata', lazy=True)
