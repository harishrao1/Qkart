import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [items, setItems] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsFilter, setProductsFilter] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(0);

  const token = localStorage.getItem("token");

  // const product =[

  //   {
  //   "name":"Tan Leatherette Weekender Duffle",
  //   "category":"Fashion",
  //   "cost":150,
  //   "rating":4,
  //   "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
  //   "_id":"PmInA797xJhMIPti"
  //   }
  // ]

  // TODO:  - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const performAPICall = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setLoading(false);
      setProductsData(response.data);
      setProductsFilter(response.data);
      // console.log(response.data);
      return response.data;
    } catch (e) {
      setLoading(false);

      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        // console.log(e);
        // setProductsFilter(ProductsData);
        return null;
      } else {
        // console.log("error"+ e);
        enqueueSnackbar(
          "Could not fetch productsthat the backend is running, reachable and return valid JSON",
          {
            variant: "error",
          }
        );
      }
    }
  };

  // useEffect(() => {
  //   performAPICall();
  // },[])

  // TODO:  - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    console.log(text);
    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setProductsFilter(response.data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setProductsFilter([]);
        }
        if (error.response.status === 500) {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
          setProductsFilter(productsData);
        } else {
          // <SentimentDissatisfied/>
          enqueueSnackbar("No Products found", { variant: "error" });
        }
      }
    }
  };

  // TODO:  - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeOut = setTimeout(() => {
      performSearch(event.target.value);
    }, 500);

    setDebounceTimeout(timeOut);
  };

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart Details. Check that the backend is running, reacable and returns valid JSON.",
          { variant: "error" }
        );
      }
      return null;
    }
  };

  const updateCartItems = (cartData, productsData) => {
    const cartItems = generateCartItemsFrom(cartData, productsData);
    setItems(cartItems);
  };

  const isItemsInCart = (items, productId) => {
    if (items) {
      return items.findIndex((item) => item.productId === productId) !== -1;
    }
  };

  useEffect(() => {
    const onLoadHandle = async () => {
      const products = await performAPICall();
      const cartData = await fetchCart(token);
      // console.log(token);
      const cartDetails = await generateCartItemsFrom(cartData, products);
      setItems(cartDetails);
      // console.log(products);
    };
    onLoadHandle();
    // console.log(onLoadHandle);
  }, []);

  const addToCart = async (
    token,
    items,
    productsData,
    productId,
    qty,
    options = { preventDuplicates: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the cart", {
        variant: "warning",
      });
      return;
    }
    if (options.preventDuplicates && isItemsInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item",
        { variant: "warning" }
      );
      return;
    }

    try {
      const response = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updateCartItems(response.data, productsData);
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart Details. Check that the backend is running, reacable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  return (
    <div>
      <Header>
        {/* TODO: - Display search bar in the header for Products page */}

        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            className: "search",
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for Items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, debounceTimeout)}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e, debounceTimeout)}
      />

      <Grid container>
        <Grid
          item
          xs={12}
          md={token && productsData.length ? 9 : 12}
          className="product-grid"
        >
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          {loading ? (
            <Box className="loading">
              <CircularProgress />
              <h4>Loading Products...</h4>
            </Box>
          ) : (
            <Grid container marginY="1rem" paddingX="1rem" spacing={2}>
              {productsFilter.length ? (
                productsFilter.map((product) => (
                  <Grid item xs={6} md={3} key={product._id}>
                    <ProductCard
                      product={product}
                      handleAddToCart={async () => {
                        await addToCart(
                          token,
                          items,
                          productsData,
                          product._id,
                          1,
                          {
                            preventDuplicates: true,
                          }
                        );
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Box className="loading">
                  <SentimentDissatisfied color="action" />
                  <h4 style={{ color: "#636363" }}> No Products Found</h4>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
        {token && (
          <Grid item={12} md={3} bgcolor="#E9F5E1">
            <Cart
              hasCheckoutButton
              productsData={productsData}
              items={items}
              handleQuantity={addToCart}
            />
          </Grid>
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
