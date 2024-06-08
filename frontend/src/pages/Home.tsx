import React, { FC } from "react";
import Layout from "../compenents/Layout";
import Banner from "../compenents/Banner";
import ProductCarousel from "../compenents/ProductCarousel";

const Home: FC = () => {
    return (
            <Layout>
                <Banner />
                <ProductCarousel />
            </Layout>
    );
};

export default Home;
