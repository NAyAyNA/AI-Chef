import { HfInference } from '@huggingface/inference'

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`

export async function getRecipeFromMistral(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ");
    try {
        const response = await fetch("https://chef-backend-73jvg2q41-nayanas-projects-db83b834.vercel.app/api/query", { // Ensure correct endpoint
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `I have ${ingredientsString}. Suggest a recipe!`
            }),
        });

        if (!response.ok) {
            // Log the HTTP error status and the response content
            const errorData = await response.json();
            console.error("API Response Error:", errorData);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);
        return data?.[0]?.generated_text || "No recipe found.";
    } catch (err) {
        // More detailed error log
        console.error("Error fetching recipe:", err);
        return "Error fetching recipe.";
    }
}



