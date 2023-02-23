from flask import Flask, jsonify, request
from models import db



# create the app
app = Flask(__name__)
# configure the SQLite database, relative to the app instance folder
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
# initialize the app with the extension
db.init_app(app)

from models import Restaurace


@app.route('/', methods=['GET', 'POST'])
def home():
    if (request.method == 'GET'):
        data = "hello world"
        return jsonify({'data': data})

@app.route('/users', methods=['GET', 'POST'])
def users():
    restaurations = Restaurace.query.all()
    restauration_list = []
    for restauration in restaurations:
        restauration_list.append({
            'id': restauration.id,
            'name': restauration.name,
            'email': restauration.email
        })
    return jsonify(restauration_list)

if __name__ == "__main__":
    app.run(debug=True)