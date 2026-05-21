import { Account, Client, TablesDB, Storage } from "appwrite";

const getAppwriteEndpoint = () => {
  if (import.meta.env.DEV && typeof window !== "undefined") {
    return `${window.location.origin}/appwrite/v1`;
  }

  return import.meta.env.VITE_APPWRITE_API_ENDPOINT;
};

export const appwriteConfig = {
  endpointUrl: "https://fra.cloud.appwrite.io/v1",
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  apiKey: import.meta.env.VITE_APPWRITE_API_KEY,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  userCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  tripCollectionId: import.meta.env.VITE_APPWRITE_TRIPS_COLLECTION_ID,
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpointUrl)
  .setProject(appwriteConfig.projectId);

const account = new Account(client);
const tablesDB = new TablesDB(client);
const storage = new Storage(client);

export { client, account, tablesDB, storage };
