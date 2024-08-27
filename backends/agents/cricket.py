from uagents import Agent, Model, Context
# from peft import AutoPeftModelForCausalLM
from transformers import AutoTokenizer, AutoModelForCausalLM
import transformers
import torch
from langchain.llms import HuggingFacePipeline
import redis

class CricketPrompt(Model):
    prompt: str

class Response(Model):
    response: str

cricket = Agent(name="Cricket",
                seed="CricketAgent - Team Clutch",
                port=8008,
                endpoint=["http://127.0.0.1:8008/submit"])

print(cricket.address)

r = redis.Redis(
  host='redis-18694.c89.us-east-1-3.ec2.redns.redis-cloud.com',
  port=18694,
  password='wHSkARPylwqiGmFkgeKjBqgVJ4AfnP9X')
llm = None

async def load_llm():
    global llm  # Make sure llm is global so it can be accessed outside this function
    tokenizer = AutoTokenizer.from_pretrained("rishika0704/cricket")
    model = AutoModelForCausalLM.from_pretrained("rishika0704/cricket", load_in_4bit=True)
    query_pipeline = transformers.pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        torch_dtype=torch.float16,
        device_map="auto"
    )


    llm = HuggingFacePipeline(pipeline=query_pipeline)

async def get_response(prompt, instruction ="""
You are a cricket coach guiding the user. The user is a beginner who is just starting out in cricket training. The user may ask basic questions related to the fundamentals, technique, and how to begin training. Your role is to provide simple, clear guidance, answering only the questions asked without initiating additional questions or conversations. Do not create your own extra questions just answer the user request.
"""):
    cache_key = f"{prompt}".strip().lower()
    cached_response = r.get(cache_key)
    if cached_response:
        return cached_response.decode('utf-8')
    response = llm(prompt=instruction+"\n"+prompt)
    start_index = response.find(prompt)
    index = start_index + len(prompt) - 1
    # print(response[index:])
    response = response[index:]
    r.setex(cache_key, 172800, response)

    return response

@cricket.on_event('startup')
async def startup(ctx: Context):
    global llm
    ctx.logger.info(f"Agent Cricket is up and running")
    await load_llm()
    

@cricket.on_query(model=CricketPrompt)
async def handle_query(ctx: Context, sender: str, msg: CricketPrompt):
    ctx.logger.info(f"Received message : {sender} ")
    response = await get_response(msg.prompt)
    ctx.logger.info(response)
    # response = "Cricket is working"

    await ctx.send(sender, Response(response=response))


if __name__ == '__main__':
  cricket.run()
