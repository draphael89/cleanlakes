import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

// Define the Lake interface to ensure type safety
interface Lake {
  _id: ObjectId;
  name: string;
  description: string;
  imageUrl: string;
  location: {
    latitude: number;
    longitude: number;
  };
  statistics: {
    area: number;
    maxDepth: number;
    averageDepth: number;
  };
  waterQuality: {
    ph: number;
    clarity: number;
    temperature: number;
  };
  activities: string[];
}

/**
 * Fetches a lake by its ID from the database
 * @param id - The ID of the lake to fetch
 * @returns A Promise that resolves to the Lake object or null if not found
 */
export async function getLakeById(id: string): Promise<Lake | null> {
  try {
    // Connect to the MongoDB client
    const client = await clientPromise;
    // Access the 'cleanlakes' database
    const db = client.db("cleanlakes");

    // Query the 'lakes' collection for a lake with the given ID
    const lake = await db.collection("lakes").findOne({ _id: new ObjectId(id) });

    // If no lake is found, return null
    if (!lake) {
      return null;
    }

    // Cast the result to the Lake type and return it
    return lake as Lake;
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching lake by ID:", error);
    // Re-throw the error to be handled by the caller
    throw error;
  }
}

/**
 * Fetches all lakes from the database
 * @param limit - Optional parameter to limit the number of results
 * @returns A Promise that resolves to an array of Lake objects
 */
export async function getAllLakes(limit?: number): Promise<Lake[]> {
  try {
    // Connect to the MongoDB client
    const client = await clientPromise;
    // Access the 'cleanlakes' database
    const db = client.db("cleanlakes");

    // Query the 'lakes' collection for all lakes
    let query = db.collection("lakes").find();

    // If a limit is provided, apply it to the query
    if (limit) {
      query = query.limit(limit);
    }

    // Execute the query and convert the result to an array
    const lakes = await query.toArray();

    // Cast the result to an array of Lake type and return it
    return lakes as Lake[];
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching all lakes:", error);
    // Re-throw the error to be handled by the caller
    throw error;
  }
}

/**
 * Updates a lake's information in the database
 * @param id - The ID of the lake to update
 * @param updateData - An object containing the fields to update
 * @returns A Promise that resolves to the updated Lake object or null if not found
 */
export async function updateLake(id: string, updateData: Partial<Lake>): Promise<Lake | null> {
  try {
    // Connect to the MongoDB client
    const client = await clientPromise;
    // Access the 'cleanlakes' database
    const db = client.db("cleanlakes");

    // Update the lake document in the 'lakes' collection
    const result = await db.collection("lakes").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' } // This option returns the updated document
    );

    // If no lake is found or updated, return null
    if (!result) {
      return null;
    }

    // Cast the result to the Lake type and return it
    return result as Lake;
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error updating lake:", error);
    // Re-throw the error to be handled by the caller
    throw error;
  }
}

/**
 * Deletes a lake from the database
 * @param id - The ID of the lake to delete
 * @returns A Promise that resolves to true if the lake was deleted, false otherwise
 */
export async function deleteLake(id: string): Promise<boolean> {
  try {
    // Connect to the MongoDB client
    const client = await clientPromise;
    // Access the 'cleanlakes' database
    const db = client.db("cleanlakes");

    // Delete the lake document from the 'lakes' collection
    const result = await db.collection("lakes").deleteOne({ _id: new ObjectId(id) });

    // Return true if a document was deleted, false otherwise
    return result.deletedCount === 1;
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error deleting lake:", error);
    // Re-throw the error to be handled by the caller
    throw error;
  }
}