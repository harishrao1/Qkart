import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
// import { makeStyles } from '@material-ui/core/styles';
// import { makeStyles } from "@material-ui/core/styles";

// const useStyles = makeStyles({
//   card: {
//     maxWidth: 345,
//     boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.3)",
//     backgroundColor: "#fafafa",
//   },
//   media: {
//     height: 300,
//   },
// });

const ProductCard = ({ product, handleAddToCart }) => {
  // const classes = useStyles();
  // console.log(handleAddToCart);
  return (
    <Card className="card">
        <CardMedia 
          component="img"
          heigth="200"
          image={product.image}
          alt={product.name}
        />
        <CardContent>
          <Typography >
            {product.name}
          </Typography>
          <Typography paddingY="0.5rem" fontWeight="700">
            ${product.cost}
          </Typography>
          <Rating  
            name="read-only"
            value={product.rating}
            readOnly
            precision={0.5}
          // emptyIcon={fontSize="inherit"}
          >
          </Rating>
        </CardContent>
      <CardActions className="card-actions">
        <Button 
          className="card-button"
          variant="contained" 
          fullWidth
          color="primary"
          startIcon={<AddShoppingCartOutlined/>}
          onClick={handleAddToCart}
           >
            Add to cart
            </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
