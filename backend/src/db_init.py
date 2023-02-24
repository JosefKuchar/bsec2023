import csv
from app import *
from models import RecordData, Restaurant, Food
from datetime import datetime, timedelta

with app.app_context():
    db.drop_all()
    db.create_all()
    with open("./data/data.csv", encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            datetime_csv = row['\ufeffDate'] + ' ' + row['Time']
            datetime_csv = datetime.strptime(datetime_csv,"%d-%m-%y %H:%M")
            datetime_csv = datetime_csv - timedelta(hours=1)
            restaurant = Restaurant.query.filter_by(name=row['Restaurant']).first()
            if not restaurant:
                restaurant = Restaurant(name=row["Restaurant"])
                db.session.add(restaurant)
                db.session.commit()
            restaurant = Restaurant.query.filter_by(name=row['Restaurant']).first()
            food = Food.query.filter_by(name=row['Food'], restaurant_id=restaurant.id).first()
            if not food:
                food = Food(name=row["Food"])
                restaurant.food.append(food)
                db.session.commit()

            food = Food.query.filter_by(name=row['Food'], restaurant_id=restaurant.id).first()
            record = RecordData(datetime=datetime_csv, initial_value=row["Initial"], bolus=row["Bolus"], after_value=row["Result"], food_id=food.id)

            db.session.add(record)
        db.session.commit()
        print("DATABASE INITIALIZED")
