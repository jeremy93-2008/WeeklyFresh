import NProgress from "nprogress";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function navigateWithProgress(
  router: AppRouterInstance,
  url: string,
  method: "push" | "replace" = "push"
) {
  NProgress.start();
  router[method](url);
}
