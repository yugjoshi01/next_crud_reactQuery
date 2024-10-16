import { useMutation } from "@tanstack/react-query";
import { Modal } from "antd";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import edit from "../../public/image/edit.jpg";

function Edit({ data, onProductUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productData, setProductData] = useState({
    title: data.title,
    description: data.description,
    price: data.price,
    rating: { rate: data.rating, count: data.rating }, // Ensure proper structure
  });

  const mutation = useMutation({
    mutationFn: async (newProduct) => {
      const response = await axios.put(
        `https://fakestoreapi.com/products/${data.key}`, // Ensure correct ID is used
        newProduct
      );
      return response.data;
    },
    onSuccess: (updatedProduct) => {
      console.log("Product Updated Successfully", updatedProduct);
      // onProductUpdate(updatedProduct);
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.log("Error updating product", error);
    },
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = (e) => {
    e.preventDefault();
    // mutation.mutate(productData);
    onProductUpdate(productData);
    console.log("Product Updated Successfully", productData);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the state correctly for price and rating
    setProductData((prevState) => ({
      ...prevState,
      [name]: name === "price" ? parseFloat(value) : value,
      rating:
        name === "rating"
          ? { ...prevState.rating, rate: parseFloat(value) }
          : prevState.rating,
    }));
  };

  return (
    <>
      <Image src={edit} alt="edit" height={30} onClick={showModal} />
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
                  value={productData.title}
                  onChange={handleInputChange}
                  className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  value={productData.description}
                  onChange={handleInputChange}
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
                  //   type="number"
                  value={productData.price}
                  onChange={handleInputChange}
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
                  value={productData.rating.rate}
                  onChange={handleInputChange}
                  className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Edit;
