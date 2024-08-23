from flask import Blueprint, request, jsonify
import schedule
import time
import threading
import smtplib
from email.mime.text import MIMEText
import nltk
from nltk.corpus import stopwords
from habit_tracker.db_connection import get_mongo_client
import logging

def convert_to_24hour(time_str):
    """
    Converts 12-hour time format to 24-hour time format.
    Args:
        time_str (str): Time in 12-hour format (e.g., "02:00 PM").
    Returns:
        str: Time in 24-hour format (e.g., "14:00").
    """
    time_parts = time_str.split()
    if len(time_parts) == 2:
        time, period = time_parts
        hour, minute = map(int, time.split(':'))
        if period.upper() == 'PM' and hour != 12:
            hour += 12
        elif period.upper() == 'AM' and hour == 12:
            hour = 0
    else:
        time = time_parts[0]
        hour, minute = map(int, time.split(':'))
    
    return f"{hour:02d}:{minute:02d}"

logging.basicConfig(filename='program.log', level=logging.INFO)

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# Initialize Flask app
# app = Flask(__name__)
# CORS(app, origins="http://localhost:3000")  # Enable CORS for all routes

habit_api = Blueprint('habit_api', __name__)

# MongoDB client setup
client = get_mongo_client()
db = client["Habit"]

# Collections
reminders_collection = db.get_collection("reminders")
user_data_collection = db["user_data"]
mail_status_collection = db["Mail_Status"]

stop_words = set(stopwords.words('english'))

def send_email(to_email, subject, message):
    try:
        msg = MIMEText(message)
        msg['Subject'] = subject
        msg['From'] = "iamkaran41@gmail.com"  # Replace with your email
        msg['To'] = to_email

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(msg['From'], "rjye qofo yohi yjbd")  # Replace with your password
        server.sendmail(msg['From'], msg['To'], msg.as_string())
        server.quit()
        print("Email sent successfully!")
        logging.info("Email sent successfully!")
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        logging.error(f"Error sending email: {str(e)}")

@habit_api.route('/create_user', methods=['POST'])
def create_user():
    data = request.get_json()
    user_data = {
        "name": data.get('name'),
        "email": data.get('email'),
        "goals": data.get('goals'),
        "preferences": data.get('preferences'),
        "progress": data.get('progress')
    }
    user_data_collection.insert_one(user_data)
    return jsonify({"message": "User created successfully"}), 201

@habit_api.route('/set_reminders', methods=['POST'])
def set_reminders():
    data = request.get_json()
    email = data.get('email')
    protein_times = data.get('protein_times', [])
    workout_times = data.get('workout_times', [])
    meals = data.get('meals', {})

    for time in protein_times:
        if "AM" in time or "PM" in time:
            time = convert_to_24hour(time)
        schedule.every().day.at(time).do(send_email, email, "Reminder: Take protein", "Time to take protein!")

    for time in workout_times:
        if "AM" in time or "PM" in time:
            time = convert_to_24hour(time)
        schedule.every().day.at(time).do(send_email, email, "Reminder: Work out", "Time to work out!")

    for meal, time in meals.items():
        if time:
            if "AM" in time or "PM" in time:
                time = convert_to_24hour(time)
            schedule.every().day.at(time).do(send_email, email, f"Reminder: {meal}", f"Time to have {meal}!")

    return jsonify({"message": "Reminders set successfully"}), 201

def run_scheduler():
    def __run():
        while True:
            schedule.run_pending()
            time.sleep(1)
    
    scheduler_thread = threading.Thread(target=__run, daemon=True)
    scheduler_thread.start()
