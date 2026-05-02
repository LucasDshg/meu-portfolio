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

  const slug = profile?.slug || path.slug;
  const basePath = slug ? `/u/${slug}` : "/";

  const menus = profile?.pages
    ? Object.entries(profile.pages)
        .map(([id, page]) => ({
          id,
          href: id === "home" ? basePath : `${basePath}/${id}`,
          ...page,
        }))
        .filter((page) => page.show)
        .sort((a, b) => a.order - b.order)
    : [];

  return {
    ...path,
    slug,
    basePath,
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
