from flask import Blueprint, request, jsonify
import asyncio
from uagents import Model
from uagents.query import query
import json

quote_api = Blueprint('quote_api', __name__)

# Model classes for the agent
class Quote(Model):
    feeling: str  # Represents the user's feeling or problem
    context: str  # Represents the context of the conversation, if any

class Response(Model):
    response: str

# Hardcoded address of the quote agent
quote_address = "agent1q249x2snexu4f6am4rnk4e8dmuw9sqj7x886e7ydp35rnuqqgf9pu5p7yev"

# Route for handling user input and getting response from the agent
@quote_api.route('/get_quote', methods=['POST'])
def get_quote():
    data = request.get_json()  # Use get_json() to parse JSON data
    feeling = data.get('feeling')
    context = data.get('context', "")

    # Sending and receiving response from the agent
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    response = loop.run_until_complete(query_agent(feeling, context))
    
    # Debugging statement to print the response object
    print(f"Response received: {response}")

    if response is None:
        return jsonify({'error': 'Failed to get a valid response'}), 500

    # Ensure 'response' key is present in the response
    if isinstance(response, dict) and 'response' in response:
        return jsonify({'response': response['response'], 'context': context})
    else:
        return jsonify({'error': 'Invalid response format'}), 500

# Function to interact with the agent
async def query_agent(feeling, context):
    try:
        response = await query(destination=quote_address, message=Quote(feeling=feeling, context=context), timeout=300.0)
        print(response)
        
        if response is None:
            print("Error: No response received from the agent")
            return None
        
        # If decode_payload is not valid, you may need to adapt this part based on actual response structure
        data = json.loads(response.decode_payload())
        print(data)
        return data
    except Exception as e:
        print(f"Error in query_agent: {e}")
        return None
