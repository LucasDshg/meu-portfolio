import { useLocation } from "react-router-dom";
import { IProfile } from "../interface/portfolio.interface";
export const pathName = () => {
  const { pathname } = useLocation();

  const slug = pathname.startsWith("/u/") ? pathname.split("/")[2] : undefined;
  return {
    slug,
    pathname,
    basePath: slug ? `/u/${slug}` : "/",
  };
};

export const useNavigationMenu = (profile: IProfile) => {
  const path = pathName();

  const menus = profile?.menu
    ? Object.entries(profile.menu)
        .filter(([_, value]) => value.show)
        .map(([id, value]) => ({ id, ...value }))
        .sort((a, b) => a.order - b.order)
    : [];

  return {
    ...path,
    menus,
  };
};
