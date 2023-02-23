from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

# create the extension
db = SQLAlchemy()
# create the app
app = Flask(__name__)
# configure the SQLite database, relative to the app instance folder
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
# initialize the app with the extension
db.init_app(app)


@app.route('/', methods=['GET', 'POST'])
def home():
    if (request.method == 'GET'):
        data = "hello world"
        return jsonify({'data': data})

# driver function
if __name__ == '__main__':
    app.run(debug=True)