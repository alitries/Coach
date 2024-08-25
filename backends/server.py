from flask import Flask
from flask_cors import CORS
from apis.quote_api import quote_api
from apis.javelin_api import javelin_api
from apis.mental_health_api import mental_health_api
from apis.primary_api import primary_api

from habit_tracker.habittracker_main import habit_api, run_scheduler

app = Flask(__name__)
CORS(app)

# Start the scheduler
run_scheduler()

app.register_blueprint(quote_api, url_prefix='/quote')
app.register_blueprint(javelin_api, url_prefix='/javelin')
app.register_blueprint(mental_health_api, url_prefix='/mental_health')
app.register_blueprint(primary_api, url_prefix='/primary')
app.register_blueprint(habit_api, url_prefix='/habit')

if __name__ == '__main__':
    try:
        app.run(debug=True, port=5000, use_reloader=False)
    except KeyboardInterrupt:
        print("KeyboardInterrupt received. Flask server shutting down...")
    finally:
        # Perform any additional cleanup if needed
        print("Server has shut down.")
