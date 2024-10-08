import asyncio
from flask import Blueprint, request, jsonify
# from uagents import Agent, Context
import googlemaps

# Set up Google Maps API client with API key
API_KEY = "AIzaSyBonc0jD3Bf7fUbDxQ8jbo5W-3HWI_mFnk"
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
# mental = Agent(name="mental", seed="MentalHealthAgent - Team Clutch", port=8009, endpoint=["http://127.0.0.1:8009/submit"])

# Initialize Flask app
mental_health_api = Blueprint('mental_health_api', __name__)

@mental_health_api.route('/find_activities', methods=['POST'])
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
    response = [f"""Have you tried any of the yoga centres in your area?<br />Name : {activities1[0]["name"] if activities1 else 'No results found'}<br />Location Link : <a href="{activities1[0]["maps_link"] if activities1 else '#'}" target="__blank">{activities1[0]["maps_link"] if activities1 else 'N/A'}</a>""",
                f"""Are you interested in visiting any of the parks in your area?<br />Name : {activities2[0]["name"] if activities2 else 'No results found'}<br />Location Link : <a href="{activities2[0]["maps_link"] if activities1 else '#'}" target="__blank">{activities2[0]["maps_link"] if activities2 else 'N/A'}</a>""",
                f"""Would you like to join a sports club in your area?<br />Name : {activities3[0]["name"] if activities3 else 'No results found'}<br />Location Link : <a href="{activities3[0]["maps_link"] if activities1 else '#'}" target="__blank">{activities3[0]["maps_link"] if activities3 else 'N/A'}</a>""",
                f"""Are you interested in joining a book club in your area?<br />Name : {activities4[0]["name"] if activities4 else 'No results found'}<br />Location Link : <a href="{activities4[0]["maps_link"] if activities1 else '#'}" target="__blank">{activities4[0]["maps_link"] if activities4 else 'N/A'}</a>""",
                f"""You should try some new activities like playing football, visiting a cafe, and making new friends."""]

    # Log the constructed response (optional)
    print(response)

    return jsonify({"message": response})
