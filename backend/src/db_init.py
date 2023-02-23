import csv
from app import *
from models import RecordData, Restaurant, Food

with app.app_context():
    with open("./data/data.csv") as f:
        reader = csv.DictReader(f)
        for row in reader:
            print(row)

            restaurant = Restaurant.query.filter_by(name=row['Restaurant']).first()
            if not restaurant:
                restaurant = Restaurant(name=row["Restaurant"])
                db.session.add(restaurant)

            food = Food.query.filter_by(name=row['Food'], restaurant_id=restaurant.id).first()
            if not food:
                food = Food(name=row["Food"])
                restaurant.food.append(food)

            record = RecordData(date=row["\ufeffDate"], time=row["Time"], initial_value=row["Initial"], bolus=row["Bolus"], after_value=row["Result"], restaurant=restaurant, food=food)

            db.session.add(record)
        db.session.commit()
