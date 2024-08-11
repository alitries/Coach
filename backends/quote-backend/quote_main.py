from flask import Flask, render_template, request, jsonify
import asyncio
from uagents import Agent, Context, Model
from uagents.query import query
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Model classes for the agent
class Quote(Model):
    feeling: str
    context: str

class Response(Model):
    response: str

# Hardcoded address of the quote agent
quote_address = "agent1q249x2snexu4f6am4rnk4e8dmuw9sqj7x886e7ydp35rnuqqgf9pu5p7yev"

# Route for the main page
@app.route('/')
def index():
    return render_template('index.html')

# Route for handling user input and getting response from the agent
@app.route('/get_quote', methods=['POST'])
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

if __name__ == '__main__':
    app.run(debug=True, port=85)
