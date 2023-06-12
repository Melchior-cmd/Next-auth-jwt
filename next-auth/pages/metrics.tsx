import { setupAPIClient } from "@/services/api";
import { withSSRAuth } from "@/utils/withSSRAuth";

export default function Metrics() {
  return (
    <div className="flex flex-col  min-h-screen py-2 bg-gray-52 max-h-screen ">
      <h1 className="text-3xl font-bold text-green-500 mb-2 flex  justify-center w-full">
        Metrics
      </h1>
    </div>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx: any) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/me");

    return {
      props: {},
    };
  },
  {
    permissions: ["metrics.list"],
    roles: ["administrator"],
  }
);
