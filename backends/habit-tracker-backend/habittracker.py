from uagents import Agent, Context, Model, Bureau
import pandas as pd
import random
import datetime
import smtplib
from email.mime.text import MIMEText
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import requests
from db_connection import get_mongo_client
import schedule
import time

import logging

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

# Define the reminder model
class Reminder(Model):
    type: str
    time: str
    date: datetime.date
    message: str
    frequency: str

    def __str__(self):
        return f"Reminder: {self.type} at {self.time} on {self.date} - {self.message}"

# Define the user data model
class UserData(Model):
    name: str
    goals: str
    preferences: str
    progress: str
    email: str

    def __str__(self):
        return f"User: {self.name} - {self.email}"

# Define the agent
class HealthAgent(Agent):
    def __init__(self):
        super().__init__("HealthAgent")
        self.bureau = Bureau()
        self.reminders = {}  # Initialize the reminders dictionary
        self.meals = {}  # Initialize the meals dictionary
        self.stop_words = set(stopwords.words('english'))
        self.client = get_mongo_client()
        self.db = self.client["Habit"]

        self.reminders_collection = self.db.get_collection("reminders")
        self.user_data_collection = self.db["user_data"]
        self.mail_status_collection = self.db["Mail_Status"]

    def handle_startup(self):
        print("Welcome! Let's set up your health journey.")
        name = input("What is your name? ")
        email = input("What is your email address? ")

        goals = input("What are your health goals? ")
        preferences = input("What are your health preferences? ")
        progress = input("What is your current progress?")
        self.user_data = UserData(name=name, goals=goals, preferences=preferences, progress=progress, email=email)

        # Insert user data into the database
        self.user_data_collection.insert_one(self.user_data.__dict__)

        # Collect reminder times
        water_reminder = input("Do you want to set a daily reminder to drink water? (yes/no): ")
        if water_reminder.lower() == "yes":
            # Send a daily reminder every hour
            for hour in range(24):
                time = f"{hour:02d}:00"  # Format time as HH:00
                self.send_email_at_time(self.user_data.email, "Reminder: Drink water", "Drink water!", time)

        self.protein_frequency = int(input("How many times a day do you take protein? "))
        if self.protein_frequency > 5:
            print("Maximum 5 times allowed.")
            self.protein_frequency = 5

        self.protein_times = []
        for i in range(self.protein_frequency):
            protein_time_input = input(f"Enter time for protein reminder {i+1} (HH:MM AM/PM or HH:MM): ")
            protein_time_parts = protein_time_input.split()

            if len(protein_time_parts) == 2:  # 12-hour format with AM/PM
                protein_time, protein_period = protein_time_parts
                protein_hour, protein_minute = map(int, protein_time.split(':'))
                if protein_period == 'PM' and protein_hour != 12:
                    protein_hour += 12
                elif protein_period == 'AM' and protein_hour == 12:
                    protein_hour = 0
            else:  # 24-hour format
                protein_time = protein_time_parts[0]
                protein_hour, protein_minute = map(int, protein_time.split(':'))

            protein_time = f"{protein_hour:02d}:{protein_minute:02d}"
            self.protein_times.append(protein_time)
            self.send_email_at_time(self.user_data.email, "Reminder: Take protein", "Time to take protein!", protein_time)

        self.workout_frequency = int(input("How many times a day do you want to work out? (max 3): "))
        if self.workout_frequency > 3:
            print("Maximum 3 times allowed.")
            self.workout_frequency = 3

        def convert_to_24hour(hour, period):
            if period == 'PM' and hour != 12:
                hour += 12
            elif period == 'AM' and hour == 12:
                hour = 0
            return hour

        self.workout_times = []
        for i in range(self.workout_frequency):
            workout_time = input(f"Enter time for workout reminder {i+1} (HH:MM AM/PM): ")
            workout_time_parts = workout_time.split()
            if len(workout_time_parts) == 2:  # Time with AM/PM suffix
                workout_hour, workout_minute = map(int, workout_time_parts[0].split(':'))
                workout_period = workout_time_parts[1]
            else:  # Time without AM/PM suffix
                workout_hour, workout_minute = map(int, workout_time.split(':'))
                workout_period = 'AM'  # Default to AM if no suffix is provided

            # Convert 12-hour format to 24-hour format
            workout_hour = convert_to_24hour(workout_hour, workout_period)

            # Schedule workout reminder
            workout_time = f"{workout_hour:02d}:{workout_minute:02d}"
            self.workout_times.append(workout_time)
            self.send_email_at_time(self.user_data.email, "Reminder: Work out", "Time to work out!", workout_time)

        # Collect meal times
        def convert_to_24hour(hour, period):
            if period == 'PM' and hour != 12:
                hour += 12
            elif period == 'AM' and hour == 12:
                hour = 0
            return hour

        meals = {}
        for meal in ["Breakfast", "Lunch", "Snacks", "Dinner"]:
            have_meal = input(f"Do you want to have {meal}? (yes/no): ")
            if have_meal.lower() == "yes":
                meal_time = input(f"What time would you like to have {meal}? (HH:MM AM/PM): ")
                meal_time_parts = meal_time.split()
                if len(meal_time_parts) == 2:  # Time with AM/PM suffix
                    meal_hour, meal_minute = map(int, meal_time_parts[0].split(':'))
                    meal_period = meal_time_parts[1]
                else:  # Time without AM/PM suffix
                    meal_hour, meal_minute = map(int, meal_time.split(':'))
                    meal_period = 'AM'  # Default to AM if no suffix is provided

                # Convert 12-hour format to 24-hour format
                meal_hour = convert_to_24hour(meal_hour, meal_period)

                meal_time = f"{meal_hour:02d}:{meal_minute:02d}"
                meals[meal] = Reminder(type=meal, time=meal_time, date=datetime.date.today(), message=f"Have {meal}!", frequency="daily")
                self.send_email_at_time(self.user_data.email, f"Reminder: {meal}", meals[meal].message, meal_time)

        self.meals = meals

        # Insert meals into the database
        for meal, reminder in self.meals.items():
            self.reminders_collection.insert_one({
                "time": datetime.datetime.combine(reminder.date, datetime.time(hour=int(reminder.time.split(":")[0]), minute=int(reminder.time.split(":")[1]))),
                "metadata": {
                    "type": reminder.type,
                    "message": reminder.message,
                    "frequency": reminder.frequency
                }
            })

    def send_email_at_time(self, to_email, subject, message, time):
        def send_email():
            try:
                msg = MIMEText(message)
                msg['Subject'] = subject
                msg['From'] = "your email"  # Replace with your email
                msg['To'] = to_email

                server = smtplib.SMTP('smtp.gmail.com', 587)
                server.starttls()
                server.login(msg['From'], "your password")  # Replace with your password
                server.sendmail(msg['From'], msg['To'], msg.as_string())
                server.quit()
                print("Email sent successfully!")
                logging.info("Email sent successfully!")
            except Exception as e:
                print(f"Error sending email: {str(e)}")
                logging.error(f"Error sending email: {str(e)}")

        # Use bureau to schedule the email
        schedule.every().day.at(time).do(send_email)

    def run(self):
        self.handle_startup()
        while True:
            try:
                schedule.run_pending()
                time.sleep(1)
            except Exception as e:
                print(f"Error: {str(e)}")
                time.sleep(1)

if __name__ == "__main__":
    agent = HealthAgent()
    agent.run()