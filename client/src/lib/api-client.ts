import { hcWithType } from "server/client";

export const apiClient = hcWithType(window.location.origin);
