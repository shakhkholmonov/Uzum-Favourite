import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { Box, Card, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { addToBagMutation, patchtoBagMutation } from "../hooks/addToBag";
import GetGoods from "../hooks/getGoods";

const ProductCard = ({ good, onFavoriteToggle }) => {
  const [status, setStatus] = useState(good && good.status);
  const { bagGoods } = GetGoods();
  const queryClient = useQueryClient();

  const { addToBag } = addToBagMutation();
  const { patchtoBag } = patchtoBagMutation();

  const { mutate: updateStatus } = useMutation(
    async (newStatus) => {
      await axios.patch(`http://localhost:3001/goods/${good.id}`, { status: newStatus });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("goods");
      },
    }
  );

  const handleLike = async (e) => {
    e.preventDefault();
    const newStatus = !status;
    setStatus(newStatus);
    updateStatus(newStatus);
    if (onFavoriteToggle) {
      onFavoriteToggle(good.id);
    }
  };

  const handleBag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isProductExist = bagGoods.find((prod) => +prod.prod_id === +good.id);

    if (isProductExist === undefined) {
      addToBag(good && { productId: good.id, media: good.media[0], title: good.title });
    } else {
      isProductExist &&
        patchtoBag(
          good && {
            productId: isProductExist.id,
            productNum: isProductExist.num,
            media: good.media[0],
            title: good.title,
          }
        );
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        borderRadius: "5px",
        overflow: "hidden",
      }}
    >
      <CardMedia
        component="img"
        alt={good.title}
        height="200px"
        image={good.media[0]}
        title={good.title}
        sx={{
          objectFit: "contain",
          zIndex: 1,
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      />
      <IconButton
        size="small"
        aria-label="like"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          zIndex: 2,
        }}
        onClick={handleLike}
      >
        <FavoriteBorderOutlinedIcon sx={{ color: status ? "red" : "grey" }} fontSize="small" />
      </IconButton>
      <CardContent sx={{ flex: "1 0 auto", paddingBottom: 0 }}>
        <Typography color="#3B3C36" variant="subtitle1" component="h6" noWrap>
          {good.title}
        </Typography>
        <Typography mt={2} marginBottom="5%" variant="caption" component="mark">
          {Math.floor((good.price * 12) / 100)} So'm/oyiga
        </Typography>
        <Box mt={4} marginBottom="10%" display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography variant="body2" color="textSecondary" component="del">
              {good.price - Math.floor((good.price * good.salePercentage) / 100)} So'm
            </Typography>
            <Typography sx={{ fontSize: "16px" }} variant="body2" component="span">
              {good.price} So'm
            </Typography>
          </Box>
          <IconButton size="small" aria-label="add to bag" onClick={handleBag}>
            <AddOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
