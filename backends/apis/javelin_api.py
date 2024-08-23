from flask import Blueprint, request, jsonify
import asyncio
from uagents import Model
from uagents.query import query
import json

javelin_api = Blueprint('javelin_api', __name__)

# Model classes for the agent
class JavelinePrompt(Model):
    prompt: str

class Response(Model):
    response: str

# Hardcoded address of the quote agent
quote_address = "agent1qguv0nuncv0r5h3kdsepwjd6w2g84cdl489nalzx5syrm6rudqhzsccmetx"

# Route for handling user input and getting response from the agent
@javelin_api.route('/get_quote', methods=['POST'])
def get_quote():
    data = request.get_json()  # Use get_json() to parse JSON data
    prompt = data.get('prompt')
    
    # Sending and receiving response from the agent
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    response = loop.run_until_complete(query_agent(prompt))
    
    # Debugging statement to print the response object
    print(f"Response received: {response}")

    # Check if the response has the expected structure
    # if isinstance(response, dict) and 'response' in response:
    #     context += f"Feeling: {feeling}\nCoach: {response['response']}\n"
    #     return jsonify({'response': response['response'], 'context': context})
    # else:
    return jsonify({'response': response['response']})

# Function to interact with the agent
async def query_agent(prompt):
    response = await query(destination=quote_address, message=JavelinePrompt(prompt=prompt), timeout=300.0)
    print(response)
    
    data = json.loads(response.decode_payload())
    print(data)
    return data
