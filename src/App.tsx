import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import Main from "./components/Main";
import LogIn from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import { supabase } from "./db/supabaseClient";
import { AuthChangeEvent, Session } from "@supabase/gotrue-js";
import UserContext from "./hooks/userContext";
import Settings from "./components/Settings";
import { AnimatePresence } from "framer-motion";

const App = (): JSX.Element => {
  const [userState, setUserState] = useState({});
  let location = useLocation();

  useEffect((): (() => void) => {
    setUserState({
      user: supabase.auth.session(),
    });

    let authSubscription = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session): void => {
        setUserState({
          user: session,
        });
      }
    );

    return (): void => {
      authSubscription.data.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user: userState, setUser: setUserState }}>
      <UserContext.Consumer>
        {(): JSX.Element => {
          return (
            <>
              <Header />
              <AnimatePresence exitBeforeEnter>
                <Switch location={location} key={location.pathname}>
                  <Route path="/" exact component={Home} />
                  <Route path="/settings" exact component={Settings} />
                  <Route path="/home" exact component={Main} />
                  <Route path="/sign-up" exact component={SignUp} />
                  <Route path="/login" exact component={LogIn} />
                </Switch>
              </AnimatePresence>
            </>
          );
        }}
      </UserContext.Consumer>
    </UserContext.Provider>
  );
};

export default App;
