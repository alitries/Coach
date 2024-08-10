from uagents import Agent, Context, Model
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Define data models for incoming prompts and outgoing responses
class Prompt(Model):
    prompt: str

class Response(Model):
    response: str

# Create an agent named 'prompt' which listens on port 8006
prompt = Agent(
    name="prompt",
    port=8006,
    seed="PromptAgent - Team clutch",
    endpoint=["http://127.0.0.1:8006/submit"],
)

# Print the agent's address to the console
print(prompt.address)

# Define the model name to be used for text classification
model_name = "rishika0704/robert-text-classification-primary"

# Asynchronous function to classify prompts using a pre-trained model
async def prompt_classifier(model_name, prompt):
    # Load the tokenizer and model using the specified model name
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)

    # Tokenize the input prompt and prepare it for the model
    inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)
    
    # Perform inference to get the logits (raw predictions) from the model
    with torch.no_grad():
        logits = model(**inputs).logits
        
        # Determine the predicted class by taking the argmax of the logits
        predicted_class = torch.argmax(logits, dim=-1).item()

        # Map the predicted class index to a human-readable label
        class_labels = {0: 'Exercise', 1: 'General Talking', 2: 'Recipe'}
        return class_labels.get(predicted_class, "Unknown")

# Event handler to process incoming messages of type 'Prompt'
@prompt.on_query(model=Prompt)
async def message_handler(ctx: Context, sender: str, msg: Prompt):
    ctx.logger.info(f"Received message from {sender}")
    
    # Classify the incoming prompt using the prompt_classifier function
    class_label = await prompt_classifier(model_name=model_name, prompt=msg.prompt)
    
    ctx.logger.info(f"Result: {class_label}")
    
    # Send the classification result back to the sender
    await ctx.send(sender, Response(response=class_label))

# Entry point to start the agent
if __name__ == "__main__":
    prompt.run()
