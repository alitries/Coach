import asyncio
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS  # Import CORS
from uagents import Agent, Context
import googlemaps

# Set up Google Maps API client with API key
API_KEY = "AIzaSyCUKwEnmXUkjtsV-oMR9sq5Mlj0cKUqte0"
gmaps = googlemaps.Client(key=API_KEY)

# Define an asynchronous function to find recreational activities near a given location
async def find_recreational_activities(location, search_query, radius=1000):
    places_result = gmaps.places(
        query=search_query,
        location=location,
        radius=radius
    )

    results = []
    for place in places_result.get('results', []):
        name = place.get('name')
        place_id = place.get('place_id')
        maps_link = f"https://www.google.com/maps/place/?q=place_id:{place_id}"

        if not any(r['name'] == name for r in results):
            results.append({
                'name': name,
                'maps_link': maps_link
            })

    return results[:1]

# Create an agent instance for handling mental health related activities
mental = Agent(name="mental", seed="MentalHealthAgent - Team Clutch")

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/find_activities', methods=['POST'])
def find_activities():
    user_data = request.json
    latitude = user_data.get('latitude')
    longitude = user_data.get('longitude')

    if not latitude or not longitude:
        return jsonify({"error": "Latitude and Longitude are required"}), 400

    user_location = (latitude, longitude)

    # Use asyncio.run to execute the asynchronous functions
    activities1 = asyncio.run(find_recreational_activities(user_location, search_query="yoga center"))
    activities2 = asyncio.run(find_recreational_activities(user_location, search_query="Parks"))
    activities3 = asyncio.run(find_recreational_activities(user_location, search_query="Sports Club"))
    activities4 = asyncio.run(find_recreational_activities(user_location, search_query="Book Club"))

    # Construct the detailed response message
    response = f"""
                Have you tried any of the yoga centres in your area?
                Name : {activities1[0]["name"] if activities1 else 'No results found'}
                Location Link : {activities1[0]["maps_link"] if activities1 else 'N/A'}

                Are you interested in visiting any of the parks in your area?
                Name : {activities2[0]["name"] if activities2 else 'No results found'}
                Location Link : {activities2[0]["maps_link"] if activities2 else 'N/A'}

                Would you like to join a sports club in your area?
                Name : {activities3[0]["name"] if activities3 else 'No results found'}
                Location Link : {activities3[0]["maps_link"] if activities3 else 'N/A'}
                
                Are you interested in joining a book club in your area?
                Name : {activities4[0]["name"] if activities4 else 'No results found'}
                Location Link : {activities4[0]["maps_link"] if activities4 else 'N/A'}
                
                You should try some new activities like playing football, visiting a cafe, and making new friends.
                """

    # Log the constructed response (optional)
    print(response)

    return jsonify({"message": response})

if __name__ == "__main__":
    app.run(debug=True)
