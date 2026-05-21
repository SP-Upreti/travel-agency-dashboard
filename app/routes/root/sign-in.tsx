import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { Link, redirect } from "react-router";
import { loginWithGoogle } from "~/appwrite/auth";
import { account } from "~/appwrite/client";

export async function clientLoader() {
  try {
    console.log("sign-in clientLoader: start");
    const user = await account.get();
    console.log("sign-in clientLoader: account.get() returned:", user);

    try {
      const session = await account.getSession("current");
      console.log("sign-in clientLoader: account.getSession('current'):", session);
    } catch (sErr) {
      console.log("sign-in clientLoader: no session or error fetching session:", sErr);
    }

    if (typeof document !== "undefined") console.log("sign-in clientLoader: document.cookie:", document.cookie);

    if (user && user.$id) return redirect("/dashboard");
  } catch (e) {
    console.log("Error fetching user", e);
  }
}

const signIn = () => {
  return (
    <main className="auth">
      <section className="size-full glassmorphism flex-center px-6">
        <div className="sign-in-card">
          <header className="header">
            <Link to="/">
              <img
                src="assets/icons/logo.svg"
                alt="logo"
                className="size-[30px]"
              />
            </Link>
            <h1 className="p-28-bold text-dark-100">Tourvisto</h1>
          </header>

          <article>
            <h2 className="p-28-semibold text-dark-100 text-center">
              Start Your Travel Journey
            </h2>

            <p className="p-18-regular text-center text-gray-100 !leading-7">
              Sign in with Google to manage destinations, itineraries, and user
              activity with ease.
            </p>
          </article>

          <ButtonComponent
            type="button"
            iconCss="e-search-icon"
            className="button-class !h-11 !w-full"
            onClick={loginWithGoogle}
          >
            <img
              src="/assets/icons/google.svg"
              className="size-5"
              alt="google"
            />
            <span className="p-18-semibold text-white">
              Sign in with Google
            </span>
          </ButtonComponent>
        </div>
      </section>
    </main>
  );
};

export default signIn;
