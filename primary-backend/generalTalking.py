# Import necessary libraries and modules
from uagents import Agent, Context, Model
# from torch import bfloat16
# import torch
# import transformers
# from transformers import AutoTokenizer
# from time import time
# from langchain.llms import HuggingFacePipeline

# Define data models for the incoming prompts and responses
class GeneralTalkingPrompt(Model):
    prompt: str
    context: str
    
class Response(Model):
    response: str

# # Define a global variable for the language model (LLM)
# llm = None

# # Function to load and configure the LLM using Hugging Face Transformers and Langchain
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
#     global llm
#     if llm is None:
#         await load_llm()  # Load the LLM if it hasn't been loaded yet
    
    # # Define a prompt template for the LLM to generate responses
    # general_talking_prompt = """
    #    You are a friendly and knowledgeable assistant. Let's have a casual conversation. Use the context of the conversation from previous interactions to keep the dialogue coherent and relevant. If there is no context, focus on being engaging and informative without generating fictitious content.

    #     Guidelines:
    #     1. Respond to the user's queries or comments directly and meaningfully.
    #     2. Avoid conversing with yourself or generating responses that are not relevant to the user's input.
    #     3. If unsure, ask the user for more information or clarify their request.

    #     Context: {}
    #     User: {}
    #     Assistant:

    #     Note: This application can be specifically used to ask for recipes, exercises, habit tracking, and motivational quotes. Feel free to ask about these topics!
    # """
    
    # # Generate a response from the LLM using the formatted prompt
    # res = llm(prompt=general_talking_prompt.format(context, query))
    
    # # Extract the assistant's response from the generated text
    # index = res.find('Assistant')
    # index += len('Assistant:')
    # return res[index:]

# Create an agent named "general_talking" that listens on port 8004
general_talking = Agent(
    name="general_talking",
    port=8004,
    seed="GeneralTalkingAgent - Team Clutch",
    endpoint=["http://127.0.0.1:8004/submit"]
)
print(general_talking.address)  # Print the agent's address

# Handler for the startup event to load the LLM when the agent starts
@general_talking.on_event('startup')
async def start_up_function(ctx: Context):

    global llm
    ctx.logger.info("Startup event started")
    # await load_llm()  # Initialize the global llm variable

# Handler for incoming messages; processes the user's query and context
@general_talking.on_query(model=GeneralTalkingPrompt)
async def message_handler(ctx: Context, sender: str, msg: GeneralTalkingPrompt):
    global llm
    ctx.logger.info(f"Received message from {sender}")
    # response = await generate_response(context=msg.context, query=msg.prompt)  # Generate a response using the LLM
    response = "General Talking is working"
    ctx.logger.info(f"Result: {response}")
    await ctx.send(sender, Response(response=response))  # Send the generated response back to the sender

# Entry point of the script; runs the agent
if __name__ == "__main__":
    general_talking.run()
