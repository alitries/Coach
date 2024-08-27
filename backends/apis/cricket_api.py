from flask import Blueprint, request, jsonify
import asyncio
from uagents import Model
from uagents.query import query
import json

cricket_api = Blueprint('cricket_api', __name__)

class CricketPrompt(Model):
    prompt: str

cricket_address = "agent1qtrrx2vlq24umjmggx4uqs6k4crgnjehcfpreqy7jrdn4ajkrfvj7zsecr3"

@cricket_api.route('/get_quote', methods=['POST'])
def get_quote():
    prompt = request.json.get('prompt')  # Ensure correct JSON parsing

    # Handle the asynchronous agent query
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    response = loop.run_until_complete(query_agent(prompt))

    return jsonify({'response': response.get('response', '')})

async def query_agent(prompt):
    response = await query(destination=cricket_address, message=CricketPrompt(prompt=prompt), timeout=300.0)
    data = json.loads(response.decode_payload())
    return data
