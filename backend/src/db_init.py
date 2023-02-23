import csv
from app import *
from models import RecordData, Restaurant, Food

with app.app_context():
    db.drop_all()
    db.create_all()
    with open("./data/data.csv") as f:
        reader = csv.DictReader(f)
        for row in reader:
            print(row)

            restaurant = Restaurant.query.filter_by(name=row['Restaurant']).first()
            print(restaurant)
            if not restaurant:
                restaurant = Restaurant(name=row["Restaurant"])
                db.session.add(restaurant)
                db.session.commit()
            restaurant = Restaurant.query.filter_by(name=row['Restaurant']).first()
            print(restaurant.id)
            food = Food.query.filter_by(name=row['Food'], restaurant_id=restaurant.id).first()
            if not food:
                food = Food(name=row["Food"])
                restaurant.food.append(food)
                db.session.commit()

            food = Food.query.filter_by(name=row['Food'], restaurant_id=restaurant.id).first()
            record = RecordData(date=row["\ufeffDate"], time=row["Time"], initial_value=row["Initial"], bolus=row["Bolus"], after_value=row["Result"], restaurant_id=restaurant.id, food_id=food.id)

            db.session.add(record)
        db.session.commit()
