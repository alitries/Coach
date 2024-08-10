
# Coach -Team Clutch

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

- pnpm is being used as the package management tool of choice - 

    https://pnpm.io/installation


### Backend 
To download and install the libraries used in the Project Run the following command
```bash
  pip install -r requirements.txt
```
To run the project in your localhost you must run refer to the documentation.


## Documentation

- Request the access for the model Llama-2-7b-chat-hf - [Hugging Face Llama 2 Model](https://huggingface.co/meta-llama/Llama-2-7b-chat-hf)
 - Now you need to create an access token.
 - Now replace the old access token whervever that it is present there with the new access token that has been made.
    - You need to create a API key for google maps- https://developers.google.com/maps/documentation/javascript/get-api-key


### Backend
- Now you need to create multiple terminals to run the different python scripts.
- You need to run the python scripts in their respective orders mentioned below.

    - First comes the feature **Primary Agent** to run this agent you need to run the following scripts in order. 

            cd .\backends\primary-backend
        
        ```1. python exercise.py```

        ```2. python recipe.py```

        ```3. python promptClassification.py```

        ```4. python generalTalking.py```

        ```5. python primary.py```

    - The second agent is the **Quote Generator** to run this you need to run the following scripts in order.

            cd .\backends\quote-backend

        ```1. python quote.py```

        ```2. python quote_main.py```


    - The third agent is the **Sports Agent** to run this you are required to run the following script.

            cd .\backends\javelin-backend

        ```1. python javelin.py```

        ```2. python javelin_main.py```


    - The fourth agent is the **Habit Tracker Agent** for this you would need to run the following scripts.

            cd .\backends\habit-tracker-backend

        ```1. python habittracker.py```

        ```2. python habittracker_main.py```


    - The fifth agent is the "Mental Health Booster Agent" to run this agent you need to run the following scripts.

            cd .\backends\mental-health-backend

        ```1. python mental.py```

        ```2. python app.py```
