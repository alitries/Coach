# Importing the necessary libraries
import os
from torch import bfloat16
import torch
import transformers
from transformers import AutoTokenizer
from time import time
from langchain.llms import HuggingFacePipeline
from langchain.chains import RetrievalQA
from langchain_pinecone import PineconeEmbeddings
from langchain_pinecone import PineconeVectorStore
from uagents import Agent, Context, Model
import redis
# import nest_asyncio; nest_asyncio.apply()

# Setting up API key and environment variables for Pinecone (a vector database for embeddings)
api_key = "8cf4d3e3-7887-4f2d-aa79-4b763f25d074"
os.environ['PINECONE_API_KEY'] = api_key

# Defining model and index names for Pinecone
model_name = "multilingual-e5-large"
index_name = "exercise-rag"
namespace = "exerciseVectorStore"

# Defining the embeddings and knowledge store using Pinecone
embeddings = PineconeEmbeddings(
    model=model_name,
    pinecone_api_key=api_key)

knowledge = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    namespace=namespace,
    embedding=embeddings)

# Global variable to store the language model (LLM)
llm = None

# Redis connection
r = redis.Redis(
    host='redis-13731.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
    port=13731,
    password='T3Uv7tjUilFVjQZd514AQ97hFBm4CV05',
    db=0  # Use database 0
)

# Function to load and configure the LLM using Hugging Face Transformers and Langchain
async def load_llm():
    global llm  # Declare llm as global to modify it
    print("Entering LLM loading function")

    # Configuration for loading the model with 4-bit quantization
    bnb_config = transformers.BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type='nf4',
        bnb_4bit_use_double_quant=True,
        bnb_4bit_compute_dtype=bfloat16
    )

    # Load model and tokenizer from Hugging Face Hub
    time_1 = time()
    access_token = "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"
    model_nm = "meta-llama/Llama-2-7b-chat-hf"
    model_config = transformers.AutoConfig.from_pretrained(model_nm, use_auth_token=access_token)
    model = transformers.AutoModelForCausalLM.from_pretrained(
        model_nm,
        use_auth_token=access_token,
        trust_remote_code=True,
        config=model_config,
        quantization_config=bnb_config,
        device_map='auto',
    )
    tokenizer = AutoTokenizer.from_pretrained(model_nm, use_auth_token=access_token)
    time_2 = time()
    print(f"Prepare model and tokenizer: {round(time_2 - time_1, 3)} sec.")

    # Create a text generation pipeline for the LLM
    time_1 = time()
    query_pipeline = transformers.pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        torch_dtype=torch.float16,
        device_map="auto"
    )
    time_2 = time()
    print(f"Prepare pipeline: {round(time_2 - time_1, 3)} sec.")

    # Wrap the pipeline using Langchain's HuggingFacePipeline
    llm = HuggingFacePipeline(pipeline=query_pipeline)
    print("LLM has been successfully loaded")

# Function to generate a response based on context and user query using the LLM
async def generate_response(context, query):
    global llm  # Access the global llm variable
    if llm is None:
        await load_llm()  # Load the LLM if it hasn't been loaded yet

    # Define a prompt template for the LLM to generate responses
    prompt_template = """
         **Context:** {}

        You are a virtual fitness coach and expert. Given a user query about a
        muscle group, exercise, or workout plan, provide a comprehensive
        response.

        * If the user specifies a muscle group, recommend suitable exercises,
        providing details about each exercise including name, description,
        equipment required, difficulty level, and benefits.
        * If the user specifies an exercise, provide a detailed breakdown of
        the exercise including proper form, target muscle groups, variations,
        and safety precautions.
        * If the user requests a workout plan, create a personalized plan based
        on their fitness goals, experience level, and available equipment.

                Ensure your response is informative, engaging, and motivating.

        Use the context given from the previous conversation
        if the context is not empty.
        **User:** {}
        **Response:**
        """

    # Check if the response is cached in Redis
    cache_key = f"{query}".strip().lower()
    cached_response = r.get(cache_key)
    if cached_response:
        return cached_response.decode('utf-8')

    # Set up a retrieval-based question-answering system using the LLM and Pinecone knowledge base
    qa = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=knowledge.as_retriever()
    )
    # Run the prompt through the QA system to generate an answer
    answer = qa.run(prompt_template.format(context, query))
    index = answer.find('Helpful')
    index += len('Helpful Response :')
    response = answer[index:]

    # Cache the response in Redis for 1 hour
    r.setex(cache_key, 3600, response)

    return response

# Creating an agent named "exercise" that listens on port 8002
exercise = Agent(name="exercise",
                 port=8002,
                 seed="ExerciseAgent-Team Clutch",
                 endpoint=["http://127.0.0.1:8002/submit"]
)

print(exercise.address)  # Print the agent's address

# Define the data models for the incoming prompts and responses
class ExercisePrompt(Model):
    prompt: str
    context: str

class Response(Model):
    response: str

# Handler for the startup event to load the LLM when the agent starts
@exercise.on_event('startup')
async def start_up_function(ctx: Context):

    global llm
    ctx.logger.info("Startup event started")
    await load_llm()  # Initialize the global llm variable

# Handler for incoming messages; processes the user's query and context
@exercise.on_query(model=ExercisePrompt)
async def message_handler(ctx: Context, sender: str, msg: ExercisePrompt):
    ctx.logger.info(f"Received message from {sender}")
    response = await generate_response(msg.context, msg.prompt)  # Generate a response using the LLM
    ctx.logger.info(f"Result: {response}")
    await ctx.send(sender, Response(response=response))  # Send the generated response back to the sender

# Entry point of the script; runs the agent
if __name__ == "__main__":
    exercise.run()