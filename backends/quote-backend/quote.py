# Importing the required libraries
import os
import torch
import transformers
from transformers import AutoTokenizer
from time import time
from langchain_pinecone import PineconeEmbeddings
from langchain_pinecone import PineconeVectorStore
from uagents import Agent, Context, Model

# Defining the global variables
llm = None
query_pipeline = None
tokenizer = None

# Check if GPU is available and set the device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Loading the LLM model for generating quotes
async def load_llm():
    global llm
    print("Entering LLM loading function")
    bnb_config = transformers.BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type='nf4',
            bnb_4bit_use_double_quant=True,
            bnb_4bit_compute_dtype=torch.bfloat16
        ) 
    
    # Hardcoding the access token and model name
    access_token = "your_access_token_here"  # Replace "your access token here" with your actual Hugging Face access token
    model_nm = "meta-llama/Llama-2-7b-chat-hf"
    
    # Load the model configuration
    model_config = transformers.AutoConfig.from_pretrained(model_nm, use_auth_token=access_token)
    model = transformers.AutoModelForCausalLM.from_pretrained(
        model_nm,
        use_auth_token=access_token,
        trust_remote_code=True,
        config=model_config,
        quantization_config=bnb_config,
        device_map='auto',
    ).to(device)  # Move model to the GPU if available
    
    global tokenizer
    # Load the tokenizer for the model
    tokenizer = AutoTokenizer.from_pretrained(model_nm, use_auth_token=access_token)
    
    global query_pipeline
    # Create a pipeline for text generation using the loaded model and tokenizer
    query_pipeline = transformers.pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        torch_dtype=torch.float16,
        device=0 if torch.cuda.is_available() else -1  # Use GPU if available
    )

# Generating a quote based on the user input and the loaded LLM
async def generate_quote(prompt):
    """
    Generates a response based on the given prompt using the query_pipeline.

    Args:
        prompt (str): The input text prompt to generate a response for.

    Returns:
        str: The generated response as a single concatenated string.
    """
    # Generate sequences based on the input prompt using the pipeline
    sequences = query_pipeline(
        prompt,
        do_sample=True,               # Enable sampling to introduce randomness
        top_k=10,                     # Consider only the top 10 probable tokens
        num_return_sequences=1,       # Return only one sequence
        eos_token_id=tokenizer.eos_token_id,  # Use the tokenizer's EOS token to end generation
        max_length=5000,              # Set the maximum length for the generated sequence
        truncation=True 
    )

    # Initialize an empty string to store the final result
    result = ""

    # Iterate over each generated sequence and concatenate it to the result
    for seq in sequences:
        result += str(seq['generated_text'])

    # Return the concatenated result as a single string
    return result

# Define data models for handling requests and responses
class Quote(Model):
    feeling: str  # Represents the user's feeling or problem
    context: str  # Represents the context of the conversation, if any

class Response(Model):
    response: str  # Represents the response from the coach

# Initialize the agent with specific configurations
quote = Agent(
    name="quote",
    port=8001,
    seed="QuoteAgent - Team Clutch",
    endpoint=["http://127.0.0.1:8001/submit"]
)

# Print the agent's address for reference
print(quote.address)

# Define a startup event to load the language model when the agent starts
@quote.on_event('startup')
async def start_up_function(ctx: Context):
    await load_llm()  # Load the language model and store it globally
    ctx.logger.info("Agent Started")
# Define a message handler to process incoming messages
@quote.on_query(model=Quote)
async def handle_message(ctx: Context, sender: str, msg: Quote):
    # Define the prompt template without context
    prompt_without_context = """
        You are a motivational coach and life coach. Your goal is to inspire and encourage the user to overcome their current challenges and achieve their goals. Provide me quotes to get motivated for my problems mentioned in the user request. Provide specific, actionable advice, and offer uplifting quotes or affirmations only for the following user request. Don't create your own user requests. Only answer this user request. Do not generate multiple replies from coach. Generate only one response from the coach.
        **User:** {}.
        **COACH:**
    """

    # Define the prompt template with context
    prompt_with_context = """
        You are a motivational coach and life coach. Your goal is to inspire and encourage the user to overcome their current challenges and achieve their goals. Provide me quotes to get motivated for my problems mentioned in the user request. Provide specific, actionable advice, and offer uplifting quotes or affirmations only for the following user request. Don't create your own user requests. Only answer this user request. Only answer this user request. Do not generate multiple replies from coach. Generate only one response from the coach.
        Also use the following context between the Coach and the user from the previous chat.
        **Context:**{}.
        **User:** {}.
        **COACH:**
    """
    # Choose the appropriate prompt template based on whether context is provided
    if len(msg.context) == 0:
        prompt = prompt_without_context.format(msg.feeling)
    else:
        prompt = prompt_with_context.format(msg.context, msg.feeling)

    # Generate a response based on the prompt using the language model
    response = await generate_quote(prompt)

    # Look for the coach's response in the generated text
    coach_start_index = response.find('**COACH:**')
    if coach_start_index == -1:
        return "No coach response found."

    # # Extract the coach's response from the generated text
    response_start_index = coach_start_index + len('**COACH:**')
    coach_response = response[response_start_index:].strip()
    # coach_response = "Agent is responding"
    # Send the coach's response back to the sender
    await ctx.send(sender, Response(response=coach_response))

# Run the agent
if __name__ == "__main__":
    quote.run()
