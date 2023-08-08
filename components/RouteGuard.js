import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { isAuthenticated } from "../lib/authenticate";

import { useAtom } from "jotai";
import { favouritesAtom } from "../store";
import { searchHistoryAtom } from "../store";

import { getFavourites, getHistory } from "../lib/userData";

const PUBLIC_PATHS = ["/login", "/", "/_error", "/register", "/items"];

export default function RouteGuard(props) {
  const router = useRouter();
  const { objectID } = router.query;
  PUBLIC_PATHS.push(`/artwork/${objectID}`);

  const [authorized, setAuthorized] = useState(false);

  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

  useEffect(() => {
    updateAtoms();
    authCheck(router.pathname);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    return () => {
      router.events.off("routeChangeComplete", authCheck);
    };
  }, []);

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    const path = url.split("?")[0];
    if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
      setAuthorized(false);
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }

  async function updateAtoms() {
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  }

  return <>{authorized && props.children}</>;
}
