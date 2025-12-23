$env:SERVERLESS_FRAMEWORK_FORCE_UPDATE="true"
$env:AWS_ACCESS_KEY_ID="AKIA2RX2VKB5SSW7ALUM"
$env:AWS_SECRET_ACCESS_KEY="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"
$env:HASURA_JWT_SECRET="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
<!-- $env:GOOGLE_API_KEY="AIzaSyDA2I8HZxgsoffCsIwMMzP7W1Gm_5r1cIQ" -->
$env:GOOGLE_API_KEY="AIzaSyBzBPEjGPJpTeiaFw_NCsO6wsLxqOAN0qk"

node --env-file=.env .build/src/tests/index.js registration


3. **AI Twin (Personal AI Assistant)**
   Every user has an AI twin capable of drafting replies, handling basic conversations when the user is unavailable. Users can enable or disable AI-assisted responses at any time.
(surrently we r only building backend)
great work till now and i am really learning
now lets implement the reply action
ie ai_twin_reply
lets change it to 
input -> group id, few prev messages for context (ie we will genrated respons for wt to reply next) we will take the grp id (ie the query) get few pervious msgs (ie context)
output -> string.. as it is
basically we will generate next response in the grp for which we will pass it to gemini
already gemini utils file is present 

but be pacient and understand steps
1st update the hasura to take the period
@actions.graphql @actions.yaml 
2nd apply the changes in action input and use "hasura.exe metadata apply" to apply it (dont use hasura metadata... use hasura.exe metadata apply)
3rd in the model, schema, handler, and utils perfectly define the logic and code as per past logics... 
make sure u define types as it is ts
4th serverless deploy
5. update the url into hasura actions.yaml and then hasura.exe metadata apply
6. make tests.... for testing