# Import necessary libraries
from flask import Flask, request, jsonify, render_template  # Flask is imported but not used in this code
from uagents import Agent, Model, Context
import googlemaps

# Set up Google Maps API client with API key
GOOGLE_MAPS_API_KEY="Your_API_Key_Here"  # Replace "Your_API_Key_Here" with your actual Google Maps API key
gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)

# Define an asynchronous function to find recreational activities near a given location
async def find_recreational_activities(location, search_query, radius=1000):
    # Use the Google Maps API to search for places matching the search query
    places_result = gmaps.places(
        query=search_query,
        location=location,
        radius=radius
    )

    results = []  # List to store the search results
    final_results = []  # List to store the final results to return
    for place in places_result.get('results', []):
        name = place.get('name')  # Get the name of the place
        place_id = place.get('place_id')  # Get the place ID
        
        # Create a Google Maps link using the place ID
        maps_link = f"https://www.google.com/maps/place/?q=place_id:{place_id}"
        
        # Ensure no duplicate places are added to the results
        if not any(r['name'] == name for r in results):
            results.append({
                'name': name, 
                'maps_link': maps_link
            })

    # Limit the final results to the first result found
    final_results.extend(results[:1])
    return final_results  # Return the final list of results

# Create an agent instance for handling mental health related activities
mental = Agent(name="mental", seed="MentalHealthAgent - Team Clutch")

# Define a startup event handler for the agent
@mental.on_event('startup')
async def start_up_function(ctx : Context):
    # Set a sample location (latitude, longitude) for the search
    sample_location = (19.0699603, 72.8404588)
    
    # Find different types of recreational activities near the sample location
    activities1 = await find_recreational_activities(sample_location, search_query="yoga center")
    activities2 = await find_recreational_activities(sample_location, search_query="Parks")
    activities3 = await find_recreational_activities(sample_location, search_query="Sports Club")
    activities4 = await find_recreational_activities(sample_location, search_query="Book Club")
    
    # Construct a response message using the results from the search
    response = f"""
                Have you tried any of the yoga centres in your area?
                Name :{activities1[0]["name"]}
                Location Link : {activities1[0]["maps_link"]}

                Are you interested in visiting any of the parks in your area? - 
                Name :{activities2[0]["name"]}
                Location Link : {activities2[0]["maps_link"]}

                Would you like to join a sports club in your area? - 
                Name : {activities3[0]["name"]}
                Location Link : {activities3[0]["maps_link"]}
                
                Are you interested in joining a book club in your area? - 
                Name :{activities4[0]["name"]}
                Location Link : {activities4[0]["maps_link"]}
                
                You should try some new activities like playing football, visiting a cafe and making new friends. 
                """
    # Log the constructed response
    ctx.logger.info(f"{response}")
    
# Run the agent if this script is executed directly
if __name__ == "__main__":
    mental.run()
