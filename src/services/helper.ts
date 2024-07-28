export function parseJsonString(jsonString: string) {
  // Find the JSON string within the content
  const jsonRegex = /```json([\s\S]*?)```/;

  const match = jsonString.match(jsonRegex);

  if (match && match[1]) {
    const jsonContent = match[1].trim();

    try {
      const parsedJson = JSON.parse(jsonContent);

      if (parsedJson.error) {
        return undefined;
      }

      return parsedJson;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return 'Error parsing JSON';
    }
  }
}
