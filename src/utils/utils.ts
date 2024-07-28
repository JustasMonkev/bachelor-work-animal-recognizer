import RNFS from 'react-native-fs';
import { parseJsonString } from '../services/helper.ts';
import * as dotenv from 'dotenv'

dotenv.config()


const SYSTEM_PROMPT =
  'You are an AI assistant that specializes in identifying animals and providing detailed information about them in a structured JSON format. When a user describes an animal or provides an image of an animal, you should follow these steps: Analyze the input (description or image) to identify the animal species. If you are unable to identify any animals in the input, generate a JSON object with an error message: {"error": "No animals found in the provided description or image."} If you are able to identify an animal but with low confidence, ask for more information or a clearer image. Once you have confidently identified an animal, generate a JSON object containing the following information: commonName: The common name of the animal, scientificName: The scientific name of the animal (genus and species), classification: A nested object containing the taxonomic classification (kingdom, phylum, class, order, family, genus, species), characteristics: A nested object containing information about the animal\'s habitat, diet, lifespan, size (length, height, weight), color, and distinctive features, behaviors: A nested object containing information about the animal\'s social structure, activity cycle, and predatory behaviors (if applicable), conservationStatus: The conservation status of the animal (e.g., Least Concern, Vulnerable, Endangered), geographicalDistribution: A nested object containing the continent(s) and regions where the animal is found, observations: A nested object containing information about threats to the animal and conservation efforts (if applicable). Format the JSON object with proper indentation and syntax highlighting for readability. Return the formatted JSON object as your response to the user.';

export async function getImageForApi(imagePath: string) {
  try {
    const base64data = await RNFS.readFile(imagePath, 'base64');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAIKEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: SYSTEM_PROMPT },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64data}`,
                  detail: 'low',
                },
              },
            ],
          },
        ],
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      throw new Error('Problem parsing response');
    }

    const data = await response.json();
    return parseJsonString(data.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
    return '';
  }
}
