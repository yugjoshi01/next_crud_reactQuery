import { useQuery } from "@tanstack/react-query";
import { Spin, Table } from "antd";
import { useEffect, useState } from "react";
import Delete from "./Delete";
import Edit from "./Edit";
import { fetchData } from "./services/fetchData";

const TableData = ({ products }) => {
  const [product, setProduct] = useState([]);
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["data"],
    queryFn: fetchData,
  });

  // Load products from local storage when the component mounts
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProduct(storedProducts);
  }, []);

  // Update local storage whenever the product state changes
  useEffect(() => {
    if (product.length > 0) {
      localStorage.setItem("products", JSON.stringify(product));
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error?.message || "Something went wrong"}</div>;
  }

  const handleProductUpdate = (updatedProduct) => {
    // Find the index of the updated product
    const index = product.findIndex((item) => item.key === updatedProduct.key);
    if (index !== -1) {
      // Update the product in state
      const updatedProducts = [...product];
      updatedProducts[index] = updatedProduct;
      setProduct(updatedProducts);
      // Update local storage with the new product data
      localStorage.setItem("products", JSON.stringify(updatedProducts));
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div className="flex justify-start items-center gap-4 cursor-pointer">
          <Edit data={record} onProductUpdate={handleProductUpdate} />
          <Delete productKey={record.key} />
        </div>
      ),
    },
  ];

  // Map API data to table rows
  const apiData = data?.data.map((item, index) => {
    return {
      key: item.id, // Use the API's unique 'id' field if available
      no: index + 1,
      title: item.title,
      description: item.description,
      price: `${item.price}$`, // Consistent price formatting
      rating: item?.rating?.rate,
    };
  });

  // Map local storage products to table rows
  const localStorageData = products.map((item, index) => ({
    key: index + 1,
    no: (apiData?.length || 0) + index + 1, // Continue numbering after API data
    title: item.title,
    description: item.description,
    price: `${item.price}$`,
    rating: item?.rating?.rate,
  }));

  // Merge API data and new products data from local storage
  const tableData = [...(apiData || []), ...localStorageData];

  return (
    <div className="m-3 p-7">
      <Table columns={columns} dataSource={tableData} loading={isLoading} />
    </div>
  );
};

export default TableData;
