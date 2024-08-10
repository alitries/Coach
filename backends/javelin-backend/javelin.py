from uagents import Agent, Model, Context
from peft import AutoPeftModelForCausalLM
from transformers import AutoTokenizer
import transformers
import torch


class JavelinePrompt(Model):
    prompt: str

class Response(Model):
    response: str

javelin = Agent(name="Javelin",
                seed="JavelinAgent - Team Clutch",
                port=8000,
                endpoint=["http://127.0.0.1:8000/submit"])

print(javelin.address)
llm = None

async def load_llm():
    global llm  # Make sure llm is global so it can be accessed outside this function
    model = AutoPeftModelForCausalLM.from_pretrained(
        "rishika0704/javelin",  # YOUR MODEL YOU USED FOR TRAINING
        load_in_4bit=True)

    tokenizer = AutoTokenizer.from_pretrained("rishika0704/javelin")
    query_pipeline = transformers.pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        torch_dtype=torch.float16,
        device_map="auto"
    )

    from transformers import pipeline as HuggingFacePipeline
    llm = HuggingFacePipeline(pipeline=query_pipeline)

async def get_response(prompt, instruction="""You are a Javelin coach guiding the user. The user is a beginner who is just starting out in javelin training. The user may ask basic questions related to the fundamentals, technique, and how to begin training. Your role is to provide simple, clear guidance, and introduce basic exercises and routines that will help the user develop the foundational skills needed to progress from a beginner to an intermediate level in javelin."""):
    response = llm(prompt=instruction+"\n"+prompt)
    index = response.find("Response:") + len("Response:")
    return response[index:]

@javelin.on_event('startup')
async def startup(ctx: Context):
    global llm
    ctx.logger.info(f"Agent javelin is up and running")
    await load_llm()
    

@javelin.on_query(model=JavelinePrompt)
async def handle_query(ctx: Context, sender: str, msg: JavelinePrompt):
    ctx.logger.info(f"Received message : {sender} ")
    response = await get_response(msg.prompt)
    # response = "Javelin is working"

    await ctx.send(sender, Response(response=response))


if __name__ == '__main__':
  javelin.run()
