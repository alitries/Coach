
# Coach.AI -Team Clutch

During the 2024 Olympics, it has become evident that Indian youth possess significant potential in sports, yet we are only tapping into a fraction of this capability. Common obstacles faced globally by youth in sports include inadequate guidance, training, nutrition, and motivation.

To address these challenges, we are introducing Coach AI, a comprehensive solution designed to enhance youth participation and performance in sports. Coach AI addresses five key areas:

- Sports Coach: Provides access to a well-trained coach to guide users from beginner to intermediate levels. Initially available for one sport, with plans to expand based on demand.

- Primary Agent: Features a personal nutritionist for tailored health and nutrient goals based on Indian cuisine. Includes an exercise planner that customizes workout regimens based on daily activity and sleep patterns.

- Habit Tracker: Monitors meal and workout schedules, reminding users to stay disciplined and adhere to their health routines.

- Motivational Coach: Offers motivational support through chat interactions and inspiring quotes to keep users focused on their goals.

- Mental Health Booster: Provides information on local recreational spots, including parks, book clubs, sports clubs, and yoga centers, to support mental well-being and prevent burnout.

Future updates will include cricket coaching, offering tips, tricks, and interactive Q&A sessions for enthusiasts.

Coach AI aims to bridge the gap in sports training and motivation, making professional guidance accessible and affordable for all.


## Installation

First you need to pull the repository using the followiing command in your terminal-
    ```git pull https://github.com/alitries/Coach.git```

### Frontend 
To initialize and install all the packages you must run the following command
```bash
  pnpm install
```
To run the project in your localhost you must run the following command
```bash
  pnpm start
```    

- pnpm is being used as the package management tool of choice - (You can use ```npm install``` as well if you have node package manager installed.)

    https://pnpm.io/installation


### Backend 
To download and install the libraries used in the Project Run the following command
```bash
  pip install -r requirements.txt
```
To run the project in your localhost, you'll need to refer to the documentation.


## Documentation

- Request the access for the model Llama-2-7b-chat-hf - [Hugging Face Llama 2 Model](https://huggingface.co/meta-llama/Llama-2-7b-chat-hf)
 - Now you need to create an access token.
 - Now replace the old access token wherever it is present in the code with the new access token that has been made.
    - You need to create an API key for Google Maps- https://developers.google.com/maps/documentation/javascript/get-api-key


### Backend
- Now you must create multiple terminals to run the different Python scripts.
- You need to run the Python scripts in their respective orders mentioned below.

- To run the server file you must run the following command.

      cd .\backends\
  Then run the following Python script, this script will run all the agent's servers together.

   ```python server.py```

    - First comes the feature **Primary Agent** to run this agent you need to run the following scripts in order. 

            cd .\backends\primary
        
        ```1. python exercise.py```

        ```2. python recipe.py```

        ```3. python promptClassification.py```

        ```4. python generalTalking.py```

    - The second agent is the **Motivational Quote Generator** to run this you need to run the following scripts in order.

            cd .\backends\agents

        ```1. python quote.py```

    - The third agent is the **Sports Agent** to run this you are required to run the following scripts.

            cd .\backends\agents\

        ```1. python javelin.py```
        
        ```2. python cricket.py```

    - The fourth agent is the **Habit Tracker Agent**.
        - You do not need to specifically run any file for this the server.py file will execute it.
        
    - The fifth agent is the "Mental Health Booster Agent".
        - You do not need to specifically run any file for this the server.py file will execute it.


      






## Authors

- [@alitries](https://www.github.com/alitries)
- [@Data-Scientist-Sahil](https://github.com/Data-Scientist-Sahil)
- [@rishika0704](https://github.com/rishika0704)
- [@Iamkaran47](https://github.com/Iamkaran47)
