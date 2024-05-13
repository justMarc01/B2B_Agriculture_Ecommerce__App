import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { CartProvider } from "./components/CartContext.js";
import { AppStack, LoginStack } from "./components/AppStack.js";
import { navigationRef } from "./components/AppNavigator.js";
import LoadingScreen from "./screens/LoadingScreen.js";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const handleLoginCheckComplete = (loggedIn) => {
    setIsLoggedIn(loggedIn);
  };

  return (
    <NavigationContainer ref={navigationRef}>
      {isLoggedIn === null ? (
        <LoadingScreen onLoginCheckComplete={handleLoginCheckComplete} />
      ) : (
        <CartProvider>
          {isLoggedIn ? <AppStack /> : <LoginStack />}
        </CartProvider>
      )}
    </NavigationContainer>
  );
};

export default App;
