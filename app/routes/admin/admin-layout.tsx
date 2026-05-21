import { Outlet, redirect } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { MobileSidebar, NavItems } from "../../../components";
import { account } from "~/appwrite/client";
import { getExistingUser, storeUserData } from "~/appwrite/auth";

export async function clientLoader() {
  try {
    console.log("admin clientLoader: start");
    const user = await account.get();
    console.log("admin clientLoader: account.get() returned:", user);

    try {
      const session = await account.getSession("current");
      console.log("admin clientLoader: account.getSession('current'):", session);
    } catch (sErr) {
      console.log("admin clientLoader: no session or error fetching session:", sErr);
    }

    if (!user || !user.$id) {
      console.log("admin clientLoader: no authenticated user, redirecting to /sign-in");
      if (typeof document !== "undefined") console.log("document.cookie:", document.cookie);
      return redirect("/sign-in");
    }

    const existingUser = await getExistingUser(user.$id);
    console.log("admin clientLoader: existingUser:", existingUser);

    if (existingUser?.status === "user") {
      console.log("admin clientLoader: user has 'user' status, redirecting to /", existingUser);
      return redirect("/");
    }

    const result = existingUser?.$id ? existingUser : await storeUserData();
    console.log("admin clientLoader: returning result:", result);
    return result;
  } catch (e) {
    console.log("Error in clientLoader", e);
    if (typeof document !== "undefined") console.log("document.cookie:", document.cookie);
    return redirect("/sign-in");
  }
}

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <MobileSidebar />

      <aside className="w-full max-w-67.5 hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>

      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
};

export default AdminLayout;
