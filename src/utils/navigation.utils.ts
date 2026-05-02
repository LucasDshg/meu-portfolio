import { RiGithubLine, RiLinkedinLine, RiMailLine } from "react-icons/ri";
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
    ? profile.menu.filter((item) => item.show).sort((a, b) => a.order - b.order)
    : [];

  return {
    ...path,
    menus,
  };
};

export const getSocialIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("github")) return RiGithubLine;
  if (lowerName.includes("linkedin")) return RiLinkedinLine;
  if (lowerName.includes("mail") || lowerName.includes("email"))
    return RiMailLine;
  return null;
};

export const getSocialHref = (name: string, link: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("mail") || lowerName.includes("email")) {
    return `mailto:${link}`;
  }
  return link;
};
