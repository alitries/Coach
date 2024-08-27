from uagents import Agent, Model, Context
from transformers import AutoTokenizer, AutoModelForCausalLM
import transformers
import torch
from langchain.llms import HuggingFacePipeline
import redis

class JavelinPrompt(Model):
    prompt: str

class Response(Model):
    response: str

javelin = Agent(name="Javelin",
                seed="JavelinAgent - Team Clutch",
                port=8000,
                endpoint=["http://127.0.0.1:8000/submit"])

print(javelin.address)
llm = None

#redis connection
r = redis.Redis(
  host='redis-10196.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
  port=10196,
  password='NmIqsHAYmegmO4v3ysL6hPnJQrqUsXYf')

async def load_llm():
    global llm  # Make sure llm is global so it can be accessed outside this function
    tokenizer = AutoTokenizer.from_pretrained("sahilml/javelin")
    model = AutoModelForCausalLM.from_pretrained("sahilml/javelin", load_in_4bit=True)
    query_pipeline = transformers.pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        torch_dtype=torch.float16,
        device_map="auto"
    )


    llm = HuggingFacePipeline(pipeline=query_pipeline)

async def get_response(prompt, instruction ="""
You are a javelin coach guiding the user. The user is a beginner who is just starting out in javelin training. The user may ask basic questions related to the fundamentals, technique, and how to begin training. Your role is to provide simple, clear guidance, answering only the questions asked without initiating additional questions or conversations. Do not create your own extra questions just answer the user request.
"""):
    cache_key = f"{prompt}".strip().lower()
    cached_response = r.get(cache_key)
    if cached_response:
        return cached_response.decode('utf-8')
        
    response = llm(prompt=instruction+"\n"+prompt)
    print(f"response : {response}")
    
    try:
        start = response.find('Response')
        end = start + len('Response:')
        response = response[end:]
    except:
        start_index = response.find(prompt)
        index = start_index + len(prompt) 
        # print(response[index:])
        response =  response[index:]
    
    # Cache the response in Redis for 1 hour
    r.setex(cache_key, 172800, response)

    return response
@javelin.on_event('startup')
async def startup(ctx: Context):
    global llm
    ctx.logger.info(f"Agent Javelin is up and running")
    await load_llm()
    

@javelin.on_query(model=JavelinPrompt)
async def handle_query(ctx: Context, sender: str, msg: JavelinPrompt):
    ctx.logger.info(f"Received message : {sender} ")
    response = await get_response(msg.prompt)
    ctx.logger.info(response)

    await ctx.send(sender, Response(response=response))


if __name__ == '__main__':
  javelin.run()
