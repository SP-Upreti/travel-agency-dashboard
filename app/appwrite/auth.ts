import { ID, OAuthProvider, Query } from "appwrite";
import { account, tablesDB, appwriteConfig } from "~/appwrite/client";
import { redirect } from "react-router";

export const getExistingUser = async (id: string) => {
  try {
    console.log("getExistingUser: checking for user with accountId:", id);
    const { rows, total } = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userCollectionId,
      queries: [Query.equal("accountId", id)],
    });

    return total > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const storeUserData = async () => {
  try {
    console.log("storeUserData: start");
    const user = await account.get();
    console.log("storeUserData: account.get() returned:", user);
    if (!user) throw new Error("User not found");

    const createdUser = await tablesDB.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userCollectionId,
      rowId: ID.unique(),
      data: {
        accountId: user.$id,
        email: user.email,
        name: user.name.slice(0, 15),
        joinedAt: new Date().toISOString(),
      },
    });
    console.log("Created user:", createdUser);
    if (!createdUser.$id) {
      console.log("storeUserData: createdUser has no $id, redirecting to /sign-in", createdUser);
      return redirect("/sign-in");
    }

    console.log("storeUserData: createdUser:", createdUser);

    return createdUser;
  } catch (error) {
    console.error("Error storing user data:", error);
    return null;
  }
};

export const loginWithGoogle = async () => {
  try {
    console.log("loginWithGoogle: initiating OAuth2 session");
    account.createOAuth2Session({
      provider: OAuthProvider.Google,
      success: `${window.location.origin}/dashboard`,
      failure: `${window.location.origin}/404`,
    });
  } catch (error) {
    console.error("Error during OAuth2 session creation:", error);
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession({
      sessionId: "current",
    });
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const getUser = async () => {
  try {
    console.log("getUser: start");
    const user = await account.get();
    console.log("getUser: account.get() returned:", user);

    if (!user) return redirect("/sign-in");

    const { rows } = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userCollectionId,
      queries: [
        Query.equal("accountId", user.$id),
        Query.select(["name", "email", "joinedAt", "accountId"]),
      ],
    });

    console.log("getUser: fetched rows length:", rows.length);
    return rows.length > 0 ? rows[0] : redirect("/sign-in");
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
