"use client";
import { useMutation } from "@tanstack/react-query";
import { Button, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import TableData from "./TableData";

const AddProducts = () => {
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    rating: { rate: 0, count: 0 },
  });

  const [product, setProduct] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load products from local storage on component mount
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProduct(storedProducts);
  }, []);

  // Update local storage whenever the 'product' state changes
  useEffect(() => {
    if (product.length > 0) {
      localStorage.setItem("products", JSON.stringify(product));
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "rating") {
      setProductData({
        ...productData,
        rating: {
          ...productData.rating, // Keep the existing count
          rate: parseFloat(value), // Update only the rate with a float value
        },
      });
    } else {
      setProductData({
        ...productData,
        [name]: value,
      });
    }
  };

  const mutation = useMutation({
    mutationFn: async (newProduct) => {
      const data = await axios.post(
        "https://fakestoreapi.com/products",
        newProduct
      );
      return data?.data;
    },
    onSuccess: (data) => {
      console.log("Product Added Successfully", data);
      setProductData({
        title: "",
        description: "",
        price: "",
        rating: { rate: 0, count: 0 }, // Reset rating to initial state
      });

      // Close the modal
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.log("Error adding product", error);
    },
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = (e) => {
    e.preventDefault();

    // Add the new product to the product list
    const newProduct = {
      ...productData,
      id: product.length + 1, // Optional: assign an ID if required
    };

    setProduct((prevProducts) => {
      const updatedProducts = [...prevProducts, newProduct];

      // Store the updated products in local storage
      localStorage.setItem("products", JSON.stringify(updatedProducts));

      return updatedProducts;
    });

    // Clear form and close the modal
    setProductData({
      title: "",
      description: "",
      price: "",
      rating: { rate: 0, count: 0 },
    });

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <h1 className="ms-20 mt-10 font-semibold text-4xl">Product Details</h1>
      <div className="flex justify-end me-20 mt-8">
        <Button type="primary" onClick={showModal}>
          Add Products
        </Button>
      </div>
      <Modal
        title="Product Details:"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <form onSubmit={handleOk}>
          <div className="space-y-5">
            <div className="sm:col-span-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Title
              </label>
              <div className="mt-2">
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter Product Title..."
                  onChange={handleChange}
                  value={productData.title}
                  className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Enter Product Description..."
                  onChange={handleChange}
                  value={productData.description}
                  className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Price
              </label>
              <div className="mt-2">
                <input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Enter Product Price..."
                  onChange={handleChange}
                  value={productData.price}
                  className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="rating"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Rating
              </label>
              <div className="mt-2 mb-8">
                <input
                  id="rating"
                  name="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  type="number"
                  placeholder="Enter Product rating..."
                  onChange={handleChange}
                  value={productData.rating.rate}
                  className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>
      <div className="mx-3 my-3 px-3 py-3">
        <TableData products={product} />
      </div>
    </>
  );
};
export default AddProducts;
