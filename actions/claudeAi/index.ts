import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";



export default async function questionGen(userMessage: string) {
  const client = new BedrockRuntimeClient({
    region: "eu-north-1",
  });

  try {
    const command = new InvokeModelCommand({
      modelId: "arn:aws:bedrock:eu-north-1:861733927103:inference-profile/eu.amazon.nova-lite-v1:0", // Replace with your model ID or ARN
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        messages: [
          {
            role: "user", 
            content: [{text:userMessage}], // FIX: Use a string instead of an array
          },
        ],
        
      }),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.output.message.content[0].text;

  } catch (err) {
    console.error("Bedrock API Error:", err);
    return null;
  }
}





import { BedrockClient, ListFoundationModelsCommand } from "@aws-sdk/client-bedrock";

export async function modelsList() {
  const client = new BedrockClient({
    region: "eu-north-1"
    
  });

  try {
    const command = new ListFoundationModelsCommand({});
    const response = await client.send(command);

    return   response.modelSummaries
  } catch (error) {
    console.error(error);
    return null
  }
}
