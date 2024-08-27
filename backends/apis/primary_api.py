from flask import Blueprint, request, jsonify
import asyncio
from uagents import Model
from uagents.query import query
import json

primary_api = Blueprint('primary_api', __name__)

# Define data models for different types of prompts and responses
class Prompt(Model):
    prompt: str

class Response(Model):
    response: str

class ExercisePrompt(Model):
    prompt: str
    context: str

class RecipePrompt(Model):
    prompt: str
    context: str

class GeneralTalkingPrompt(Model):
    prompt: str
    context: str

prompt_address = "agent1qglw3d720l82th35rkfaufjcstlklsqweu3rkfr7dchq493gmhc65hp6aqy"
exercise_address = "agent1q06c6pp2dhsv86yz9tehxa0525xt8qfmu28p0hnx894yjhh3g6kp7ls2tk8"
recipe_address = "agent1qwqvnh74245xayv5qe9r92wf95pw8yv8nzvz2m4ydn2vpqze5fmky53rytk"
general_talking_address = "agent1q02uj259gshfs7rhr8kpfdr6paalkjtstc5r8np8z20j3tgm64v5y8f873w"

# Function to handle the user prompt and communicate with the agents
async def handle_prompt(prompt, context=""):
    try:
        response = await query(destination=prompt_address, message=Prompt(prompt=prompt), timeout=300.0)
        label = json.loads(response.decode_payload())
        if label:
            result = label['response']
            if result == 'Exercise':
                response = await query(destination=exercise_address, message=ExercisePrompt(prompt=prompt, context=context), timeout=300.0)
                exercise_response = json.loads(response.decode_payload())
                return exercise_response['response']
            elif result == "Recipe":
                response = await query(destination=recipe_address, message=RecipePrompt(prompt=prompt, context=context), timeout=300.0)
                recipe_response = json.loads(response.decode_payload())
                return recipe_response['response']
            elif result == "General Talking":
                response = await query(destination=general_talking_address, message=GeneralTalkingPrompt(prompt=prompt, context=context), timeout=300.0)
                general_talking_response = json.loads(response.decode_payload())
                return general_talking_response['response']
        return "Sorry, I didn't understand that."
    except Exception as e:
        return f"Error: {str(e)}"

@primary_api.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_prompt = data.get('prompt', '')
        context = data.get('context', '')
        
        if not user_prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        # Handling the asyncio event loop for the Flask app
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        assistant_response = loop.run_until_complete(handle_prompt(user_prompt, context))
        
        return jsonify({'response': assistant_response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
