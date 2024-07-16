import React from "react";
import { TouchableOpacity, Platform } from "react-native";
import StoreScreen from "../screens/StoreScreens/StoreScreen.js";
import SearchScreen from "../screens/SearchScreen.js";
import SettingsScreen from "../screens/SettingsScreens/SettingsScreen.js";
import OrdersScreen from "../screens/OrdersScreen.js";
import CartScreen from "../screens/CartScreens/CartScreen.js";
import CategoryProductScreen from "../screens/StoreScreens/CategoryProductScreen.js";
import { createStackNavigator } from "@react-navigation/stack";
import ProductDetails from "../screens/StoreScreens/ProductDetails.js";
import Icon from "react-native-vector-icons/MaterialIcons";
import FIcon from "react-native-vector-icons/FontAwesome";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useCart } from "./CartContext.js";
import ReviewOrderScreen from "../screens/CartScreens/ReviewOrderScreen.js";
import BillingShippingScreen from "../screens/CartScreens/BillingShippingScreen.js";
import AccountScreen from "../screens/SettingsScreens/AccountScreen.js";
import LoginScreen from "../screens/LoginScreen.js";
import RegistrationScreen from "../screens/RegistrationScreen.js";
import AboutUsScreen from "../screens/SettingsScreens/AboutUs.js";
import PrivacyPolicyScreen from "../screens/SettingsScreens/PrivacyPolicy.js";
import TandCScreen from "../screens/SettingsScreens/TandCScreen.js";
import WishlistScreen from "../screens/SettingsScreens/WishListScreen.js";
import OrderDetails from "../screens/OrderDetails.js";
import ForgotPasswordScreen  from "../screens/ForgotPasswordScreen.js";
import CodeScreen from "../screens/CodeScreen.js";
import ChangePasswordScreen from "../screens/ChangePasswordScreen.js";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const StoreStack = ({ navigation }) => {
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#53B175" },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="Store"
        component={StoreScreen}
        options={{
          title: "Store",
          headerShown: true,
        }}
      />
      
      <Stack.Screen
        name="CategoryProduct"
        component={CategoryProductScreen}
        options={({ route }) => ({
          title: route.params.categoryName,
          headerShown: true,
        })}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={({ route }) => ({
          title: route.params.item.name,
          headerShown: true,
          headerTitleStyle: { fontSize: 19 },
        })}
      />
    </Stack.Navigator>
  );
};

const CartStack = () => {
  const { setCartItems } = useCart();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#53B175" },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="CartStack"
        component={CartScreen}
        options={{
          headerShown: true,
          title: "Cart",
          headerRight: () => (
            <TouchableOpacity onPress={() => setCartItems([])}>
              <FIcon
                name="trash-o"
                size={24}
                color="#53B175"
                style={{ marginRight: "5%" }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="ReviewOrderScreen"
        component={ReviewOrderScreen}
        options={{ title: "Receipt" }}
      />

      <Stack.Screen
        name="BillingShippingScreen"
        component={BillingShippingScreen}
        options={{ title: "Billing and Shipping" }}
      />
    </Stack.Navigator>
  );
};

const SearchStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#53B175" },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="SearchStack"
        component={SearchScreen}
        options={{ title: "Search" }}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={({ route }) => ({
          title: route.params.item.name,
          headerShown: true,
          headerTitleStyle: { fontSize: 19 },
        })}
      />
    </Stack.Navigator>
  );
};

const SettingsStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#53B175" },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="SettingsStack"
        component={SettingsScreen}
        options={{
          title: "Settings",
        }}
      />

      <Stack.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{
          title: "Account",
        }}
      />
      <Stack.Screen
        name="AboutUsScreen"
        component={AboutUsScreen}
        options={{
          title: "About Us",
        }}
      />

      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
        options={{
          title: "Privacy Policy",
        }}
      />
      <Stack.Screen
        name="TandCScreen"
        component={TandCScreen}
        options={{
          title: "Terms & Conditions",
        }}
      />

      <Stack.Screen
        name="WishListScreen"
        component={WishlistScreen}
        options={{ title: "Wish List" }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={({ route }) => ({
          title: route.params.item.name,
          headerTitleStyle: { fontSize: 19 },
        })}
      />
      <Stack.Screen
        name="LoginStack"
        component={LoginStack}
        options={() => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
};

const LoginStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="CodeScreen"  component={CodeScreen} />
      <Stack.Screen name="ChangePasswordScreen"  component={ChangePasswordScreen} />
      <Stack.Screen name="AppStack" component={AppStack} />
    </Stack.Navigator>
  );
};

const OrderStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#53B175" },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="MyOrders"
        component={OrdersScreen}
        options={{ title: "My Orders" }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={({ route }) => ({
          title: `Order #${route.params.orderReceipt}`,
        })}
      />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  const { totalCartItems } = useCart();
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#53B175" },
        headerTintColor: "white",
        tabBarStyle: {
          paddingBottom: Platform.OS === "ios" ? 20 : 3,
          height: 50,
          backgroundColor: "#FBFCFC",
          activeTintColor: "black",
          inactiveTintColor: "black",
        },
      }}
    >
      <Tab.Screen
        name="StoreTab"
        component={StoreStack}
        options={{
          headerShown: false,
          tabBarLabel: "Store",
          tabBarIcon: ({ color, size }) => (
            <Icon name="store" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="shopping-cart"
              type="font-awesome"
              color={color}
              size={size}
            />
          ),
          tabBarBadge: totalCartItems > 0 ? totalCartItems : null,
        }}
      />
      <Tab.Screen
        name="My Orders"
        component={OrderStack}
        options={{
          headerShown: false,
          tabBarLabel: "Orders",
          tabBarIcon: ({ color, size }) => (
            <Icon name="receipt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={() => ({
          headerShown: false,
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export { AppStack, LoginStack };
