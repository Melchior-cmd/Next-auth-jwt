import { Can } from "@/components/Can";
import { AuthContext } from "@/contexts/AuthContext";
import { useCan } from "@/hooks/useCan";
import { setupAPIClient } from "@/services/api";
import { api } from "@/services/apiClient";
import { AuthTokenError } from "@/services/errors/AuthTokenError";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { destroyCookie } from "nookies";
import { useContext, useEffect } from "react";

export default function Dashboard() {
  const { user, signOut } = useContext(AuthContext);

  // const userCanSeeMetrics = useCan({
  //   roles: ["administrator", "editor"],
  // });

  useEffect(() => {
    api
      .get("/me")
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="flex flex-col  min-h-screen py-2 bg-gray-52 max-h-screen">
      <header className="flex  justify-center w-full">
        <h1 className=" text-3xl font-bold text-green-500 mb-2">DASHBOARD.</h1>
      </header>
      <main className="flex flex-col  mt-10 px-2 m-2 bg-gray-52 ">
        <strong className="font-bold text-green-500 mb-2">{user?.email}</strong>

        {/* {userCanSeeMetrics && <div>Métricas</div>} */}

        <Can permissions={["metrics.list"]}>
          <div className="font-bold text-green-500 mb-2">
            Permission: Métricas
          </div>
        </Can>
        <div>
          <button
            onClick={signOut}
            className="border-2 border-green-500 text-green-500 rounded-lg px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx: any) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/me");

  console.log(response.data);

  return {
    props: {},
  };
});
