import { AuthContext } from "@/contexts/AuthContext";
import { ValidateUserPermissions } from "@/utils/ValidateUserPermissions";
import { useContext } from "react";

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
}


export function useCan({permissions = [] , roles = []}: UseCanParams) {
  const { user, isAuthenticated} = useContext(AuthContext);

  if (!isAuthenticated){
    return false;
  }

  const userHasValidPermissions = ValidateUserPermissions({
    user,
    permissions,
    roles
  })

  
  return userHasValidPermissions;
}