from flask import Flask, render_template, request, jsonify
import asyncio
from uagents import Agent, Context, Model
from uagents.query import query
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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

# Addresses of the different agents responsible for handling specific tasks
prompt_address = "agent1qglw3d720l82th35rkfaufjcstlklsqweu3rkfr7dchq493gmhc65hp6aqy"
exercise_address = "agent1qf3kgvh33lley2k0fgs3qwkeeytg300kz6t03n3eyvd7udsm6kttcrs0c9z"
recipe_address = "agent1qdtdt3l7qtgva7fud7jr99s55nfwedur8dem0p5unutgysd4rdmqksf49p7"
general_talking_address = "agent1qvc5rkpw9jr4cp40f9ez69n2suqgvxwu4j9y8upl9amvk7wndge4u8rgy0a"

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

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
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

if __name__ == '__main__':
    app.run(debug=True)
