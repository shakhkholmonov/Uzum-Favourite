import { Container, CssBaseline, Grid } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import ProductCard from "../../component/productCard";

function Favorites() {
  const {
    data: goodsData,
    isLoading,
    isError,
  } = useQuery("goods", async () => {
    const res = await axios.get("http://localhost:3001/goods");
    return res.data;
  });
  const [favoriteGoods, setFavoriteGoods] = useState([]);

  React.useEffect(() => {
    if (goodsData) {
      setFavoriteGoods(goodsData.filter((good) => good.status));
    }
  }, [goodsData]);

  const handleFavoriteToggle = (id) => {
    setFavoriteGoods((prevFavorites) => prevFavorites.filter((good) => good.id !== id));
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {favoriteGoods.map((good) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={good.id}>
              <ProductCard good={good} onFavoriteToggle={handleFavoriteToggle} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default Favorites;
