import { useEffect, useState } from "react";
import { apiGetProducts } from "../apis/product";
import { Product } from "./";
import Slider from "react-slick";
import { getNewProducts } from "../store/products/asynsActions";
import { useDispatch, useSelector } from "react-redux";

const tabs = [
  { id: 1, name: "SẢN PHẦM NỔI BẬT" },
  { id: 2, name: "SẢN PHẦM MỚI" },
];
const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
};
const BestSeller = () => {
  const [bestSellers, setBestSellers] = useState(null);
  const [activatedTab, setActivatedTab] = useState(1);
  const [products, setProducts] = useState(null);
  const dispatch = useDispatch();
  const { newProducts } = useSelector((state) => state.products);

  const fetchProducts = async () => {
    const response = await apiGetProducts({ sort: "-sold" });
    if (response.success) {
      setBestSellers(response.products);
      setProducts(response.products);
    }
  };

  useEffect(() => {
    fetchProducts();
    dispatch(getNewProducts());
  }, []);

  useEffect(() => {
    if (activatedTab === 1) setProducts(bestSellers);
    if (activatedTab === 2) setProducts(newProducts);
  }, [activatedTab]);

  return (
    <div className="shadow-lg rounded-3xl px-2 py-2 bg-gradient-to-b from-[#F9C6BA] to-[#EF5E5F]">
      <div className="flex text-[20px] gap-8 py-2 ">
        {tabs.map((el) => (
          <span
            key={el.id}
            className={`px-14 py-2 mx-4  rounded-xl font-semibold capitalize transition-all duration-300 cursor-pointer text-center flex-1
        ${
          activatedTab === el.id
            ? "bg-gradient-to-b from-[#F9C6BA] to-[#EF5E5F] text-white shadow-md scale-105"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }`}
            onClick={() => {
              setActivatedTab(el.id);
            }}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className="mt-4 mx[-10px] ">
        <Slider {...settings}>
          {products?.map((el) => (
            <Product
              key={el._id}
              pid={el._id}
              productData={el}
              isNew={activatedTab === 1 ? false : true}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BestSeller;
