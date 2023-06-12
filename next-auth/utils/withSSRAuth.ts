import { AuthTokenError } from "@/services/errors/AuthTokenError";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import decode from "jwt-decode";
import { ValidateUserPermissions } from "./ValidateUserPermissions";

type withSSRAuthOptions = {
  permissions?: string[];
  roles?: string[];
}

export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?: withSSRAuthOptions) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    const token = cookies["nextAuth.token"]

    if (!token) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    if(options){
      const user = decode<{permissions: string[], roles: string[]}>(token);
      const { permissions, roles } = options

      const userHasValidPermissions = ValidateUserPermissions({
        user,
        permissions,
        roles
      })

      if(!userHasValidPermissions){
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false,
          }
        }
      }
    }

    try {
      return await fn(ctx);

    } catch (error) {
      
      if (error instanceof AuthTokenError) {
        destroyCookie(ctx, "nextAuth.token");
        destroyCookie(ctx, "nextAuth.refreshToken");
  
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    }

  }
}