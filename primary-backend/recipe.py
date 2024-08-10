# Importing the necessary libraries 
# import os
# from torch import bfloat16
# import torch
# import transformers
# from transformers import AutoTokenizer
# from time import time
# from langchain.llms import HuggingFacePipeline
# from langchain.chains import RetrievalQA
# from langchain_pinecone import PineconeEmbeddings
# from langchain_pinecone import PineconeVectorStore
from uagents import Agent, Context, Model

# Setting up the Pinecone API key as an environment variable
# api_key="12948f96-03a8-4a78-8bb4-f7c9641428f3"
# os.environ['PINECONE_API_KEY'] = api_key

# # Defining model and index names for Pinecone (a vector database for storing and retrieving embeddings)
# model_name="multilingual-e5-large"
# index_name="recipe-rag"
# namespace="recipeVectorStore3"

# # Define the embeddings model and connect to the Pinecone knowledge store
# embeddings = PineconeEmbeddings(
#     model=model_name,
#     pinecone_api_key=api_key)

# # Load the vector store (knowledge base) from the existing Pinecone index
# knowledge = PineconeVectorStore.from_existing_index(
#     index_name=index_name,
#     namespace=namespace,
#     embedding=embeddings)

# # Initialize the language model (LLM) variable as None to be loaded later
# llm = None

# # Function to load and configure the language model using Hugging Face Transformers and Langchain
# async def load_llm():
#     global llm  # Declare llm as global to modify it within the function
#     print("Entering LLM loading function")
    
#     # Configuration for loading the model with 4-bit quantization to save memory
#     bnb_config = transformers.BitsAndBytesConfig(
#         load_in_4bit=True,
#         bnb_4bit_quant_type='nf4',
#         bnb_4bit_use_double_quant=True,
#         bnb_4bit_compute_dtype=bfloat16
#     )
    
#     # Load the Llama-2 model and tokenizer from Hugging Face using the provided access token
#     time_1 = time()
#     access_token = "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"
#     model_nm = "meta-llama/Llama-2-7b-chat-hf"
#     model_config = transformers.AutoConfig.from_pretrained(model_nm, use_auth_token=access_token)
#     model = transformers.AutoModelForCausalLM.from_pretrained(
#         model_nm,
#         use_auth_token=access_token,
#         trust_remote_code=True,
#         config=model_config,
#         quantization_config=bnb_config,
#         device_map='auto',
#     )
#     tokenizer = AutoTokenizer.from_pretrained(model_nm, use_auth_token=access_token)
#     time_2 = time()
#     print(f"Prepare model and tokenizer: {round(time_2 - time_1, 3)} sec.")
    
#     # Create a text generation pipeline for the LLM
#     time_1 = time()
#     query_pipeline = transformers.pipeline(
#         "text-generation",
#         model=model,
#         tokenizer=tokenizer,
#         torch_dtype=torch.float16,
#         device_map="auto"
#     )
#     time_2 = time()
#     print(f"Prepare pipeline: {round(time_2 - time_1, 3)} sec.")
    
#     # Wrap the pipeline using Langchain's HuggingFacePipeline
#     llm = HuggingFacePipeline(pipeline=query_pipeline)
#     print("LLM has been successfully loaded")
    
# # Function to generate a response based on context and user query using the LLM
# async def generate_response(context, query):
#     global llm  # Access the global llm variable
#     if llm is None:
#         await load_llm()  # Load the LLM if it hasn't been loaded yet
    
#     # Define a prompt template for the LLM to generate responses
#     prompt_template = """
#         *Context*:{}
#         You are a virtual nutritionist and culinary expert. Given a user query and a relevant recipe, provide a comprehensive response that includes:

#         * Recipe details: Name, ingredients and instructions. A URL to the original source (if available).
#         * Nutritional information: Caloric content, macronutrients (protein, carbohydrates, fats), and any relevant micronutrients according to the serving size of 100 gms.
#         * Personalized recommendations: Tailor the recipe to the user's dietary needs, preferences, or allergies.
#         * Cooking tips: Offer helpful advice or substitutions to enhance the dish.

#         You can use the context given below from the previous conversation if the context is not empty.
#         Format:
#         Use the context given from the previous conversation if the context is not empty.

#         *User*:{}
#         Response:
#         """
    
#     # Set up a retrieval-based question-answering system using the LLM and Pinecone knowledge base
#     qa = RetrievalQA.from_chain_type(
#         llm=llm,
#         chain_type="stuff",
#         retriever=knowledge.as_retriever()
#     )
    
#     # Run the prompt through the QA system to generate an answer
#     answer = qa.run(prompt_template.format(context,query))
#     index = answer.find('Helpful')
#     index += len('Helpful Response :')
#     return answer[index:]

# Creating an agent named "recipe" that listens on port 8003
recipe = Agent(name="recipe", 
                 port=8003, 
                 seed="RecipeAgent - Team Clutch",
                 endpoint=["http://127.0.0.1:8003/submit"]
)

print(recipe.address)  # Print the agent's address

# Define the data models for the incoming prompts and responses
class RecipePrompt(Model):
    prompt: str
    context: str
    
class Response(Model):
    response: str

# Handler for the startup event to load the LLM when the agent starts
@recipe.on_event('startup')
async def start_up_function(ctx: Context):
    global llm
    ctx.logger.info("Startup event started")
    # await load_llm()  # Initialize the global llm variable
    
# Handler for incoming messages; processes the user's query and context
@recipe.on_query(model=RecipePrompt)
async def message_handler(ctx: Context, sender: str, msg: RecipePrompt):
    ctx.logger.info(f"Received message from {sender}")
    # response = await generate_response(msg.context, msg.prompt)  # Generate a response using the LLM
    response = "Recipe is working"
    ctx.logger.info(f"Result: {response}")
    await ctx.send(sender, Response(response=response))  # Send the generated response back to the sender
    
# Entry point of the script; runs the agent
if __name__ == "__main__":
    recipe.run()
